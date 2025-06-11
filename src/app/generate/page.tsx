"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Download, ChevronDown, Package, Grid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<
    Array<{ id: string; image: string; name: string }>
  >([]);

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Input Section */}
          <div className="w-full overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 lg:h-[90vh] lg:max-w-xl">
            {/* Header */}
            <div className="border-b border-slate-700/50">
              <div className="mx-auto pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-blue-400" />
                    <div className="">
                      <h1 className="text-3xl font-bold text-white">
                        AI Pixel Art Generator
                      </h1>
                      <p className="text-slate-400">
                        WIP - NOT READY FOR USE. Transform your ideas into pixel
                        art using AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Enter Your Prompt
              </h2>
              <Textarea
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                placeholder="Describe the pixel art you want to generate..."
                className="h-32 resize-none bg-slate-800/30 text-white placeholder:text-slate-400"
              />
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setIsGenerating(true);
                    // TODO: Implement generation logic
                  }}
                  disabled={!prompt.trim() || isGenerating}
                  size="lg"
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-orange-600 px-12 py-4 text-lg font-semibold"
                >
                  {isGenerating ? "Generating..." : "Generate Pixel Art"}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full flex-1 overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 lg:h-[90vh]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Generated Results
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={variants.length === 0}
                    className="bg-gradient-to-r from-purple-400 to-pink-400"
                    size="sm"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download ({variants.length})
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" />
                    Download as ZIP
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Grid className="mr-2 h-4 w-4" />
                    Download as Spritesheet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex flex-col items-center rounded-xl border border-slate-600 bg-slate-700/20 p-4"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[url(/transparent-bg.png)] bg-contain">
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="h-full w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="mt-2 text-sm font-medium text-white">
                    {variant.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
