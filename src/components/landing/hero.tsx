"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroLandingSection() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const carouselImages = [
    { src: "/images/landing/purple_staff.png", alt: "Purple Staff" },
    { src: "/images/landing/wizard.png", alt: "Wizard" },
    { src: "/images/landing/dragon.png", alt: "Dragon" },
    { src: "/images/tutorials/blue_slime.png", alt: "Blue Slime" },
    { src: "/images/landing/cat_girl.png", alt: "Cat Girl" },
    { src: "/images/landing/chest.png", alt: "Chest" },
    { src: "/images/landing/sunset.png", alt: "Sunset" },
    { src: "/images/landing/rifle.png", alt: "Rifle" },
    { src: "/images/landing/skyscraper.png", alt: "Skyscraper" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/ai?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-52">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid justify-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_400px]">
          <div className="flex flex-col justify-center space-y-4 max-md:mt-20">
            <div className="max-w-xl space-y-2">
              <Badge className="w-fit border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Now Live
              </Badge>
              <h1 className="max-w-xl text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                Your Ideas to Pixel Art in Seconds
              </h1>
              <p className="max-w-[600px] text-slate-300 md:text-xl">
                Transform any text prompt into stunning pixel art in seconds. No
                artistic skills needed - just describe what you want and let our
                AI do the magic.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 pt-6"
              >
                <div className="relative flex w-full max-w-[700px] items-center">
                  <Input
                    type="text"
                    placeholder="Describe your pixel art idea..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    autoFocus
                    className="block h-14 rounded-2xl border-slate-700 bg-slate-900/50 px-6 text-lg text-white placeholder:text-slate-400 lg:hidden"
                  />
                  <Input
                    type="text"
                    placeholder="Describe your pixel art idea... (e.g. 'a cute blue slime')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    autoFocus
                    className="hidden h-14 rounded-2xl border-slate-700 bg-slate-900/50 px-6 text-lg text-white placeholder:text-slate-400 lg:block"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-6 text-base font-medium hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                  >
                    Generate
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                  Try:
                  <Link
                    href="/ai?prompt=a magical sword with blue flames"
                    className="hover:text-white"
                  >
                    magical sword
                  </Link>
                  <span>•</span>
                  <Link
                    href="/ai?prompt=cute red dragon"
                    className="hover:text-white"
                  >
                    red dragon
                  </Link>
                  <span>•</span>
                  <Link
                    href="/ai?prompt=retro game style treasure chest"
                    className="hover:text-white"
                  >
                    treasure chest
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden rounded-2xl">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              spaceBetween={0}
              slidesPerView={1}
              effect="fade"
              autoplay={{
                delay: 1500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
                bulletClass: "swiper-pagination-bullet !bg-white/50",
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="group h-full w-full [&_.swiper-button-next]:!text-white [&_.swiper-button-next]:!opacity-0 hover:[&_.swiper-button-next]:!opacity-100 [&_.swiper-button-prev]:!text-white [&_.swiper-button-prev]:!opacity-0 hover:[&_.swiper-button-prev]:!opacity-100 [&_.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination-bullet]:!bg-white/50"
            >
              {carouselImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
