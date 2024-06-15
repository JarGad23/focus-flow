import { Board } from "@/components/board";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    return redirect("/");
  }

  return <Board />;
};

export default DashboardPage;
