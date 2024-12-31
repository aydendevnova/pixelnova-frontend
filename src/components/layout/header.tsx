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
import { usePathname } from "next/navigation";

export default function Header() {
  const { profile, isSignedIn } = useUser();
  const pathname = usePathname();

  if (pathname === "/signin" || pathname === "/signup") {
    return <></>;
  }

  return (
    <div
      className={pathname === "/" ? "absolute right-2 top-2 z-40" : "px-4 py-2"}
    >
      <div className="flex items-center justify-between">
        {pathname != "/" && (
          <Link className="flex items-center justify-center" href="/">
            <img src="/logo.png" alt="Pixel Labs" className="h-8 w-8" />
            <span className="ml-2 text-lg font-bold text-black">
              Pixel Labs App
            </span>
          </Link>
        )}
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8">
                <UserMyAvatar />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex w-56 flex-col gap-2 bg-white dark:bg-black"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">Account settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
