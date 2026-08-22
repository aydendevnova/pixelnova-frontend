import { NovaCta } from "./nova";

/** Closing call to action, sits directly above the site footer. */
export default function ClosingCtaSection() {
  return (
    <section className="relative z-[1] px-5 py-20 md:px-10 md:py-[88px]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-10">
        <h2 className="m-0 max-w-[22ch] text-[clamp(2.25rem,5vw,3.625rem)] font-semibold leading-none tracking-[-0.035em]">
          Start with one image. Keep every pixel.
        </h2>
        <NovaCta href="/convert" variant="warm" className="!px-10 !py-[18px]">
          Try Pixel Nova free
        </NovaCta>
      </div>
    </section>
  );
}
