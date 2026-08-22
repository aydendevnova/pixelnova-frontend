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
import {
  ChevronDown,
  Menu,
  X,
  Palette,
  Users,
  Pencil,
  Loader2,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const pathsWithBackground = [
  "/terms-of-service",
  "/privacy-policy",
  "/support",
  "/credits",
];

export default function Header() {
  const { profile, isLoading, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  const mainNavItems = [
    { href: "/convert", label: "Convert to Pixel Art" },
    { href: "/tutorials", label: "Tutorials" },
  ];

  const moreNavItems = [
    {
      href: "/colorizer",
      label: "Colorizer",
      icon: <Palette className="mr-2 h-4 w-4" />,
    },
    {
      href: "/skin-tone-generator",
      label: "Skin Tone Generator",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/editor",
      label: "Pixel Art Editor",
      icon: <Pencil className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div
      className={`${
        pathname === "/editor"
          ? "absolute right-0 top-0 z-30"
          : "absolute left-0 right-0 top-0"
      } ${pathsWithBackground.includes(pathname) ? "bg-black" : ""}`}
    >
      <div className="relative z-20 flex items-center justify-between p-4">
        {pathname != "/editor" && (
          <div className="flex items-center gap-6">
            <Link className="flex items-center justify-center" href="/">
              <img
                src="/logo.png"
                alt="Pixel Nova Studio"
                className="h-8 w-8"
              />
              <span className="mx-2 text-lg font-bold text-white">
                Pixel Nova Studio
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
              {profile?.is_admin && (
                <Link
                  key="/admin"
                  href="/admin"
                  className="mx-2 text-base text-white hover:text-gray-200"
                >
                  Admin
                </Link>
              )}
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
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        {item.label}
                      </Link>
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
                        src="/logo.png"
                        alt="Pixel Nova Studio"
                        className="h-8 w-8"
                      />
                      <span className="text-lg font-bold text-white">
                        Pixel Nova Studio
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
                          className="flex items-center py-2 text-base text-white hover:text-gray-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
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
              <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition-all duration-200 hover:bg-white/20"
              >
                <UserMyAvatar className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex w-64 flex-col gap-2 "
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign in"
              )}
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
