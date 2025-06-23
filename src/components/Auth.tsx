"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailSignIn, setShowEmailSignIn] = useState(false);
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

      const { error, data } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;

      // Redirect to home page after successful sign in
      router.push("/");
    } catch (err) {
      console.error("Auth error:", err);
      if (err instanceof Error) {
        // Handle generic error messages in a user-friendly way
        const message = err.message.toLowerCase();
        if (message.includes("network")) {
          setError("Network error. Please check your internet connection.");
        } else if (message.includes("invalid")) {
          setError("Invalid email or password");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
      // router.push("/");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // router.push("/");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="flex min-h-[85vh] w-full max-w-xl flex-col items-center justify-center p-4 pt-20">
          <div className="w-full max-w-md">
            {/* Logo and Branding */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 flex items-center justify-center gap-4 text-4xl font-bold">
                <Image
                  src="/logo-og.png"
                  alt="Pixel Nova Logo"
                  width={64}
                  height={64}
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Pixel Nova
                </span>
              </h1>
            </div>

            {/* Auth Card */}
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl transition duration-300 group-hover:opacity-100"></div>
              <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 hover:border-purple-500/50">
                <div className="mb-6 text-start">
                  <h2 className="text-2xl font-bold text-white">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-slate-300">
                    Continue your pixel art journey
                  </p>
                </div>

                {/* Terms and Privacy Alert */}
                <div className="mb-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 text-center text-sm text-slate-300">
                  <p>
                    By signing in, you agree to our
                    <br />
                    <Link
                      href="/terms-of-service"
                      className="text-purple-400 transition-colors hover:text-purple-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-purple-400 transition-colors hover:text-purple-300"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Social Sign In Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 font-medium text-white transition-all hover:border-slate-600/50 hover:bg-slate-800/50 disabled:opacity-50"
                  >
                    {loading ? (
                      "Loading..."
                    ) : (
                      <>
                        <GoogleIcon className="h-5 w-5" />
                        Continue with Google
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGitHubSignIn}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 font-medium text-white transition-all hover:border-slate-600/50 hover:bg-slate-800/50 disabled:opacity-50"
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
                </div>

                {/* Legacy Email Sign In Toggle */}
                {!showEmailSignIn && (
                  <button
                    onClick={() => setShowEmailSignIn(true)}
                    className="mt-6 w-full text-center text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    Sign in with existing email account
                  </button>
                )}

                {/* Legacy Email Sign In Form */}
                {showEmailSignIn && (
                  <>
                    <div className="my-6 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-slate-800/50 px-2 text-slate-400">
                            Existing email account sign in
                          </span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-slate-700/50 bg-slate-900/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-slate-700/50 bg-slate-900/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
                      />
                      <div className="text-right">
                        <Link
                          href="/reset-password"
                          className="text-sm text-slate-400 transition-colors hover:text-white"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 hover:shadow-xl"
                      >
                        {loading ? "Loading..." : "Sign In"}
                      </Button>
                    </form>
                  </>
                )}

                {error && (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
