"use client";
import { Wand2, ImageDown } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { LucideIcon, Calendar, Clock } from "lucide-react";

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="mx-auto max-w-7xl px-4 duration-500 animate-in fade-in sm:px-6 lg:px-8">
        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white">Tutorials</h1>
          <p className="text-slate-400">
            Learn how to use Pixel Nova's features
          </p>
        </div>

        <div className="grid gap-8">
          <TutorialBlogCard
            href="/tutorials/ai-pixel-art"
            imageSrc="/images/tutorials/blue_sword.png"
            imageAlt="AI Pixel Art Example"
            date="June 20, 2025"
            readTime="2 min read"
            title="AI Pixel Art Generation"
            description="Learn how to use our AI-powered pixel art generator to create unique pixel art from text prompts. Master the art of crafting perfect prompts and understanding the settings that lead to the best results."
            Icon={Wand2}
            accentColor="purple"
          />

          <TutorialBlogCard
            href="/tutorials/convert-to-pixel-art"
            imageSrc="/images/tutorials/sample_ai_2.png"
            imageAlt="Image Conversion Example"
            date="June 20, 2025"
            readTime="2 min read"
            title="Convert AI Images to Real Pixel Art"
            description="Discover how to convert and fix AI-generated images into authentic pixel art using our specialized tools. Learn best practices for achieving clean, crisp pixel art from any AI-generated source image."
            Icon={ImageDown}
            accentColor="blue"
          />
        </div>
      </div>
    </div>
  );
}

interface TutorialCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  accentColor: string;
}

function TutorialBlogCard({
  href,
  imageSrc,
  imageAlt,
  date,
  readTime,
  title,
  description,
  Icon,
  accentColor,
}: TutorialCardProps) {
  return (
    <Link href={href} className="group block">
      <article
        className={`overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 transition-all hover:border-${accentColor}-500/50 hover:bg-slate-800/80`}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 w-full flex-shrink-0 sm:w-48">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>
          <div className="flex-1 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 hidden flex-shrink-0 sm:block">
                <Icon className={`h-8 w-8 text-${accentColor}-400`} />
              </div>
              <div>
                <h2
                  className={`mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-${accentColor}-400`}
                >
                  {title}
                </h2>
                <p className="leading-relaxed text-slate-400">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
