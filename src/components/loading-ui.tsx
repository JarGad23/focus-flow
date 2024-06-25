import { Loader2 } from "lucide-react";

export const LoadingUI = () => {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Loading your data...</h3>
      </div>
    </div>
  );
};
