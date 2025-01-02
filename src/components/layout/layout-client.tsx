"use client";
import { UserProvider } from "@/hooks/use-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { env } from "@/env";
import Header from "./header";
import { ErrorBoundary } from "../error-boundary";
import ErrorView from "../error-view";
import { WasmProvider } from "../wasm-provider";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Create a Supabase client
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname == "/") {
      window.scrollTo(0, 0);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <UserProvider>
          <div
            className={`relative flex min-h-screen flex-col ${
              pathname == "/" ? "overflow-hidden" : ""
            }`}
          >
            <Header />
            <WasmProvider>
              <ErrorBoundary
                fallback={({ error, reset }) => (
                  <ErrorView error={error} reset={reset} />
                )}
              >
                <Toaster />
                {children}
                {pathname == "/" && (
                  <div className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 opacity-50">
                    <img
                      src="/logo.png"
                      alt="Pixel Nova"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-blue-500">
                      Pixel Nova
                    </span>
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-orange-800">
                      beta
                    </span>
                  </div>
                )}
              </ErrorBoundary>
            </WasmProvider>
          </div>
        </UserProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
