"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a password reset flow
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };

    void checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description:
          "Your password has been successfully updated. You can now sign in with your new password.",
        duration: 6000,
        className: "bg-black border border-white/10",
      });

      // Clear form and redirect to sign in
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (err) {
      console.error("Update password error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 via-[#300171] to-slate-900">
        <div className="flex min-h-[85vh] w-full max-w-xl flex-col items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/80 p-8 shadow-lg backdrop-blur-sm duration-500 animate-in fade-in">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
                Update Password
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Enter your new password
              </p>
              <Separator className="my-4" />
            </div>

            <form onSubmit={handleUpdatePassword} className="mb-6 space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                disabled={loading || !password || password !== confirmPassword}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 rounded-md bg-red-500/20 p-3 text-center text-sm text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
