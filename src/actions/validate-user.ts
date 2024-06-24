"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const validateUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("Unauthenticated");
  }

  const existingUser = await db.user.findUnique({ where: { id: user.id } });

  if (!existingUser) {
    redirect("/auth-callback");
  }

  return user;
};
