import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-og.png"
                alt="Pixel Nova Logo"
                width={32}
                height={32}
                style={{
                  imageRendering: "pixelated",
                }}
              />
              <span className="text-xl font-bold text-white">Pixel Nova</span>
            </div>
            <p className="mt-2 text-center text-sm text-slate-400 md:text-left">
              © 2025 PixelNova LLC
              <br />
              Florida, United States
            </p>
          </div>

          {/* Tools */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-sm font-semibold text-white">Tools</h3>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Link
                href="/editor"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Pixel Art Editor
              </Link>
              <Link
                href="/ai"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                AI Pixel Art
              </Link>
              <Link
                href="/convert"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Image Converter
              </Link>
              <Link
                href="/colorizer"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Colorizer
              </Link>
              <Link
                href="/skin-tone-generator"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Skin Tone Generator
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/tutorials"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Tutorials
              </Link>
              <Link
                href="/gallery"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Gallery
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/support"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Legal & Account */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-sm font-semibold text-white">
              Legal & Account
            </h3>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Link
                href="/account"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                My Account
              </Link>
              <Link
                href="/limits"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Usage Limits
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
