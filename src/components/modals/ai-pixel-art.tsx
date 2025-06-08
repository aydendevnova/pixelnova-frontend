"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkle, Info } from "lucide-react";

interface AIPixelArtModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AIPixelArtModal({
  open,
  onClose,
}: AIPixelArtModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Pixel Art Generator</DialogTitle>
          <DialogDescription>Coming soon.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-6 p-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Sparkle className="h-12 w-12 text-primary" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold">Coming Soon!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We're working on an advanced AI system that will help you create
              stunning pixel art from text descriptions or reference images.
            </p>
          </div>

          <Alert>
            <Info className="mr-2 h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Planned Features:</p>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Text-to-pixel-art generation</li>
                  <li>Style transfer from reference images</li>
                  <li>Smart upscaling and detailing</li>
                  <li>Automatic palette generation</li>
                  <li>Multiple art style options</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
