import Image from "next/image";

import { FrameCaption, NovaCta, NovaSection, SpecRow } from "./nova";

/** Palette bar under the preview: accent, warm, then three neutral steps. */
const swatches = [
  "bg-nova-accent",
  "bg-nova-warm",
  "bg-nova-fg/[0.85]",
  "bg-nova-fg/25",
  "bg-nova-fg/10",
];

export default function ColorizerLandingSection() {
  return (
    <NovaSection id="colorizer" tinted>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="flex flex-col gap-3">
          <div
            className="nova-frame aspect-[5/4]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(240,180,106,0.07) 0 10px, transparent 10px 20px)",
            }}
          >
            <Image
              src="/images/landing/fox.png"
              alt="A fox sprite recolored by the colorizer"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain p-10"
              style={{ imageRendering: "pixelated" }}
            />
            <FrameCaption>colorizer_preview.png</FrameCaption>
          </div>
          <div className="flex gap-1.5">
            {swatches.map((swatch) => (
              <div key={swatch} className={`h-[26px] flex-1 ${swatch}`} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="m-0 text-[clamp(2.25rem,4.6vw,3.375rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Smart Colorizer
          </h2>
          <p className="m-0 max-w-[56ch] text-pretty text-lg leading-[1.65] text-nova-fg/[0.66]">
            Our algorithms understand pixel art aesthetics and suggest
            harmonious palettes that bring artwork to life. Turn simple sketches
            into vibrant pieces with one click — excellent for prototyping and
            games.
          </p>
          <div className="flex flex-col border-t border-nova-fg/[0.12]">
            <SpecRow
              term="Intelligent palettes"
              detail="Curated color combinations matched to your art style"
            />
            <SpecRow
              term="One-click magic"
              detail="Instantly transform grayscale art into vibrant work"
            />
          </div>
          <NovaCta href="/colorizer" className="self-start">
            Try colorizer
          </NovaCta>
        </div>
      </div>
    </NovaSection>
  );
}
