import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
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

          {/* Legal Links */}
          <div className="flex gap-6">
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
    </footer>
  );
}
