"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

export default function SignOutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
    setLoading(false);
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="default"
      className={className}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
