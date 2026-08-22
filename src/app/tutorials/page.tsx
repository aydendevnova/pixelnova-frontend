import { Metadata } from "next";
import { ImageDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Tutorials | Pixel Nova Studio",
  description:
    "Guides for the Pixel Nova Studio tools. Learn how to convert images into true pixel art and get the most out of the editor.",
  keywords: [
    "pixel art tutorials",
    "pixel art learning",
    "game art tutorials",
    "pixel art techniques",
    "image conversion guide",
    "pixel art basics",
    "game asset creation",
    "beginner pixel art",
  ].join(", "),
  openGraph: {
    title: "Tutorials | Pixel Nova Studio",
    description:
      "Guides for the Pixel Nova Studio tools, from image conversion to the editor.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pixel Nova Studio Tutorials",
      },
    ],
    siteName: "Pixel Nova Studio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tutorials | Pixel Nova Studio",
    description: "Free guides for every Pixel Nova Studio tool.",
    images: ["/og-image.jpg"],
    creator: "@thepixelnova",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://pixelnova.app/tutorials",
  },
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 duration-500 animate-in fade-in sm:px-6 lg:px-8">
        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white">Tutorials</h1>
          <p className="text-slate-400">
            Learn how to use the Pixel Nova Studio tools
          </p>
        </div>

        <div className="grid gap-8">
          <TutorialBlogCard
            href="/tutorials/convert-to-pixel-art"
            imageSrc="/images/tutorials/sample_ai_2.png"
            imageAlt="Image Conversion Example"
            date="June 20, 2025"
            readTime="2 min read"
            title="Convert Images to Real Pixel Art"
            description="Discover how to turn any image into authentic pixel art with the converter. Learn best practices for achieving clean, crisp results from any source image."
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
