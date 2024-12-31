"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function SignInModal({
  isOpen,
  onClose,
  featureName = "this feature",
}: SignInModalProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Sign in required
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please sign in to use {featureName}. It only takes a few seconds
              and all your work will be saved automatically.
            </p>
            <p className="text-sm text-muted-foreground">
              Join our creative community today!
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSignIn}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue to sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
