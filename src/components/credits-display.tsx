import useUser from "@/hooks/use-user";
import { PLAN_LIMITS } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function CreditsDisplay() {
  const { profile, isLoading } = useUser();
  return (
    <Link
      href="/pricing"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium text-white">
          {isLoading || profile?.generation_count == null
            ? "..."
            : profile?.generation_count}{" "}
          /{PLAN_LIMITS[profile?.tier ?? "NONE"].MAX_GENERATIONS} Generations
        </span>
      </div>
    </Link>
  );
}
