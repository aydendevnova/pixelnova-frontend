import { useCredits } from "@/hooks/use-credits";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function CreditsDisplay() {
  const { credits, isLoading } = useCredits();
  return (
    <Link
      href="/buy"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium text-white">
          {isLoading ? "..." : credits} Credits
        </span>
      </div>
    </Link>
  );
}
