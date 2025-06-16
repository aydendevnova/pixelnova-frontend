"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { env } from "@/env";
import { DownscaleResponse, UpdateAccountBody } from "@/shared-types";
import { useSession } from "@supabase/auth-helpers-react";
import { useCredits, CREDITS_COST } from "@/hooks/use-credits";

const API_ROUTES = {
  UPDATE_ACCOUNT: "/api/update-account",
  CHECK_USERNAME: "/api/check-username",
  ESTIMATE_GRID_SIZE: "/api/estimate-grid-size",
  DOWNSCALE_IMAGE: "/api/downscale-image",
  GENERATE_IMAGE: "/api/generate-image",
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

export function useEstimateGridSize() {
  const session = useSession();

  return useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("No session found");
      }

      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.ESTIMATE_GRID_SIZE}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return {
        a: response.data.a,
        b: response.data.b,
        c: response.data.c,
      };
    },
  });
}

export function useDownscaleImage({
  onSuccess,
}: {
  onSuccess?: (data: DownscaleResponse) => void;
}) {
  const session = useSession();
  const { credits } = useCredits();

  return useMutation({
    mutationFn: async (imageFile: File) => {
      if (!session) {
        throw new Error("No session found");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.DOWNSCALE_IMAGE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      return {
        a: response.data.a,
        b: response.data.b,
        c: response.data.c,
        image: response.data.image,
      };
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
}

export function useGenerateImage() {
  const session = useSession();
  const { credits } = useCredits();

  return useMutation({
    mutationFn: async (prompt: string) => {
      if (!session) {
        throw new Error("No session found");
      }

      const response = await axios.post(
        `${env.NEXT_PUBLIC_EXPRESS_URL}${API_ROUTES.GENERATE_IMAGE}`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          responseType: "arraybuffer",
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

      // Convert array buffer to base64
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      return `data:image/png;base64,${base64}`;
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
