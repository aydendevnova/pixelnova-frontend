"use client";
import { createContext, useContext } from "react";
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
  credits: number | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isSignedIn: false,
  credits: null,
  invalidateUser: async () => {
    throw new Error("Invalidate user function not implemented");
  },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const queryClient = useQueryClient();

  console.log("session", session);

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
        if (!session?.user?.id || !workerUser) {
          return null;
        }

        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*, credits")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          throw error;
        }

        return data;
      } catch (e) {
        console.error("Profile fetch error:", e);
        return null;
      }
    },
    enabled: !!session?.user?.id && !!workerUser,
    initialData: null,
  });

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["worker-user"] });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const value = {
    user: session?.user ?? null,
    profile: profile ?? null,
    isLoading: !!session?.user && (workerLoading || profileLoading),
    isSignedIn: !!session?.user && !!workerUser,
    credits: profile?.credits ?? null,
    invalidateUser,
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
