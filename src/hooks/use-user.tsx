"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  useSupabaseClient,
  useSession,
  User,
} from "@supabase/auth-helpers-react";
import { type Database } from "@/lib/types_db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { env } from "@/env";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isSignedIn: boolean;
  invalidateUser: () => Promise<void>;
  setPostSignInRedirect: (url: string) => void;
  clearPostSignInRedirect: () => void;
};

// Utility functions for managing redirect URLs
const REDIRECT_KEY = "post-signin-redirect";

export const setPostSignInRedirectUrl = (url: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REDIRECT_KEY, url);
  }
};

export const getPostSignInRedirectUrl = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REDIRECT_KEY);
  }
  return null;
};

export const clearPostSignInRedirectUrl = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REDIRECT_KEY);
  }
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isSignedIn: false,
  invalidateUser: async () => {
    throw new Error("Invalidate user function not implemented");
  },
  setPostSignInRedirect: () => {
    throw new Error("setPostSignInRedirect function not implemented");
  },
  clearPostSignInRedirect: () => {
    throw new Error("clearPostSignInRedirect function not implemented");
  },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Query for worker-verified user data
  const { data: workerUser, isLoading: workerLoading } = useQuery({
    queryKey: ["worker-user", session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) return null;

      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_EXPRESS_URL}/api/protected`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to verify user with worker");
        }

        return response.json();
      } catch (e) {
        console.error("Worker verification error:", e);
        return null;
      }
    },
    enabled: !!session?.access_token,
    initialData: null,
  });

  // Query for Supabase profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      try {
        if (!session?.user?.id) {
          console.log("No user session for profile fetch");
          return null;
        }

        console.log("Fetching profile for user:", session.user.id);
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          throw error;
        }

        console.log("Profile fetch successful:", data);
        return data;
      } catch (e) {
        console.error("Profile fetch error:", e);
        return null;
      }
    },
    enabled: !!session?.user?.id,
    initialData: null,
    // Add these configurations to ensure proper cache behavior
    staleTime: 0, // Consider all data stale immediately
    cacheTime: Infinity, // Keep the data in cache until explicitly removed
  });

  // Set up real-time subscription for profile changes
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabaseClient
      .channel(`public:profiles:${session.user.id}`)
      .on<{
        new: Profile;
        old: Profile;
        eventType: "INSERT" | "UPDATE" | "DELETE";
      }>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("Profile changed:", payload.new);
          // Update the profile data in the React Query cache and force a refetch
          queryClient.setQueryData<Profile | null>(
            ["profile", session.user.id],
            payload.new as Profile,
          );
          // Force a refetch to ensure all components are updated
          void queryClient.invalidateQueries({
            queryKey: ["profile", session.user.id],
          });
        },
      )
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.log("Successfully subscribed to profile changes");
        } else {
          console.error("Failed to subscribe to profile changes:", status);
        }
      });

    return () => {
      console.log("Cleaning up profile subscription");
      supabaseClient.removeChannel(channel).then(
        () => console.log("Channel removed successfully"),
        (error) => console.error("Error removing channel:", error),
      );
    };
  }, [session?.user?.id, supabaseClient, queryClient]);

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["worker-user"] });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  // Handle post-signin redirect
  useEffect(() => {
    const isSignedIn = !!session?.user && !!workerUser;

    if (isSignedIn && !hasRedirected) {
      const redirectUrl = getPostSignInRedirectUrl();

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        clearPostSignInRedirectUrl();
        setHasRedirected(true);

        // Use a timeout to ensure the component has fully rendered
        setTimeout(() => {
          router.push(redirectUrl);
        }, 100);
      }
    }

    // Reset hasRedirected when user signs out
    if (!session?.user) {
      setHasRedirected(false);
    }
  }, [session?.user, workerUser, router, hasRedirected]);

  const value = {
    user: session?.user ?? null,
    profile: profile ?? null,
    isLoading: !!session?.user && (profileLoading || workerLoading),
    isSignedIn: !!session?.user && !!workerUser,
    invalidateUser,
    setPostSignInRedirect: (url: string) => {
      setPostSignInRedirectUrl(url);
    },
    clearPostSignInRedirect: () => {
      clearPostSignInRedirectUrl();
    },
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
