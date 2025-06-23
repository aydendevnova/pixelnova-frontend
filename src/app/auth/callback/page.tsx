"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const error_description = searchParams.get("error_description");

        if (!!error || !!error_description) {
          throw new Error(
            error_description ?? error ?? "Authentication failed",
          );
        }

        if (!code) {
          throw new Error("No code provided in callback");
        }

        const { error: sessionError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) throw sessionError;

        // Verify the session was created
        const {
          data: { session },
          error: verifyError,
        } = await supabase.auth.getSession();
        if (!!verifyError || !session) {
          throw verifyError ?? new Error("Failed to create session");
        }

        // Successful login - redirect to home
        router.push("/");
        router.refresh(); // Refresh to update auth state across the app
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );
        // Delay the redirect slightly to show the error
        setTimeout(() => {
          router.push(
            "/login?error=" +
              encodeURIComponent(
                error instanceof Error
                  ? error.message
                  : "Authentication failed",
              ),
          );
        }, 1500);
      }
    };

    void handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-500">
            Authentication Error
          </h2>
          <p className="text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
