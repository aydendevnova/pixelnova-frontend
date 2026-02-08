"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onExport?: () => Promise<void>;
}
export function SignInModal({
  isOpen,
  onClose,
  featureName = "this feature",
  onExport,
}: SignInModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditorRoute = pathname === "/editor";
  const isPricingRoute = pathname === "/pricing";

  const handleSignIn = async () => {
    if (onExport && isEditorRoute) {
      try {
        await onExport();
      } catch (error) {
        console.error("Failed to export:", error);
      }
    }
    router.push("/login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-slate-700/50 bg-slate-800/50 backdrop-blur sm:max-w-[425px]">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
        <div className="relative">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
              {isPricingRoute
                ? "Sign in to upgrade your account"
                : "Sign in for free to continue"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-6">
            <div className="space-y-4">
              <p className="text-base text-slate-200">
                {isPricingRoute
                  ? "Unlock premium features and take your creativity to the next level. Create a free account in seconds to get started."
                  : `Continue with ${featureName} and keep your work automatically saved. Sign in takes just a moment.`}
              </p>
              <p className="text-base text-slate-200">
                Access exclusive tools and features today!
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignIn}
                className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 hover:shadow-xl"
              >
                {isPricingRoute
                  ? "Login or Create Account"
                  : isEditorRoute
                    ? "Export canvas and sign in"
                    : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
