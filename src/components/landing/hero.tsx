import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_400px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="max-w-xl space-y-2">
              <Badge className="w-fit border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Now Live
              </Badge>
              <h1 className="max-w-xl text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                From Ideation to Pixel Art in Seconds
              </h1>
              <p className="max-w-[600px] text-slate-300 md:text-xl">
                Pixel Nova combines an intuitive pixel art editor with powerful
                AI generation. Create, transform, and perfect your pixel art
                with professional tools designed for both beginners and experts.
              </p>
              <div className="flex flex-col gap-2 pt-6 min-[400px]:flex-row">
                <Link href="/ai-pixel-art">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 text-lg font-semibold text-white hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                  >
                    Generate Pixel Art
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden rounded-xl">
            <Image
              src="/images/tutorials/blue_sword.png"
              alt="Pixel Art Example"
              width={600}
              height={600}
              className="h-full w-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
