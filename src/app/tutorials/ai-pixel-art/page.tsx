import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Sparkle } from "lucide-react";

export default function GenerateWithAiTutorial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 pt-24">
      <div className="mx-auto max-w-6xl space-y-12 duration-500 animate-in fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Creating Authentic Pixel Art with AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Learn how to generate professional-quality pixel art using our
            specialized AI tool
          </p>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Why Our AI Generator is Different
            </h2>
            <p className="mb-6 text-slate-300">
              Unlike general AI art tools that try to mimic pixel art style, our
              generator is specifically designed to create authentic, game-ready
              pixel art. It understands pixel art principles and creates images
              with consistent pixel sizes, clean edges, and limited color
              palettes.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">
                  Standard AI Art Tools
                </h3>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-red-500/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <Image
                      src="/images/tutorials/sample_ai_apple.jpg"
                      alt="Standard AI Art"
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Tries to mimic pixel art style</li>
                  <li>• Inconsistent pixel sizes</li>
                  <li>• Requires manual conversion</li>
                  <li>• Not game-ready</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">
                  Our AI Pixel Art Generator
                </h3>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-emerald-500/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <Image
                      src="/images/tutorials/sample_ai_gen_apple.png"
                      alt="Our AI Pixel Art"
                      width={500}
                      height={500}
                      className="object-cover"
                      style={{
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Creates true pixel art directly</li>
                  <li>• Perfect pixel grid alignment</li>
                  <li>• Game-ready assets</li>
                  <li>• Pre-optimized color palettes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                  <span className="text-lg font-bold text-white">1</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Craft Your Prompt
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Write a detailed prompt that describes your desired pixel
                    art. Be specific about style, colors, and intended use.
                  </p>
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Example Prompts:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>
                        "game sprite of a cute blue slime monster jumping"
                      </li>
                      <li>
                        "pixel art icon of a magical staff with purple glow"
                      </li>
                      <li>"Top-down pixel art tileset of grass and flowers"</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Pro Tips:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>
                        • Mention the art style (cute, realistic, fantasy)
                      </li>
                      <li>• Include color preferences</li>
                      <li>• Describe the intended use (sprite, icon, tile)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src="/images/tutorials/blue_slime.png"
                      alt="Example Pixel Art"
                      width={500}
                      height={500}
                      className="object-cover"
                      style={{
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                  <p className="text-center text-sm text-slate-300">
                    Our AI understands pixel art terminology and creates
                    perfectly aligned pixels
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                  <span className="text-lg font-bold text-white">2</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Generate and Download
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-slate-300">
                  Once you're happy with your prompt, click generate and let our
                  AI create your pixel art. You can download your creations in
                  multiple formats:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Download Options:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Individual PNG files</li>
                      <li>• ZIP archive for multiple images</li>
                      <li>• Spritesheet format</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Features:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Perfect pixel alignment</li>
                      <li>• Optimized for games</li>
                      <li>• No post-processing needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                  <span className="text-lg font-bold text-white">3</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Access Your Gallery
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-slate-300">
                  All your generated pixel art is automatically saved to your
                  account. Visit your personal gallery to:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Gallery Features:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• View all your past generations</li>
                      <li>• Download previously created art</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Benefits:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Never lose your generations</li>
                      <li>• Track your creative history</li>
                      <li>• Build a personal asset library</li>
                      <li>• Access from anywhere</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Link href="/gallery">
                    <Button className="px-6 py-2 ">
                      Visit Your Gallery
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex justify-center py-24">
          <Link href="/ai-pixel-art">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-lg text-white hover:from-purple-700 hover:to-pink-700">
              Start Generating Pixel Art
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
