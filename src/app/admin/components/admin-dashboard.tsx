"use client";

import { useState, useEffect } from "react";
import { type Database } from "@/lib/types_db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { env } from "@/env";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type Log = Database["public"]["Tables"]["logs"]["Row"];

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type SortConfig = {
  field: string;
  order: "asc" | "desc";
};

export default function AdminDashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 1,
  });
  const [userProfiles, setUserProfiles] = useState<Record<string, Profile>>({});
  const [selectedUserProfile, setSelectedUserProfile] =
    useState<Profile | null>(null);
  const [searchParams, setSearchParams] = useState({
    userId: "",
    level: null as string | null,
  });
  const [sort, setSort] = useState<SortConfig>({
    field: "created_at",
    order: "desc",
  });
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<{
    data: any;
    logId: number | null;
  }>({
    data: null,
    logId: null,
  });

  const { toast } = useToast();
  const supabase = useSupabaseClient<Database>();

  const fetchLogs = async (
    page = 1,
    searchOverride?: { userId?: string; level?: string | null },
  ) => {
    try {
      setIsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No session found");
      }

      // Use override values if provided, otherwise use state values
      const currentSearchParams = searchOverride ?? searchParams;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sort.field,
        sortOrder: sort.order,
        ...(currentSearchParams.userId && {
          userId: currentSearchParams.userId,
        }),
        ...(currentSearchParams.level &&
          currentSearchParams.level !== "all" && {
            level: currentSearchParams.level,
          }),
      });

      const response = await fetch(
        `${env.NEXT_PUBLIC_EXPRESS_URL}/api/admin/logs?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
      setUserProfiles(data.userProfiles);
      if (data.selectedUserProfile) {
        setSelectedUserProfile(data.selectedUserProfile);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    void fetchLogs(1); // Reset to first page when searching
  };

  const handleSearchUser = (userId: string) => {
    // Pass the new userId directly to fetchLogs instead of waiting for state update
    void fetchLogs(1, { ...searchParams, userId });
    // Update the state after initiating the fetch
    setSearchParams((prev) => ({ ...prev, userId }));
  };

  useEffect(() => {
    void fetchLogs();
  }, [sort]); // Only re-fetch when sorting changes

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  const handleUserClick = (userId: string) => {
    const profile = userProfiles[userId];
    if (profile) {
      setSelectedUserProfile(profile);
      setShowUserDialog(true);
    }
  };

  const handleViewMetadata = (metadata: string, logId: number) => {
    try {
      const parsedMetadata = metadata ? JSON.parse(metadata) : null;
      setSelectedMetadata({ data: parsedMetadata, logId });
    } catch (e) {
      // If not JSON, show as plain text
      setSelectedMetadata({ data: metadata, logId });
    }
  };

  return (
    <div className="min-h-screen space-y-8 overflow-y-auto bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-12 pt-24">
      <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="userId"
                className="text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <Input
                id="userId"
                placeholder="Filter by User ID"
                value={searchParams.userId}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    userId: e.target.value,
                  }))
                }
                className="w-64"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Pass current input value directly
                    void fetchLogs(1, {
                      ...searchParams,
                      userId: (e.target as HTMLInputElement).value,
                    });
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Log Level
              </label>
              <Select
                value={searchParams.level ?? undefined}
                onValueChange={(value) => {
                  // Pass new level value directly
                  void fetchLogs(1, { ...searchParams, level: value });
                  // Update state after initiating fetch
                  setSearchParams((prev) => ({ ...prev, level: value }));
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">System Logs</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={isLoading || pagination.page <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={
                    isLoading || pagination.page >= pagination.totalPages
                  }
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
                <Button
                  onClick={() => fetchLogs(pagination.page)}
                  disabled={isLoading}
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    Created At{" "}
                    {sort.field === "created_at" &&
                      (sort.order === "desc" ? "↓" : "↑")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("level")}
                  >
                    Level{" "}
                    {sort.field === "level" &&
                      (sort.order === "desc" ? "↓" : "↑")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    Type{" "}
                    {sort.field === "type" &&
                      (sort.order === "desc" ? "↓" : "↑")}
                  </TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${
                          log.level === "error"
                            ? "bg-red-100 text-black"
                            : log.level === "warn"
                              ? "bg-yellow-100 text-black"
                              : "bg-blue-100 text-black"
                        }`}
                      >
                        {log.level}
                      </span>
                    </TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {log.message}
                    </TableCell>
                    <TableCell>
                      {!!log.user_id && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleUserClick(log.user_id!)}
                          >
                            {userProfiles[log.user_id]?.username ?? "Unknown"}
                          </Button>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{log.user_id}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSearchUser(log.user_id!)}
                              className="h-6 px-2 py-0"
                            >
                              Search
                            </Button>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm">
                          {log.metadata ?? "No metadata"}
                        </div>
                        {!!log.metadata && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewMetadata(log.metadata!, log.id)
                            }
                            className="h-6 shrink-0 px-2 py-0"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUserProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Username</div>
                <div>{selectedUserProfile.username}</div>
                {!!selectedUserProfile?.avatar_url && (
                  <>
                    <p className="font-semibold">Avatar</p>
                    <Image
                      src={selectedUserProfile.avatar_url}
                      alt="Avatar"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </>
                )}
                <div className="font-semibold">Email</div>
                <div>{selectedUserProfile.email}</div>
                <div className="font-semibold">Full Name</div>
                <div>{selectedUserProfile.full_name}</div>
                <div className="font-semibold">Tier</div>
                <div>{selectedUserProfile.tier}</div>
                <div className="font-semibold">Generation Count</div>
                <div>{selectedUserProfile.generation_count}</div>
                <div className="font-semibold">Conversion Count</div>
                <div>{selectedUserProfile.conversion_count}</div>
                <div className="font-semibold">Lifetime Generations</div>
                <div>{selectedUserProfile.generation_count_lifetime}</div>
                <div className="font-semibold">Lifetime Conversions</div>
                <div>{selectedUserProfile.conversion_count_lifetime}</div>
                <div className="font-semibold">Created At</div>
                <div className="font-semibold">Last Updated</div>
                <div>
                  {selectedUserProfile.updated_at
                    ? new Date(selectedUserProfile.updated_at).toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedMetadata.logId}
        onOpenChange={() => setSelectedMetadata({ data: null, logId: null })}
      >
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Log Metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {typeof selectedMetadata.data === "object" ? (
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-50">
                {JSON.stringify(selectedMetadata.data, null, 2)}
              </pre>
            ) : (
              <div className="whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-50">
                {selectedMetadata.data}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
