"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getAuthStatus } from "./actions";
import { useRouter } from "next/navigation";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });

  if (data?.success) {
    router.push("/dashboard");
  }

  return (
    <div className="h-full">
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
