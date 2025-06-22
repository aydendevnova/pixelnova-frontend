import { ArrowRight, Upload, Palette, ImageOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// import Pixelator from "~/assets/landing/pixelator.png";
// import ColorOptimization from "~/assets/landing/color-optimization.jpeg";
import { Button } from "../ui/button";
export default function PixelPerfect() {
  const pixelationFeatures = [
    {
      icon: <Upload className="h-6 w-6 text-primary" />,
      title: "Upload",
      description:
        "Start with any image - photos, artwork, or AI-generated content",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h6v6h-6z"
          />
        </svg>
      ),
      title: "Customize",
      description: "Adjust grid size, color palettes, and pixelation settings",
    },
    {
      icon: <ArrowRight className="h-6 w-6 text-primary" />,
      title: "Export",
      description: "Download your pixel art in multiple formats",
    },
  ];

  const colorFeatures = [
    {
      icon: <Palette className="h-6 w-6 text-primary" />,
      title: "Smart Color Optimization",
      description:
        "Color palette optimization for beautiful pixel art aesthetics",
    },
    {
      icon: <ImageOff className="h-6 w-6 text-primary" />,
      title: "Classic Grayscale",
      description:
        "Transform your art into timeless grayscale with perfect contrast. Colorize it later to create variations.",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-muted/50 to-background py-12 md:py-24 lg:py-32">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              AI-Powered Pixel Art Creation
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Transform any image into stunning pixel art with our intelligent
              tools
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pixelationFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6"
            >
              <div className="rounded-full bg-primary/10 p-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-16 flex flex-col items-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-xl">
            {/* <Image
              alt="Pixel art transformation preview"
              className="object-cover"
              height={800}
              width={1000}
              src={Pixelator.src}
              priority
            /> */}
          </div>
        </div>

        <div className="mt-32 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Advanced Color Processing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Perfect your images with intelligent color optimization
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {colorFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6"
            >
              <div className="rounded-full bg-primary/10 p-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          {/* <Image
            alt="Color optimization preview"
            className="w-full rounded-xl object-cover"
            height={800}
            width={1000}
            src={ColorOptimization.src}
            priority
          /> */}
        </div>
        <div className="mx-auto mt-12 flex w-full justify-center">
          <Link href="/waitlist" className="mx-auto">
            <Button size="lg" className="w-full flex-1">
              Join Waitlist
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
