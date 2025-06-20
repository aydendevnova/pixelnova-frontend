import useUser from "@/hooks/use-user";
import { PLAN_LIMITS } from "@/lib/constants";
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
              : `${profile?.conversion_count ?? 0}/${
                  PLAN_LIMITS[profile?.tier ?? "NONE"].MAX_CONVERSIONS
                } Conversions`}
        </span>
      </div>
    </Link>
  );
}
