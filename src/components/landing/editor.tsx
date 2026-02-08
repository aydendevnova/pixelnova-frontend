import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Layers, Brush, Palette, Wand2, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";

export default function EditorLandingSection() {
  const editorFeatures = [
    {
      icon: <Layers className="h-5 w-5 text-emerald-500" />,
      title: "Layer System",
      description:
        "Create complex pixel art with unlimited layers, perfect for character customization and animation",
    },
    {
      icon: <Brush className="h-5 w-5 text-emerald-500" />,
      title: "Precision Tools",
      description:
        "Professional-grade brushes and tools designed specifically for pixel art creation",
    },
    {
      icon: <Palette className="h-5 w-5 text-emerald-500" />,
      title: "Color Management",
      description:
        "Intelligent color palettes and real-time color harmonization",
    },
    {
      icon: <Wand2 className="h-5 w-5 text-emerald-500" />,
      title: "AI-Powered Traits",
      description:
        "Generate and mix character traits with our revolutionary AI system",
    },
  ];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-1 text-white">
            🎨 Professional Editor
          </Badge>
          <h2 className="mb-4 text-4xl font-bold text-white">
            The New Pixel Art Editor
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Create, customize, and perfect your pixel art with our simple
            editor. <br /> Designed for newcomers.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href="/editor" className="mx-auto mb-8 w-fit">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
            >
              Open Editor
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="relative mb-12 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur">
          <Image
            alt="Pixel art editor interface preview"
            className="mx-auto w-full max-w-5xl rounded-lg border border-slate-600 object-cover"
            height={800}
            width={1000}
            src="/images/landing/editor.png"
            priority
          />

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {editorFeatures.map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-800/50"
              >
                <div className="mb-4 inline-block rounded-full bg-emerald-500/20 p-3">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
