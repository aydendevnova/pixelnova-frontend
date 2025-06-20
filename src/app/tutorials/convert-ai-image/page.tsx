import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Sparkle } from "lucide-react";

export default function ConvertAiImageTutorial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 pt-24">
      <div className="mx-auto max-w-6xl space-y-12 duration-500 animate-in fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Converting AI Images to Real Pixel Art
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Learn how to transform AI-generated "pixel art style" images into
            real, usable pixel art
          </p>
        </div>

        {/* Introduction */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Understanding the Difference
            </h2>
            <p className="mb-6 text-slate-300">
              When AI tools generate "pixel art style" images, they create
              artwork that looks pixelated but lacks the technical precision of
              true pixel art. Understanding these differences is crucial for
              creating authentic pixel art from AI-generated images.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">
                  AI "Pixel Art Style"
                </h3>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-red-500/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <Image
                      src="/images/tutorials/sample_ai.png"
                      alt="AI Pixel Art Style"
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Inconsistent pixel sizes</li>
                  <li>• Blurred edges</li>
                  <li>• Anti-aliasing artifacts</li>
                  <li>• Not true pixel-perfect art</li>
                  <li>• Thousands of colors</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">
                  Real Pixel Art
                </h3>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-emerald-500/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <Image
                      src="/images/tutorials/sample_pixel.png"
                      alt="AI Pixel Art Style"
                      width={500}
                      height={500}
                      className="object-cover"
                      style={{
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Consistent pixel grid</li>
                  <li>• Sharp, clean edges</li>
                  <li>• No anti-aliasing</li>
                  <li>• True pixel-perfect art</li>
                  <li>• Limited color pallete</li>
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
                  Generate an Image with AI
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Use AI tools like ChatGPT, Midjourney, or DALL-E to generate
                    an image in a pixel art style.
                  </p>
                  <div className="rounded-lg bg-slate-900/50 p-4">
                    <h4 className="mb-2 font-medium text-slate-200">
                      Example Prompt:
                    </h4>
                    <p className="text-sm text-slate-400">
                      "Generate a pixel art white arctic fox character."
                    </p>
                  </div>
                </div>
                <div className="relative aspect-[1.2] overflow-hidden rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <Image
                      src="/images/tutorials/sample_gpt.png"
                      alt="AI Pixel Art Style"
                      width={500}
                      height={900}
                      className="object-cover"
                    />
                  </div>
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
                  Convert to True Pixel Art
                </h2>
              </div>
              <div className="grid gap-8">
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Use our{" "}
                    <Link
                      href="/convert"
                      className="text-purple-400 hover:underline"
                    >
                      conversion tool
                    </Link>{" "}
                    to transform your AI-generated image into authentic pixel
                    art with a consistent grid.
                  </p>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li>
                      1. Upload your AI-generated image or import with link
                    </li>
                    <li>
                      2. Adjust the grid size to match the intended pixel scale
                    </li>
                    <li>3. Use the zoom tool to verify pixel alignment</li>
                    <li>4. Process the image to create true pixel art</li>
                  </ol>
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src="/images/tutorials/sample_conversion.png"
                    alt="AI Pixel Art Style"
                    width={500}
                    height={500}
                    className="w-full object-cover"
                  />
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
                  Compare the Results
                </h2>
              </div>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                        <Image
                          src="/images/tutorials/sample_ai_2.png"
                          alt="AI Pixel Art Style"
                          width={500}
                          height={500}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-slate-300">
                      Original AI Output
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                        <Image
                          src="/images/tutorials/sample_ai_zoomed.png"
                          alt="AI Pixel Art Style"
                          width={500}
                          height={500}
                          className="object-cover"
                          style={{
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-slate-300">
                      Zoomed in AI Image
                    </p>
                    <p className="text-center text-sm text-slate-400">
                      Pixels are grainy and blurred
                    </p>
                    <p className="text-center text-sm text-slate-400">
                      There are hundreds of colors
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                        <Image
                          src="/images/tutorials/sample_pixel_2.png"
                          alt="AI Pixel Art Style"
                          width={500}
                          height={500}
                          className="object-cover"
                          style={{
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-slate-300">
                      True Pixel Art
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                        <Image
                          src="/images/tutorials/sample_pixel_2_zoomed.png"
                          alt="AI Pixel Art Style"
                          width={500}
                          height={500}
                          className="object-cover"
                          style={{
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-slate-300">
                      Zoomed Pixel Art
                    </p>
                    <p className="text-center text-sm text-slate-400">
                      There are perfect pixels and few colors
                    </p>
                  </div>
                </div>
                <p className="text-center text-slate-300">
                  Notice how the converted image has consistent pixel sizes and
                  clean edges. The image can now easily be modified and used as
                  assets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex justify-center py-24">
          <Link href="/convert">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-lg text-white hover:from-purple-700 hover:to-pink-700">
              Try Converting Your Image
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
