import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PLAN_LIMITS } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LimitsPage() {
  return (
    <div className="mx-auto mt-20 max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Usage Limits</h1>

      <p className="mb-4 text-gray-700">
        As our new platform evolves, we anticipate expanding these limits and
        introducing flexible pay-as-you-go options to better accommodate the
        needs of our advanced users.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Free Tier Limits</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-medium">AI Image Generations</h3>
              <p className="text-gray-700">
                Free users must upgrade to a paid plan to access AI image
                generation tools. This includes all pixel art generations using
                our AI tools. Upgrade to Pro to unlock unlimited AI generations
                and get started creating amazing pixel art.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-medium">Image Conversions</h3>
              <p className="text-gray-700">
                Free users can perform up to{" "}
                <span className="font-semibold">10 image conversions</span> per
                month. This is the tool that allows you to convert regular
                images, ChatGPT or other pixel art style AI images to real pixel
                art.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Pro Tier Limits</h2>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-blue-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-medium">AI Image Generations</h3>
              <p className="text-gray-700">
                Pro users can generate up to{" "}
                <span className="font-semibold">
                  {PLAN_LIMITS["PRO"].MAX_GENERATIONS} AI images
                </span>{" "}
                per month. Soon we will be adding pay as you go, so you don't
                have to think about limits.
              </p>
              <Alert className="mt-6 border-2 border-slate-200 bg-slate-200/50 p-4 text-black">
                <AlertCircle className="h-4 w-4 text-black" color="black" />
                <AlertTitle className="font-normal">
                  What do I do if I run out?
                </AlertTitle>
                <AlertDescription className=" p-4 text-black">
                  If you use all your image generation credits for the month,
                  you can still use tools like ChatGPT that generate images that
                  look like pixel art. Since they lack true pixel-perfect
                  precision, use our{" "}
                  <Link
                    href="/convert"
                    className="text-blue-600 hover:underline"
                  >
                    image conversion tool
                  </Link>{" "}
                  to transform those images into real, pixel-perfect art usable
                  for game assets and professional pixel art projects.
                </AlertDescription>
              </Alert>
            </div>

            <div className="rounded-lg border-2 border-blue-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-lg font-medium">Image Conversions</h3>
              <p className="text-gray-700">
                Pro users enjoy{" "}
                <span className="font-semibold">
                  unlimited image conversions
                </span>
                . Convert as many images as you need without any monthly
                restrictions.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Need More?</h2>
          <p className="text-gray-700">
            If you need higher limits, please email{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>{" "}
            to discuss custom plans for your needs.
          </p>
        </section>

        <section className="mt-8 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-semibold">Upgrade to Pro</h2>
          <p className="mb-4 text-gray-700">
            Get access to higher limits and unlock the full potential of Pixel
            Nova.
          </p>
          <a
            href="/pricing"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            View Pricing
          </a>
        </section>
      </div>
    </div>
  );
}
