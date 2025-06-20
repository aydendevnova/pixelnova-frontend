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
import { Toaster as ToasterRadixUI } from "../ui/toaster";
import { Toaster as ToasterHotToast } from "react-hot-toast";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CreditsProvider } from "@/hooks/use-credits";
import Footer from "./footer";

// Create a Supabase client
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Create a persistent QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname == "/editor" && env.NEXT_PUBLIC_IS_DEVELOPMENT !== "true") {
      window.scrollTo(0, 0);
      document.body.classList.add("overflow-hidden");

      // Add beforeunload event listener
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        // This message might not be shown in some browsers, as they use their own default messages
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <CreditsProvider>
          <UserProvider>
            <div
              className={`relative flex min-h-screen flex-col ${
                pathname == "/editor" ? "overflow-hidden" : "dark"
              }`}
            >
              <Header />

              <ErrorBoundary
                fallback={({ error, reset }) => (
                  <ErrorView error={error} reset={reset} />
                )}
              >
                <ToasterRadixUI />
                <ToasterHotToast />

                {children}
                {pathname == "/editor" && (
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
                      public alpha
                    </span>
                  </div>
                )}
              </ErrorBoundary>
              <Footer />
            </div>
          </UserProvider>
        </CreditsProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
