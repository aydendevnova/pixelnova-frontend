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
  CHECKOUT: "/api/checkout",
  GENERATE_PIXEL_ART: "/api/generate-pixel-art",
  CREATE_PORTAL_SESSION: "/api/create-portal-session",
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

export function useCheckout() {
  const session = useSession();
  return useMutation({
    mutationFn: async (priceId: string) => {
      if (!session) {
        throw new Error("No session found");
      }
      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.CHECKOUT}`,
        { priceId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return response.data;
    },
  });
}

export function useGeneratePixelArt() {
  const session = useSession();

  return useMutation({
    mutationFn: async ({
      prompt,
      useOpenAI,
    }: {
      prompt: string;
      useOpenAI: boolean;
    }) => {
      if (!session) {
        throw new Error("No session found");
      }

      try {
        const response = await axios.post(
          `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.GENERATE_PIXEL_ART}`,
          { prompt, useOpenAI },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            responseType: "arraybuffer",
          },
        );

        // Convert array buffer to base64 for successful response
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
        return `data:image/png;base64,${base64}`;
      } catch (error: any) {
        // For error responses, decode the ArrayBuffer to get the error message
        if (error.response?.data instanceof ArrayBuffer) {
          const decoder = new TextDecoder();
          const errorText = decoder.decode(error.response.data);
          const errorJson = JSON.parse(errorText);

          throw errorJson.error || "Failed to generate image";
        }
        throw "Failed to generate image";
      }
    },
  });
}

export function useBillingPortal() {
  const session = useSession();
  return useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("No session found");
      }
      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.CREATE_PORTAL_SESSION}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return response.data.url;
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
        maxConversions: number;
        currentCount: number;
      };
    },
  });
}
