"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroLandingSection() {
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

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-52">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid justify-center gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_400px]">
          <div className="flex flex-col justify-center space-y-4 max-md:mt-20">
            <div className="max-w-xl space-y-2">
              <Badge className="w-fit border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Free for everyone
              </Badge>
              <h1 className="max-w-xl text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                Pixel Nova Studio
              </h1>
              <p className="max-w-[600px] text-slate-300 md:text-xl">
                A free suite of pixel art tools. Convert images to true pixel
                art, colorize sprites, build skin tone palettes, and draw in the
                editor.
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link href="/convert">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-8 text-base font-medium hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
                  >
                    Convert an Image
                  </Button>
                </Link>
                <Link href="/editor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-slate-600 bg-slate-900/50 px-8 text-base font-medium text-white hover:bg-slate-800"
                  >
                    Open the Editor
                  </Button>
                </Link>
              </div>
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
