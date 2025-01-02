"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://editor.pixelnova.app/update-password",
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description:
          "We've sent you a password reset link. Please check your email to continue.",
        duration: 6000,
        className: "bg-black border border-white/10",
      });

      setEmail("");
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 via-[#300171] to-slate-900">
        <Toaster />
        <div className="flex min-h-[85vh] w-full max-w-xl flex-col items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/80 p-8 shadow-lg backdrop-blur-sm duration-500 animate-in fade-in">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
                Reset Password
              </h1>
              <p className="text-white/90 drop-shadow-md">
                Enter your email to receive a reset link
              </p>
              <Separator className="my-4" />
            </div>

            <form onSubmit={handleResetPassword} className="mb-6 space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-white/80 hover:text-white"
              >
                Back to Sign In
              </Link>
            </div>

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
