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
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Header() {
  const { profile, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const router = useRouter();

  // if (pathname === "/signin" || pathname === "/signup") {
  //   return <></>;
  // }

  return (
    <div
      className={
        pathname === "/editor"
          ? "absolute right-0 top-0 z-30"
          : "absolute left-0 right-0 top-0"
      }
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
            <div className="flex items-center gap-4">
              <Link
                href="/ai-pixel-art"
                className="text-sm text-white hover:text-gray-200"
              >
                AI Pixel Art
              </Link>
              <Link
                href="/convert"
                className="text-sm text-white hover:text-gray-200"
              >
                Convert to Pixel Art
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-sm text-white hover:text-gray-200"
                  >
                    More <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white" align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/colorizer">Colorizer</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/skin-tone-generator">Skin Tone Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/editor">Pixel Art Editor</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8">
                <UserMyAvatar />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex w-56 flex-col gap-2 bg-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>

                  <p className="pt-2 text-xs leading-none text-muted-foreground">
                    @{profile?.username}
                  </p>
                </div>
                <div className="my-2">
                  <CreditsDisplay />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/pricing" target="_blank" rel="noopener noreferrer">
                  Buy Credits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account" target="_blank" rel="noopener noreferrer">
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
                  router.push("/signin");
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
                  <div className=" flex flex-col gap-4">
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
                        router.push("/signin");
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
