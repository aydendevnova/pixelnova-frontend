"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/use-user";
import AdminDashboard from "./components/admin-dashboard";

export default function AdminPage() {
  const { user, profile, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !profile?.is_admin)) {
      router.push("/");
    }
  }, [user, profile, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile?.is_admin) {
    return null;
  }

  return profile.is_admin ? <AdminDashboard /> : <div>Not authorized</div>;
}
