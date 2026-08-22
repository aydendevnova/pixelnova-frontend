import Image from "next/image";

import { FrameCaption, NovaCta, NovaSection, SpecRow } from "./nova";

export default function SkinToneLandingSection() {
  return (
    <NovaSection id="skintone">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div className="flex flex-col gap-6">
          <h2 className="m-0 text-[clamp(2.25rem,4.6vw,3.375rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Skin Tone Generator
          </h2>
          <p className="m-0 max-w-[56ch] text-pretty text-lg leading-[1.65] text-nova-fg/[0.66]">
            Create pixel art characters with authentic, diverse skin tones.
            Generate harmonious palettes that represent people of all
            backgrounds — in one click.
          </p>
          <div className="flex flex-col border-t border-nova-fg/[0.12]">
            <SpecRow
              term="Smart generation"
              detail="Balanced skin tone palettes, generated automatically"
            />
            <SpecRow
              term="Custom adjustments"
              detail="Fine-tune every ramp to match your artistic vision"
            />
          </div>
          <NovaCta
            href="/skin-tone-generator"
            variant="outline"
            className="self-start"
          >
            Try skin tone generator
          </NovaCta>
        </div>

        <div className="nova-frame aspect-[4/5]">
          <Image
            src="/images/landing/skin_tone_spritesheet.png"
            alt="A character sprite rendered across a range of skin tone ramps"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-contain p-8"
            style={{ imageRendering: "pixelated" }}
          />
          <FrameCaption>skin_tone_ramps.png</FrameCaption>
        </div>
      </div>
    </NovaSection>
  );
}
