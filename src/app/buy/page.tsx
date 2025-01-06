"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCredits } from "@/hooks/use-credits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Star, Crown } from "lucide-react";
import { CreditsDisplay } from "@/components/credits-display";
import useUser from "@/hooks/use-user";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCheckout } from "@/hooks/use-api";

export default function BuyPage() {
  const { user, isLoading: isLoadingUser } = useUser();
  const router = useRouter();
  const checkout = useCheckout();

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
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Power Up Your Creativity
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform your ideas into pixel-perfect art with Pixel Nova Credits
          </p>
        </div>

        {/* One-time Purchases Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            One-time Purchases
          </h2>
          <div className="mx-auto grid w-fit gap-8 md:grid-cols-2">
            {/* Starter Pack */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <Card className="w-[300px] border-2 border-blue-500 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-white">
                <div className="absolute right-4 top-4">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Starter Pack</h3>
                <div className="mb-1 text-3xl font-bold">
                  <span className="line-through">$12.99</span>{" "}
                  <span className="text-blue-500">$9.99</span>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-blue-500">
                    One-time payment
                  </span>
                </div>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span>2000 Credits</span>
                  </div>

                  <ul className="list-inside list-disc">
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                      Perfect for getting started
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                      Up to 400 processing operations
                    </li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() =>
                    handleCheckout(env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER)
                  }
                  disabled={checkout.isLoading}
                >
                  {checkout.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Get Started
                </Button>
              </Card>
            </motion.div>

            {/* Pro Pack */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-gray-900">
                  BEST VALUE
                </span>
              </div>
              <Card className="w-[300px] border-2 border-purple-500 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-white">
                <div className="absolute right-4 top-4">
                  <Crown className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Pro Pack</h3>
                <div className="mb-1 text-3xl font-bold">
                  <span className="line-through">$24.99</span>{" "}
                  <span className="text-purple-500">$19.99</span>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-purple-500">
                    One-time payment
                  </span>
                </div>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>5000 Credits</span>
                  </div>

                  <ul className="list-inside list-disc">
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                      20% more value
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300">
                      Up to 1000 processing operations
                    </li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-purple-500 text-white hover:bg-purple-600"
                  onClick={() =>
                    handleCheckout(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO)
                  }
                  disabled={checkout.isLoading}
                >
                  {checkout.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Level Up Now
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <div className="mb-2 flex items-center justify-center gap-2">
            <CreditsDisplay />
          </div>
          <p className="text-sm">
            1 AI Generation = 40 Credits | 1 Processing Operation = 5 Credits
          </p>
        </div>
      </div>
    </div>
  );
}
