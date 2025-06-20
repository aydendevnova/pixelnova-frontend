"use client";

import { CreditsDisplay } from "@/components/credits-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Star, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-black">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="relative">
          <img
            src="/logo-og.png"
            alt="Pixel Nova"
            className="h-44 w-44"
            style={{ imageRendering: "pixelated" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4"
          >
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Thank you for your purchase! Your account status is now{" "}
          <Badge className=" bg-purple-600 text-white">PRO</Badge>.
        </p>
        <div className="mx-auto my-2 w-fit">
          <CreditsDisplay />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <Button
          asChild
          size="lg"
          className="bg-purple-800 text-white hover:bg-purple-900 hover:text-white"
        >
          <Link href="/">Start Creating</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>
          Having issues? Contact{" "}
          <a href="mailto:support@pixelnova.app">support@pixelnova.app</a>
        </p>
      </motion.div>
    </div>
  );
}
