import Image from "next/image";
import { LucidePaintRoller, LucideSettings2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SkinToneLandingSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900"></div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-white">
            👥 Inclusive Design
          </Badge>
          <h2 className="mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Skin Tone Generator
          </h2>
          <p className="max-w-[900px] text-xl leading-relaxed text-slate-300">
            Create pixel art characters with authentic and diverse skin tones
          </p>
          <div className="pt-8">
            <Link href="/skin-tone-generator">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                Try Now
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Diverse Representation
              </h3>
              <p className="text-slate-300">
                Our AI-powered skin tone generator helps you create inclusive
                pixel art characters that represent people of all backgrounds.
                Generate harmonious skin tone palettes with just one click.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
                <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
                  <LucidePaintRoller className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">
                  Smart Palette Generation
                </h4>
                <p className="text-slate-400">
                  Generate balanced skin tone palettes automatically
                </p>
              </div>
              <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/50">
                <div className="mb-4 inline-block rounded-full bg-purple-500/20 p-3">
                  <LucideSettings2 className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">
                  Custom Adjustments
                </h4>
                <p className="text-slate-400">
                  Fine-tune colors to match your artistic vision
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur">
            <Image
              alt="Skin tone generator preview"
              className="object-contain"
              height={800}
              width={1000}
              src={"/images/landing/skin_tone_spritesheet.png"}
              priority
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-16 flex justify-center">
        <Link href="/skin-tone-generator">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Try Skin Tone Generator
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
