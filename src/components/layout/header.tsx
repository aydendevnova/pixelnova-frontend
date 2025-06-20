"use client";
import useUser from "@/hooks/use-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserMyAvatar from "./user-my-avatar";
import Link from "next/link";
import SignOutButton from "../auth/sign-out-button";
import { usePathname, useRouter } from "next/navigation";
import { CreditsDisplay } from "../credits-display";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowRight, ChevronDown, Menu, X, Crown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ConversionsDisplay } from "../conversions-display";
import { Badge } from "../ui/badge";

export default function Header() {
  const { profile, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const mainNavItems = [
    { href: "/ai-pixel-art", label: "AI Pixel Art" },
    { href: "/convert", label: "Convert to Pixel Art" },
    { href: "/pricing", label: "Pricing" },
  ];

  const moreNavItems = [
    { href: "/colorizer", label: "Colorizer" },
    { href: "/skin-tone-generator", label: "Skin Tone Generator" },
    { href: "/editor", label: "Pixel Art Editor" },
  ];

  return (
    <div
      className={`${
        pathname === "/editor"
          ? "absolute right-0 top-0 z-30"
          : "absolute left-0 right-0 top-0"
      } ${
        pathname === "/terms-of-service" ||
        pathname === "/privacy-policy" ||
        pathname === "/limits"
          ? "bg-black"
          : ""
      }`}
    >
      <div className="relative z-20 flex items-center justify-between p-4">
        {pathname != "/editor" && (
          <div className="flex items-center gap-6">
            <Link className="flex items-center justify-center" href="/">
              <img src="/logo-og.png" alt="Pixel Nova" className="h-8 w-8" />
              <span className="mx-2 text-lg font-bold text-white">
                Pixel Nova
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 md:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mx-2 text-base text-white hover:text-gray-200"
                >
                  {item.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-base text-white hover:text-gray-200"
                  >
                    More <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white" align="start">
                  {moreNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] border-slate-700/50 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <img
                        src="/logo-og.png"
                        alt="Pixel Nova"
                        className="h-8 w-8"
                      />
                      <span className="text-lg font-bold text-white">
                        Pixel Nova
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base text-white hover:text-gray-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="pt-2">
                      <p className="mb-2 text-sm font-semibold text-gray-400">
                        More
                      </p>
                      {moreNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-2 text-base text-white hover:text-gray-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Auth Section */}
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8">
                <UserMyAvatar />
                {profile?.tier === "PRO" && (
                  <div className="absolute -left-6 bottom-2 rounded-full">
                    <div
                      className="icon"
                      style={{
                        color: "rgb(0, 0, 0)",
                      }}
                    >
                      <svg
                        stroke="#ffa500"
                        fill="#ffa500"
                        stroke-width="0"
                        viewBox="0 0 24 24"
                        height="200px"
                        width="200px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.80577 5.20006L7.00505 7.99958L11.1913 2.13881C11.5123 1.6894 12.1369 1.58531 12.5863 1.90631C12.6761 1.97045 12.7546 2.04901 12.8188 2.13881L17.0051 7.99958L21.2043 5.20006C21.6639 4.89371 22.2847 5.01788 22.5911 5.47741C22.7228 5.67503 22.7799 5.91308 22.7522 6.14895L21.109 20.1164C21.0497 20.62 20.6229 20.9996 20.1158 20.9996H3.8943C3.38722 20.9996 2.9604 20.62 2.90115 20.1164L1.25792 6.14895C1.19339 5.60045 1.58573 5.10349 2.13423 5.03896C2.37011 5.01121 2.60816 5.06832 2.80577 5.20006ZM12.0051 14.9996C13.1096 14.9996 14.0051 14.1042 14.0051 12.9996C14.0051 11.895 13.1096 10.9996 12.0051 10.9996C10.9005 10.9996 10.0051 11.895 10.0051 12.9996C10.0051 14.1042 10.9005 14.9996 12.0051 14.9996Z"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex w-64 flex-col gap-2 bg-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name ? profile.full_name : "Account"}
                  </p>

                  <p className="py-2 text-xs leading-none text-muted-foreground">
                    @{profile?.username}
                  </p>
                  {profile?.tier === "PRO" && (
                    <Badge
                      variant="default"
                      className="w-fit bg-purple-600 hover:bg-purple-600"
                    >
                      PRO
                    </Badge>
                  )}
                </div>
                <div className="my-2 space-y-2">
                  <CreditsDisplay />
                  <ConversionsDisplay />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profile?.tier == "PRO" ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/pricing"
                      {...(pathname === "/editor"
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      Manage Subscription
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href="/pricing"
                    {...(pathname === "/editor"
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    Upgrade to Pro
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href="/account"
                  {...(pathname === "/editor"
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
            <Button
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                if (pathname === "/editor") {
                  setIsSignInModalOpen(true);
                } else {
                  router.push("/login");
                }
              }}
            >
              Sign in
            </Button>
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
      </div>
    </div>
  );
}
