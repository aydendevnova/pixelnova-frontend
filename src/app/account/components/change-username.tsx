"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCheckUsername } from "@/hooks/use-api";
import { usernameRegex, checkUsernameSchema } from "@/shared-types";

type ChangeUsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
  onOpen: () => void;
  currentUsername?: string;
};

export default function ChangeUsernameModal({
  isOpen,
  onClose,
  onSave,
  onOpen,
  currentUsername,
}: ChangeUsernameModalProps) {
  const [username, setUsername] = useState(currentUsername ?? "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: checkUsername } = useCheckUsername();

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setError(null);
    setIsAvailable(null);
  };

  const handleCheckUsername = async () => {
    if (!username) return;

    const sanitizedUsername = username.toLowerCase().trim();
    //validate username
    if (!usernameRegex.test(sanitizedUsername)) {
      setError("Username must contain only letters, numbers, and underscores");
      return;
    }

    // check with zod too
    const result = checkUsernameSchema.safeParse({
      username: sanitizedUsername,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid username");
      return;
    }

    setIsChecking(true);
    try {
      const { available, blacklisted } = await checkUsername({
        username,
      });

      setIsAvailable(available);
      if (blacklisted) {
        setError("This username is blacklisted");
      } else if (!available) {
        setError("This username is already taken");
      }
    } catch (err) {
      setError("Error checking username availability");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    if (!username || !isAvailable) return;
    onSave(username);
  };

  function resetModal() {
    setUsername(currentUsername ?? "");
    setIsAvailable(null);
    setError(null);
    setIsChecking(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-slate-700/50 bg-slate-800/70 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-white">Change Username</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter new username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="border-slate-700/50 bg-slate-800/50 text-white"
              />
              <Button
                onClick={handleCheckUsername}
                disabled={!username || isChecking}
              >
                {isChecking ? "Checking..." : "Check"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {isAvailable && (
              <p className="text-sm text-green-600">Username is available!</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetModal();
                onClose();
              }}
              className="border-slate-700/50 bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                resetModal();
                handleSave();
              }}
              disabled={!username || !isAvailable}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
