"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Star, Crown, Loader2 } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/constants";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import { toast } from "react-hot-toast";
import { useBillingPortal, useCheckout } from "@/hooks/use-api";
import useUser from "@/hooks/use-user";
import { SignInModal } from "@/components/modals/signin-modal";

export function PricingCard() {
  const { isSignedIn, profile } = useUser();
  const checkout = useCheckout();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const { mutate: openBillingPortal, isLoading: isLoadingBillingPortal } =
    useBillingPortal();

  const handleManageSubscription = () => {
    openBillingPortal(undefined, {
      onSuccess: (url) => {
        window.open(url);
      },
      onError: (error) => {
        toast.error("Failed to open billing portal");
        console.error("Failed to open billing portal:", error);
      },
    });
  };

  async function handleSubscribe() {
    if (!isSignedIn) {
      setIsSignInModalOpen(true);
      return;
    }

    const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      toast.error("Stripe not initialized");
      return;
    }

    try {
      const { id: sessionId } = await checkout.mutateAsync(
        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
      );
      await stripe?.redirectToCheckout({ sessionId });
    } catch (e) {
      console.error(e);
      toast.error("Failed to initiate checkout");
    }
  }

  const isLoading = checkout.isLoading || isLoadingBillingPortal;
  const isProUser = profile?.tier === "PRO";
  const isProOverriden = !!profile?.pro_overriden;

  return (
    <>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        featureName="Pro features"
      />
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
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-slate-400">/month</span>
                <span className="ml-2 text-sm text-slate-400 line-through">
                  $12.99
                </span>
              </div>
              <div className="mt-1">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
                  20% off - Limited Time
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Cancel anytime</p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/20 p-1">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-300">
                  {PLAN_LIMITS["PRO"].MAX_GENERATIONS} AI Pixel Art Generations
                  per month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/20 p-1">
                  <Zap className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-300">Unlimited AI Conversions</span>
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
                  Early Access to New Features
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 font-semibold text-white shadow-lg transition-all duration-200 "
              onClick={isProUser ? handleManageSubscription : handleSubscribe}
              disabled={isLoading || isProOverriden}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isProUser ? "Manage Subscription" : "Get Started Now"}
            </Button>

            <p className="mt-4 text-center text-sm text-slate-400">
              See{" "}
              <Link href="/limits" className="text-blue-400 hover:underline">
                limits
              </Link>{" "}
              for more information.
            </p>
          </Card>
        </div>
      </motion.div>
    </>
  );
}
