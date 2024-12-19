"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

export default function ApiTestDialog() {
  const [healthResult, setHealthResult] = useState<string>("");
  const [protectedResult, setProtectedResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testHealthEndpoint = async () => {
    try {
      setLoading(true);
      const healthResponse = await fetch("http://localhost:8787/api/health");
      const healthData = await healthResponse.json();
      setHealthResult(JSON.stringify(healthData, null, 2));
    } catch (error) {
      setHealthResult(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setProtectedResult("No access token found - please login first");
        return;
      }

      const protectedResponse = await fetch(
        "http://localhost:8787/api/protected",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const protectedData = await protectedResponse.json();
      setProtectedResult(JSON.stringify(protectedData, null, 2));
    } catch (error) {
      setProtectedResult(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Test API</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Endpoints Test</DialogTitle>
          <DialogDescription>
            Test the health and protected endpoints
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Health Endpoint</h3>
            <Button onClick={testHealthEndpoint} disabled={loading}>
              {loading ? "Testing..." : "Test Health"}
            </Button>
            {healthResult && (
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm text-slate-50">
                {healthResult}
              </pre>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Protected Endpoint</h3>
            <Button onClick={testProtectedEndpoint} disabled={loading}>
              {loading ? "Testing..." : "Test Protected"}
            </Button>
            {protectedResult && (
              <pre className="mt-2 h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm text-slate-50">
                {protectedResult}
              </pre>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
