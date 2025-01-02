"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Clean email by removing content between + and @ if it exists
      const cleanEmail = email.includes("+")
        ? email.replace(/\+[^@]*(?=@)/, "")
        : email;

      if (mode === "signin") {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;

        // Redirect to home page after successful sign in
        router.push("/");
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        // Show success message for signup
        toast({
          title: "Check your email",
          description:
            "We sent you a confirmation link. Please check your email to complete your registration.",
          duration: 6000,
          className: "bg-black border border-white/10",
        });

        // Clear the form
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Note: GitHub OAuth will handle the redirect automatically
      // but we can still redirect here as a fallback
      router.push("/");
    } catch (err) {
      console.error("Sign in error:", err);
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
            <div className="mb-8 text-start">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
                Pixel Nova
              </h1>

              <Separator className="my-4" />
            </div>
            <div className="mb-6 text-start">
              <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
              <p className="mt-2 text-sm text-white/80">
                {mode === "signin"
                  ? "Sign in to continue creating"
                  : "Create a new account"}
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="mb-6 space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
              />
              {mode === "signin" && (
                <div className="text-right">
                  <Link
                    href="/reset-password"
                    className="text-sm text-white/80 hover:text-white"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
              {mode === "signup" && (
                <Input
                  type="confirm-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-white/20 bg-black/50 text-white placeholder:text-white/50"
                />
              )}
              <Button
                type="submit"
                disabled={
                  mode === "signin"
                    ? loading
                    : loading || !password || password !== confirmPassword
                }
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {loading
                  ? "Loading..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Sign Up"}
              </Button>
            </form>

            <div className="mb-6 text-center">
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-sm text-white/80 hover:text-white"
              >
                {mode === "signin"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black/80 px-2 text-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-black/80 disabled:opacity-50"
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <GithubIcon className="h-5 w-5" />
                  Continue with GitHub
                </>
              )}
            </button>

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

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
