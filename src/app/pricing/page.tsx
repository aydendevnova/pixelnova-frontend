"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Star, Crown, CheckCircle2 } from "lucide-react";
import { CreditsDisplay } from "@/components/credits-display";
import useUser from "@/hooks/use-user";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBillingPortal, useCheckout } from "@/hooks/use-api";
import Image from "next/image";
import { PLAN_LIMITS } from "@/lib/constants";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BuyPage() {
  const { user, profile, isLoading: isLoadingUser } = useUser();
  const router = useRouter();
  const checkout = useCheckout();

  const { mutate: openBillingPortal, isLoading: isLoadingBillingPortal } =
    useBillingPortal();

  // When you want to open the billing portal:
  const handleManageSubscription = () => {
    openBillingPortal(undefined, {
      onSuccess: (url) => {
        // Redirect to the Stripe billing portal
        window.location.href = url;
      },
      onError: (error) => {
        toast.error("Failed to open billing portal");
        console.error("Failed to open billing portal:", error);
      },
    });
  };

  async function handleCheckout(priceId: string) {
    if (!user) {
      toast.error("Please sign in to checkout");
      router.push("/signin");
      return;
    }

    const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      toast.error("Stripe not initialized");
      return;
    }

    try {
      const { id: sessionId } = await checkout.mutateAsync(priceId);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (e) {
      console.error(e);
      toast.error("Failed to initiate checkout");
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 px-4 py-12 pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
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
          <div className="mx-auto w-full max-w-sm">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="group relative">
                <div className="0 absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl transition duration-300"></div>
                <Card className="relative w-full border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur transition-all duration-300 ">
                  <div className="absolute right-4 top-4">
                    <Crown className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    Pixel Nova Pro
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">
                        $6.99
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Cancel anytime
                    </p>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/20 p-1">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300">
                        {PLAN_LIMITS["PRO"].MAX_GENERATIONS} AI Pixel Art
                        Generations per month
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/20 p-1">
                        <Zap className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300">
                        Unlimited AI Conversions
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/20 p-1">
                        <Star className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300">Priority Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/20 p-1">
                        <Crown className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300">
                        All Premium Features
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white shadow-lg transition-all duration-200 "
                    onClick={() =>
                      profile?.tier === "PRO"
                        ? handleManageSubscription()
                        : handleCheckout(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO)
                    }
                    disabled={
                      checkout.isLoading ||
                      isLoadingBillingPortal ||
                      profile?.pro_overriden
                    }
                  >
                    {checkout.isLoading || isLoadingBillingPortal ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {profile?.tier === "PRO"
                      ? "Manage Subscription"
                      : "Get Started Now"}
                  </Button>

                  <p className="mt-4 text-center text-sm text-slate-400">
                    See{" "}
                    <Link
                      href="/limits"
                      className="text-blue-400 hover:underline"
                    >
                      limits
                    </Link>{" "}
                    for more information.
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* What's Included - Right Side */}
          {/* <div className="absolute right-0 top-0 hidden w-64 lg:block">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur">
              <h3 className="mb-4 text-xl font-bold text-white">
                What's Included
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Easy AI Pixel Art Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Unlimited Pixel Art Conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Premium Support</span>
                </li>
              </ul>
            </div>
          </div> */}

          {/* What's Included - Mobile */}
          {/* <div className="mt-8 block lg:hidden">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur">
              <h3 className="mb-4 text-xl font-bold text-white">
                What's Included
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Easy AI Pixel Art Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Unlimited Pixel Art Conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  <span>Premium Support</span>
                </li>
              </ul>
            </div>
          </div> */}
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
