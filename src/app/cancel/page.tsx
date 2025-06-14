"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-black">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="relative">
          <AlertCircle className="h-24 w-24 text-red-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Your payment was cancelled. No charges were made to your account.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <Button asChild size="lg" variant="outline">
          <Link href="/pricing">Try Again</Link>
        </Button>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/">Return Home</Link>
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
          <a href="mailto:ayden@pixelnova.app">ayden@pixelnova.app</a>
        </p>
      </motion.div>
    </div>
  );
}
