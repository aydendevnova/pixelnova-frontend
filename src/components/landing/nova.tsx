import Link from "next/link";

/**
 * Shared primitives for the Pixel Nova Studio landing design.
 * Spec: "Pixel Nova Studio.dc.html" (Claude Design).
 */

/** Section shell: hairline bottom rule, generous vertical rhythm, 1240px well. */
export function NovaSection({
  id,
  children,
  tinted = false,
  bordered = true,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  /** Faint white lift used to alternate section grounds. */
  tinted?: boolean;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-[1] px-5 py-20 md:px-10 md:py-[104px] ${
        tinted ? "bg-white/[0.022]" : ""
      } ${bordered ? "border-b border-nova-fg/[0.08]" : ""} ${className}`}
    >
      <div className="mx-auto max-w-[1240px]">{children}</div>
    </section>
  );
}

/**
 * Mono file/meta caption pinned to the bottom of a framed media well.
 * Absolutely positioned on purpose — an in-flow child would feed back into
 * the frame's aspect-ratio sizing.
 */
export function FrameCaption({
  children,
  bright = false,
}: {
  children: React.ReactNode;
  bright?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-nova-bg/90 to-transparent px-4 pb-4 pt-10">
      <span
        className={`font-mono text-[11px] tracking-[0.1em] ${
          bright ? "text-nova-fg/60" : "text-nova-fg/50"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

/** A labelled row in the two-column spec lists. */
export function SpecRow({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="nova-specrow">
      <span className="text-base">{term}</span>
      <span className="text-[15px] text-nova-fg/55">{detail}</span>
    </div>
  );
}

/** Square, mono, uppercase call to action. */
export function NovaCta({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "warm";
  className?: string;
}) {
  const variantClass = {
    solid: "nova-btn-solid",
    outline: "nova-btn-outline",
    warm: "nova-btn-warm",
  }[variant];

  return (
    <Link href={href} className={`${variantClass} ${className}`}>
      {children}
    </Link>
  );
}
