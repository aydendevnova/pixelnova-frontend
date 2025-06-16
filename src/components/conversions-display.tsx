import useUser from "@/hooks/use-user";
import { Repeat } from "lucide-react";
import Link from "next/link";

export function ConversionsDisplay() {
  const { profile, isLoading } = useUser();
  const isPro = profile?.tier === "PRO";

  return (
    <Link
      href="/pricing"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5">
        <Repeat className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-white">
          {isLoading
            ? "..."
            : isPro
              ? "Unlimited Conversions"
              : "0/10 Conversions"}
        </span>
      </div>
    </Link>
  );
}
