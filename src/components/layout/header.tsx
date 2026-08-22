"use client";
import useUser from "@/hooks/use-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserMyAvatar from "./user-my-avatar";
import Link from "next/link";
import SignOutButton from "../auth/sign-out-button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Menu, X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const navItems = [
  { href: "/convert", label: "Convert" },
  { href: "/colorizer", label: "Colorizer" },
  { href: "/skin-tone-generator", label: "Skin tones" },
  { href: "/editor", label: "Editor" },
  { href: "/tutorials", label: "Tutorials" },
];

/** Wordmark: the pixel logo plus the mono lockup used across the design. */
function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="flex items-center gap-3" onClick={onClick}>
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="h-[22px] w-[22px]"
        style={{ imageRendering: "pixelated" }}
      />
      <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-nova-fg">
        Pixel Nova Studio
      </span>
    </Link>
  );
}

export default function Header() {
  const { profile, isLoading, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const isEditor = pathname === "/editor";

  // The editor owns the full viewport, so the chrome floats over it instead
  // of taking layout space.
  const shellClass = isEditor
    ? "absolute right-0 top-0 z-30"
    : "sticky top-0 z-20 border-b border-nova-fg/[0.08] bg-nova-bg/[0.78] backdrop-blur-xl";

  const links = profile?.is_admin
    ? [...navItems, { href: "/admin", label: "Admin" }]
    : navItems;

  return (
    <header className={shellClass}>
      <div className="flex items-center justify-between gap-8 px-5 py-4 md:px-10 md:py-5">
        {!isEditor && (
          <div className="flex items-center gap-8">
            <Wordmark />

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-7 text-sm lg:flex">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-nova-fg ${
                    pathname === item.href
                      ? "text-nova-fg"
                      : "text-nova-fg/[0.62]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isEditor && (
            <Link
              href="/convert"
              className="hidden border border-nova-accent px-[18px] py-[9px] font-mono text-xs uppercase leading-none tracking-[0.12em] text-nova-fg transition-colors hover:bg-nova-accent hover:text-nova-ink lg:inline-flex"
            >
              Try now
            </Link>
          )}

          {/* Auth */}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex h-auto items-center gap-2 rounded-none border border-nova-fg/20 bg-nova-fg/[0.06] p-1.5 transition-colors hover:bg-nova-fg/[0.12]"
                >
                  <UserMyAvatar className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="flex w-64 flex-col gap-2"
                align="end"
                forceMount
              >
                <div className="flex items-center gap-2 p-2">
                  <UserMyAvatar className="h-10 w-10" />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name ? profile.full_name : "Account"}
                    </p>
                    <p className="py-1 text-sm leading-none text-muted-foreground">
                      @{profile?.username}
                    </p>
                  </div>
                </div>

                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    {...(isEditor
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    Account settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <button
                type="button"
                className="nova-btn-solid !px-5 !py-2.5 !text-xs disabled:opacity-60"
                onClick={() => {
                  if (isEditor) {
                    setIsSignInModalOpen(true);
                  } else {
                    router.push("/login");
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
              <Dialog
                open={isSignInModalOpen}
                onOpenChange={() => setIsSignInModalOpen(false)}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Save Your Work
                    </DialogTitle>
                  </DialogHeader>
                  <div className="-mt-2 flex flex-col gap-6 pb-6">
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        You may have unsaved changes in your canvas.
                      </p>
                      <p>To save: Go to File → Export </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSignInModalOpen(false);
                          router.push("/login");
                        }}
                      >
                        Continue without saving
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {/* Mobile navigation */}
          {!isEditor && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-none px-2 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 text-nova-fg" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] border-nova-fg/10 bg-nova-bg p-6 text-nova-fg"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <Wordmark onClick={() => setIsMobileMenuOpen(false)} />
                    <Button
                      variant="ghost"
                      className="h-8 w-8 rounded-none p-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6 text-nova-fg" />
                    </Button>
                  </div>

                  <nav className="flex flex-col border-t border-nova-fg/10">
                    {links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="border-b border-nova-fg/10 py-4 text-base text-nova-fg/[0.62] transition-colors hover:text-nova-fg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <Link
                    href="/convert"
                    className="nova-btn-solid"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Try now
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
