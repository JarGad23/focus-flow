"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    throw new Error("User not found");
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
        userImg: "/user-fallback.png",
        username: `user_${Math.floor(100000 + Math.random() * 900000)}`,
      },
    });
  }

  return { success: true };
};
