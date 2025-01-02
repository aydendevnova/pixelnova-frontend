"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import useUser from "./use-user";

export const CREDITS_COST = {
  PROCESS_IMAGE: 5,
  GENERATE_IMAGE: 100,
};

export function useCredits() {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { credits: queryCredits, invalidateUser } = useUser();
  const [displayCredits, setDisplayCredits] = useState(queryCredits ?? 0);

  // Sync displayCredits with queryCredits when they change
  useEffect(() => {
    setDisplayCredits(queryCredits ?? 0);
  }, [queryCredits]);

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
    // Immediately update the display credits
    setDisplayCredits((prev) => Math.max(0, prev - amount));

    // Still invalidate the query to get the real server state
    void queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    credits: displayCredits,
    isLoading: false,
    updateCredits,
    optimisticDeductCredits,
  };
}
