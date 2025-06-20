export type UserTier = "NONE" | "PRO";

export const PLAN_LIMITS = {
  NONE: {
    MAX_GENERATIONS: 4,
    MAX_CONVERSIONS: 10,
  },
  PRO: {
    MAX_GENERATIONS: 150,
    MAX_CONVERSIONS: Infinity, // Unlimited conversions for PRO
  },
} as const;

export function getMaxGenerations(tier: UserTier): number {
  return PLAN_LIMITS[tier].MAX_GENERATIONS;
}

export function getMaxConversions(tier: UserTier): number {
  return PLAN_LIMITS[tier].MAX_CONVERSIONS;
}

export const TIER_FEATURES = {
  NONE: {
    name: "Free",
    features: [
      "4 AI Image Generations",
      "10 Image Conversions",
      "Basic Support",
    ],
  },
  PRO: {
    name: "Pro",
    features: [
      "150 AI Image Generations per month",
      "Unlimited Image Conversions",
      "Priority Support",
      "Early Access to New Features",
    ],
  },
} as const;
