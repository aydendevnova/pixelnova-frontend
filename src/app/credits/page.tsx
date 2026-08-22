import Link from "next/link";

export default function Credits() {
  return (
    <div className="mx-auto mt-20 max-w-4xl bg-white px-4 py-8 text-black">
      <h1 className="mb-2 text-3xl font-bold">Credits & Attributions</h1>
      <h3 className="text-gray-600">A product of PixelNova LLC</h3>

      <div className="space-y-8 text-gray-800">
        <p className="mt-6 text-sm text-gray-600">
          Last updated: February 8, 2026
        </p>

        <p>
          Pixel Nova Studio is built on top of several open-source projects and
          third-party services. This page documents what we use, how we use it,
          and the applicable licenses. If you are a developer or someone who
          cares about transparency in software, this page is for you.
        </p>

        {/* PixelNova License */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">PixelNova Source Code</h2>
          <p>
            The PixelNova source code is publicly available on GitHub and
            licensed under the{" "}
            <strong>
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0
              International License (CC BY-NC-SA 4.0)
            </strong>
            . This means you are free to share and adapt the code for
            non-commercial purposes, provided you give appropriate credit and
            distribute derivative works under the same license.
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm">
              <strong>License:</strong> CC BY-NC-SA 4.0
              <br />
              <strong>Full text:</strong>{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                creativecommons.org/licenses/by-nc-sa/4.0
              </a>
            </p>
          </div>
        </section>

        {/* Pixel Snapper */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">SpriteFusion Pixel Snapper</h2>
          <p>
            Pixel Nova Studio uses the SpriteFusion Pixel Snapper to convert
            uploaded images into true pixel art. The tool snaps pixels to a
            clean, consistent grid and quantizes colors to a strict palette,
            correcting the inconsistent pixel sizes and grid drift found in
            images that only look like pixel art. We compile the Rust source to
            WebAssembly and run it server-side in Node.js.
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-medium">spritefusion-pixel-snapper</h3>
            <div className="mt-2 text-sm">
              <p>
                <strong>Author:</strong> Hugo Duprez
              </p>
              <p>
                <strong>Repository:</strong>{" "}
                <a
                  href="https://github.com/Hugo-Dz/spritefusion-pixel-snapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  github.com/Hugo-Dz/spritefusion-pixel-snapper
                </a>
              </p>
              <p>
                <strong>License:</strong> MIT License
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.spritefusion.com/pixel-snapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  spritefusion.com/pixel-snapper
                </a>
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              MIT License Notice
            </p>
            <p className="text-xs leading-relaxed text-gray-700">
              Copyright (c) Hugo Duprez
              <br />
              <br />
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the &quot;Software&quot;), to deal in the Software without
              restriction, including without limitation the rights to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies
              of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
              <br />
              <br />
              The above copyright notice and this permission notice shall be
              included in all copies or substantial portions of the Software.
              <br />
              <br />
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF
              ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
              AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Third-Party Services</h2>
          <p>
            The following services are used in the operation of Pixel Nova
            Studio. They are not open-source dependencies but are integral to
            the platform.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Supabase</strong> &mdash; Authentication, database
              (PostgreSQL), and file storage.
            </li>
            <li>
              <strong>Cloudflare</strong> &mdash; CDN, DDoS protection, and
              frontend hosting (Cloudflare Pages).
            </li>
            <li>
              <strong>Fly.io</strong> &mdash; Backend API hosting and
              deployment.
            </li>
          </ul>
        </section>

        {/* Open-Source Stack */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Open-Source Stack</h2>
          <p>
            Pixel Nova Studio is built with the following open-source frameworks
            and libraries, among others. Full dependency lists are available in
            the respective repository package files.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="font-medium">Frontend</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                <li>Next.js (React)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Shadcn/ui (Radix UI)</li>
                <li>React Query</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="font-medium">Backend</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                <li>Node.js (Express)</li>
                <li>TypeScript</li>
                <li>Sharp (image processing)</li>
                <li>Zod (validation)</li>
                <li>WebAssembly (pixel snapping)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            If you have questions about licensing, attribution, or believe a
            credit is missing, contact us at{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>
            .
          </p>
        </section>

        <hr className="border-gray-200" />

        <p className="text-sm text-gray-500">
          See also:{" "}
          <Link
            href="/terms-of-service"
            className="text-blue-600 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          &middot;{" "}
          <Link
            href="/privacy-policy"
            className="text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
