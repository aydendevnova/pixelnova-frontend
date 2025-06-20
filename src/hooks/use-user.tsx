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

type UserContextType = {
  user: User | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  isLoading: boolean;
  isSignedIn: boolean;
  invalidateUser: () => Promise<void>;
  optimisticGenerations: number;
  incrementOptimisticGenerations: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isSignedIn: false,
  optimisticGenerations: 0,
  incrementOptimisticGenerations: () => {
    throw new Error(
      "Increment optimistic generations function not implemented",
    );
  },
  invalidateUser: async () => {
    throw new Error("Invalidate user function not implemented");
  },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const queryClient = useQueryClient();
  const [optimisticGenerations, setOptimisticGenerations] = useState(0);

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
  });

  useEffect(() => {
    if (profile?.generation_count) {
      setOptimisticGenerations(profile.generation_count);
    }
  }, [profile?.generation_count]);

  // Set up real-time subscription for profile changes
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabaseClient
      .channel("public:profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("Profile changed:", payload.new);
          // Update the profile data in the React Query cache
          queryClient.setQueryData(["profile", session.user.id], payload.new);
        },
      )
      .subscribe();

    return () => {
      void supabaseClient.removeChannel(channel);
    };
  }, [session?.user?.id, supabaseClient, queryClient]);

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["worker-user"] });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const incrementOptimisticGenerations = useCallback(() => {
    setOptimisticGenerations((prev) => prev + 1);
  }, []);

  const value = {
    user: session?.user ?? null,
    profile: profile ?? null,
    isLoading: !!session?.user && (profileLoading || workerLoading),
    isSignedIn: !!session?.user && !!workerUser,
    invalidateUser,
    optimisticGenerations,
    incrementOptimisticGenerations,
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
