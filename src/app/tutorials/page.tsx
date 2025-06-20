"use client";
import Link from "next/link";
import { Wand2, ImageDown, Clock, Calendar } from "lucide-react";
import Image from "next/image";

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="mx-auto max-w-7xl px-4 duration-500 animate-in fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Tutorials</h1>
          <p className="text-slate-400">
            Learn how to use Pixel Nova's features
          </p>
        </div>

        <div className="grid gap-8">
          {/* AI Pixel Art Generation Tutorial Card */}
          <Link href="/tutorials/ai-pixel-art" className="group">
            <article className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 transition-all hover:border-purple-500/50 hover:bg-slate-800/80">
              <div className="flex">
                <div className="relative h-48 w-48 flex-shrink-0">
                  <Image
                    src="/images/tutorials/blue_sword.png"
                    alt="AI Pixel Art Example"
                    fill
                    className="object-cover"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>June 20, 2025</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4" />
                    <span>2 min read</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <Wand2 className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-purple-400">
                        AI Pixel Art Generation
                      </h2>
                      <p className="leading-relaxed text-slate-400">
                        Learn how to use our AI-powered pixel art generator to
                        create unique pixel art from text prompts. Master the
                        art of crafting perfect prompts and understanding the
                        settings that lead to the best results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>

          {/* Convert/Fix AI Image Tutorial Card */}
          <Link href="/tutorials/convert-ai-image" className="group">
            <article className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 transition-all hover:border-blue-500/50 hover:bg-slate-800/80">
              <div className="flex">
                <div className="relative h-48 w-48 flex-shrink-0">
                  <Image
                    src="/images/tutorials/sample_ai_2.png"
                    alt="Image Conversion Example"
                    fill
                    className="object-cover"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>June 20, 2025</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4" />
                    <span>2 min read</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <ImageDown className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-blue-400">
                        Convert AI Images to Real Pixel Art
                      </h2>
                      <p className="leading-relaxed text-slate-400">
                        Discover how to convert and fix AI-generated images into
                        authentic pixel art using our specialized tools. Learn
                        best practices for achieving clean, crisp pixel art from
                        any AI-generated source image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </div>
  );
}
