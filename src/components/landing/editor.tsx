import Image from "next/image";

import { FrameCaption, NovaCta } from "./nova";

const editorFeatures = [
  {
    title: "Layer system",
    body: "Unlimited layers for complex sprites, character customization, and animation.",
  },
  {
    title: "Precision tools",
    body: "Brushes and tools built specifically for pixel-level work.",
  },
  {
    title: "Color management",
    body: "Intelligent palettes with real-time color harmonization.",
  },
];

export default function EditorLandingSection() {
  return (
    <section
      id="editor"
      className="relative z-[1] border-b border-nova-fg/[0.08] bg-white/[0.022] px-5 py-20 md:px-10 md:py-[104px]"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-14">
        <div className="flex flex-col items-center gap-[22px] text-center">
          <h2 className="m-0 max-w-[18ch] text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-none tracking-[-0.035em]">
            The new pixel art editor
          </h2>
          <p className="m-0 max-w-[48ch] text-lg leading-[1.6] text-nova-fg/[0.62]">
            Create, customize, and perfect your pixel art in a simple editor —
            designed for newcomers.
          </p>
          <NovaCta href="/editor">Open editor</NovaCta>
        </div>

        <div className="flex flex-col">
          {/* Preview sits flush on the feature grid: no bottom border. */}
          <div className="nova-frame-grid aspect-[16/9] !border-b-0">
            <Image
              src="/images/landing/editor.png"
              alt="The Pixel Nova editor showing the canvas, layer stack, and palette"
              fill
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-contain"
            />
            <FrameCaption>
              editor_interface.png — canvas, layers, palette
            </FrameCaption>
          </div>

          <div className="nova-cellgrid md:grid-cols-3">
            {editorFeatures.map((feature) => (
              <div key={feature.title} className="nova-cell !gap-3">
                <h3 className="m-0 text-lg font-medium">{feature.title}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-nova-fg/55">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
