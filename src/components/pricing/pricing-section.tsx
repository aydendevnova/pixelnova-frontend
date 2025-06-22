"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PricingCard } from "@/components/pricing/pricing-card";
import useUser from "@/hooks/use-user";

export default function PricingSection({
  noShowBgAndLogo = false,
}: {
  noShowBgAndLogo?: boolean;
}) {
  const { profile, isLoading: isLoadingUser } = useUser();

  if (isLoadingUser) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 ${
          noShowBgAndLogo
            ? ""
            : "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
        }`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 py-12 pt-20 ${
        noShowBgAndLogo
          ? ""
          : "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          {!noShowBgAndLogo && (
            <h1 className="mb-4 flex items-center justify-center gap-4 text-2xl font-bold">
              <Image
                src="/logo-og.png"
                alt="Pixel Nova Logo"
                width={52}
                height={52}
                style={{
                  imageRendering: "pixelated",
                }}
              />

              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Pixel Nova
              </span>
            </h1>
          )}
          <h1
            className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text 
            text-4xl font-bold text-transparent"
          >
            One Plan. Unlimited Uses.
          </h1>
          <p className="text-lg text-slate-300">
            Get unlimited access to all Pixel Nova features and create stunning
            pixel art with AI.
          </p>
        </div>

        {profile?.pro_overriden && (
          <Alert className="mx-auto mb-8 max-w-2xl bg-green-900">
            <AlertTitle className="mb-2 text-xl font-semibold">
              Pro Access Granted by Developer
            </AlertTitle>
            <AlertDescription>
              You were granted free access to the pro plan without a
              subscription. You will not be able to buy the pro plan nor manage
              your subscription. Contact{" "}
              <a
                href="mailto:support@pixelnova.app"
                className="text-blue-400 hover:underline"
              >
                support@pixelnova.app
              </a>{" "}
              if you were billed.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="relative mx-auto max-w-4xl">
          {/* Pro Card - Center */}
          <div className="mx-auto w-full max-w-[25rem]">
            <PricingCard />
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <p className="text-sm text-slate-400">
              Having Issues? Contact{" "}
              <a
                href="mailto:support@pixelnova.app"
                className="text-blue-400 hover:underline"
              >
                support@pixelnova.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
