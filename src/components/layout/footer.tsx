import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    heading: "Tools",
    links: [
      { href: "/convert", label: "Image Converter" },
      { href: "/colorizer", label: "Colorizer" },
      { href: "/skin-tone-generator", label: "Skin Tone Generator" },
      { href: "/editor", label: "Pixel Art Editor" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/tutorials", label: "Tutorials" },
      { href: "/support", label: "Contact Support" },
    ],
  },
  {
    heading: "Legal & Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/credits", label: "Credits" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-nova-fg/[0.08] bg-nova-bg px-5 pb-12 pt-16 md:px-10">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={22}
                height={22}
                className="h-[22px] w-[22px]"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-nova-fg">
                Pixel Nova Studio
              </span>
            </div>
            <p className="m-0 text-sm leading-[1.6] text-nova-fg/[0.42]">
              © 2026 PixelNova LLC
              <br />
              Florida, United States
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-nova-fg/[0.42]">
                {column.heading}
              </h3>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-nova-fg/[0.62] transition-colors hover:text-nova-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-6 border-t border-nova-fg/10 pt-7 font-mono text-xs text-nova-fg/40">
          <span>Pixel Nova Studio</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
