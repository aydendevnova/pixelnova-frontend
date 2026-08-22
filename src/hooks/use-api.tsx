"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { UpdateAccountBody } from "@/shared-types";
import { useSession } from "@supabase/auth-helpers-react";
const API_ROUTES = {
  UPDATE_ACCOUNT: "/api/update-account",
  CHECK_USERNAME: "/api/check-username",
  CONVERT_IMAGE: "/api/convert-image",
} as const;

export function useUpdateAccount() {
  const session = useSession();
  return useMutation({
    mutationFn: async (data: UpdateAccountBody) => {
      if (!session) {
        throw new Error("No session found");
      }
      const formData = new FormData();

      if (data.fullName) formData.append("fullName", data.fullName);
      if (data.username) formData.append("username", data.username);
      if (data.website) formData.append("website", data.website);
      if (data.image) formData.append("image", data.image);

      const response = await axios.patch(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.UPDATE_ACCOUNT}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return response.data;
    },
  });
}

export function useCheckUsername() {
  const session = useSession();
  return useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      if (!session) {
        throw new Error("No session found");
      }
      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.CHECK_USERNAME}`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return response.data;
    },
  });
}

export function useConvertImage() {
  const session = useSession();

  return useMutation({
    mutationFn: async ({
      imageFile,
      kColors = 16,
      targetSegments = 0,
    }: {
      imageFile: File;
      kColors?: number;
      targetSegments?: number;
    }) => {
      if (!session) {
        throw new Error("No session found");
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("kColors", kColors.toString());
      formData.append("targetSegments", targetSegments.toString());

      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.CONVERT_IMAGE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return response.data as {
        image: string;
        currentCount: number;
      };
    },
  });
}
