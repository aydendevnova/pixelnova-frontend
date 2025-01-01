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

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <UserProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <Header />
            <WasmProvider>
              <ErrorBoundary
                fallback={({ error, reset }) => (
                  <ErrorView error={error} reset={reset} />
                )}
              >
                {children}
              </ErrorBoundary>
            </WasmProvider>
          </div>
        </UserProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
