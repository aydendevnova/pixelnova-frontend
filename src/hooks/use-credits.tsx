"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import useUser from "./use-user";

export const CREDITS_COST = {
  PROCESS_IMAGE: 5,
  GENERATE_IMAGE: 40,
};

interface CreditsContextType {
  credits: number;
  isLoading: boolean;
  updateCredits: (params: { amount: number }) => Promise<any>;
  optimisticDeductCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, profile, invalidateUser } = useUser();
  const [displayGenerations, setDisplayGenerations] = useState(
    profile?.generation_count ?? 0,
  );

  // Sync displayCredits with queryCredits when they change
  useEffect(() => {
    setDisplayGenerations(profile?.generation_count ?? 0);
  }, [profile?.generation_count]);

  const { mutateAsync: updateCredits } = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!session?.user?.id) throw new Error("No user found");

      const { data, error } = await supabase
        .from("credits")
        .upsert(
          {
            user_id: session.user.id,
            amount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      await invalidateUser();
    },
    onError: (error) => {
      toast({
        title: "Error updating credits",
        description: "Failed to update credits. Please try again.",
        variant: "destructive",
      });
    },
  });

  const optimisticDeductCredits = (amount: number) => {
    console.log("optimisticDeductCredits", amount);
    // Immediately update the display credits
    setDisplayGenerations((prev) => Math.max(0, prev - amount));

    // Still invalidate the query to get the real server state
    void queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const value = {
    credits: displayGenerations,
    isLoading: false,
    updateCredits,
    optimisticDeductCredits,
  };

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
