"use client";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import { FrameCaption, NovaCta } from "./nova";

const carouselImages = [
  { src: "/images/landing/purple_staff.png", alt: "Purple staff sprite" },
  { src: "/images/landing/wizard.png", alt: "Wizard sprite" },
  { src: "/images/landing/dragon.png", alt: "Dragon sprite" },
  { src: "/images/tutorials/blue_slime.png", alt: "Blue slime sprite" },
  { src: "/images/landing/cat_girl.png", alt: "Cat girl sprite" },
  { src: "/images/landing/chest.png", alt: "Treasure chest sprite" },
  { src: "/images/landing/sunset.png", alt: "Pixel art sunset" },
  { src: "/images/landing/rifle.png", alt: "Rifle sprite" },
  { src: "/images/landing/skyscraper.png", alt: "Pixel art skyscraper" },
];

/** Filename shown in the frame caption, derived from the asset path. */
function fileNameOf(src: string) {
  return src.split("/").pop() ?? "sprite.png";
}

export default function HeroLandingSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative border-b border-nova-fg/[0.08] px-5 pb-20 pt-24 md:px-10 md:pb-24 md:pt-[120px]">
      <div className="nova-grid" />

      <div className="relative mx-auto grid max-w-[1240px] items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 ml-2">
            <span className="nova-label text-xs text-nova-warm">
              Free to use · no paywall anywhere
            </span>
            <h1 className="m-0 text-pretty text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              Convert any image into{" "}
              <em className="not-italic text-nova-accent">true</em> pixel art
            </h1>
          </div>
          <p className="m-0 max-w-[52ch] text-pretty text-lg leading-[1.6] text-nova-fg/[0.66] md:text-[19px]">
            Transform AI-generated images, photos, or artwork into authentic
            pixel art that stays crisp and clean at any resolution.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <NovaCta href="/convert">Try now</NovaCta>
            <span className="font-mono text-xs text-nova-fg/[0.42]">
              no signup · browser-based
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="nova-frame aspect-square">
            <Swiper
              modules={[Autoplay, EffectFade]}
              slidesPerView={1}
              effect="fade"
              loop
              autoplay={{ delay: 1800, disableOnInteraction: false }}
              onSlideChange={(swiper) => setActive(swiper.realIndex)}
              className="!absolute inset-0 h-full w-full"
            >
              {carouselImages.map((image) => (
                <SwiperSlide key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={600}
                    priority
                    className="h-full w-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <FrameCaption>
              {fileNameOf(carouselImages[active]?.src ?? "")} — 64×64 sprite
            </FrameCaption>
          </div>
          <div className="flex justify-between font-mono text-[11px] text-nova-fg/[0.38]">
            <span>palette: 16</span>
            <span>zoom: 800%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
