import Image from "next/image";

import { FrameCaption, NovaCta, NovaSection } from "./nova";

const steps = [
  {
    n: "01",
    title: "Upload",
    body: "Start with any image — photos, artwork, or AI-generated content.",
  },
  {
    n: "02",
    title: "Customize",
    body: "Adjust resolution, color palettes, and pixelation until the pixel count is right.",
  },
  {
    n: "03",
    title: "Export",
    body: "Download your pixel art in multiple formats.",
  },
];

export default function PixelPerfectLandingSection() {
  return (
    <NovaSection id="convert">
      <div className="flex flex-col gap-16 md:gap-[72px]">
        <div className="grid gap-12 md:grid-cols-2 md:gap-[72px]">
          <div className="flex flex-col gap-[18px]">
            <h2 className="m-0 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
              AI &ldquo;pixel art&rdquo; from other tools isn&rsquo;t pixel art
            </h2>
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-nova-fg/[0.62]">
              AI tools like ChatGPT, Midjourney, and DALL&middot;E create
              pixel-art-<em>style</em> images that fall apart when you zoom in.
              Ours is a true pixel art generator — and it converts anything
              those tools make into the real thing.
            </p>
          </div>
          <div className="flex flex-col gap-[18px] md:border-l md:border-nova-fg/10 md:pl-10">
            <h2 className="m-0 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
              Every single pixel, placed on purpose
            </h2>
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-nova-fg/[0.62]">
              Crisp, clean output with that authentic retro-game look — sharp at
              1× and at 1600×.
            </p>
          </div>
        </div>

        {/* Before → after */}
        <div className="grid items-center gap-9 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex flex-col gap-3.5">
            <div className="nova-frame aspect-[4/3]">
              <Image
                src="/images/tutorials/sample_ai.png"
                alt="AI-generated image that turns blurry when zoomed in"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain p-6 blur-[1.5px]"
              />
              <FrameCaption>ai_generated.png</FrameCaption>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base">AI generated</span>
              <span className="font-mono text-xs text-nova-fg/40">
                blurry when zoomed
              </span>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="rotate-90 justify-self-center font-mono text-[22px] text-nova-accent md:rotate-0"
          >
            →
          </span>

          <div className="flex flex-col gap-3.5">
            <div className="nova-frame-grid aspect-[4/3] !border-nova-accent bg-nova-accent/[0.07]">
              <Image
                src="/images/tutorials/sample_pixel.png"
                alt="The same subject rebuilt as true pixel art"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain p-6"
                style={{ imageRendering: "pixelated" }}
              />
              <FrameCaption bright>pixel_perfect.png</FrameCaption>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base">Pixel perfect</span>
              <span className="font-mono text-xs text-nova-warm">
                sharp at any size
              </span>
            </div>
          </div>
        </div>

        <div className="nova-cellgrid md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="nova-cell">
              <span className="font-mono text-xs text-nova-accent">
                {step.n}
              </span>
              <h3 className="m-0 text-2xl font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.6] text-nova-fg/[0.58]">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <NovaCta href="/convert" variant="outline" className="self-start">
          Try converting now
        </NovaCta>
      </div>
    </NovaSection>
  );
}
