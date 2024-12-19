"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarPlaceholder from "@/assets/avatar-placeholder.webp";
import useUser from "@/hooks/use-user";
import Image from "next/image";

interface UserAvatarProps {
  className?: string;
}

export default function UserMyAvatar({ className = "" }: UserAvatarProps) {
  const { profile } = useUser();

  return (
    <Avatar className={className}>
      {profile?.avatar_url && (
        <AvatarImage
          src={profile?.avatar_url ?? AvatarPlaceholder.src}
          alt="User avatar"
          style={{ imageRendering: "pixelated" }}
        />
      )}

      <AvatarFallback>
        <Image
          src={AvatarPlaceholder.src}
          width={64}
          height={64}
          alt="Avatar placeholder"
          className="h-full w-full object-cover"
          style={{ imageRendering: "pixelated" }}
        />
      </AvatarFallback>
    </Avatar>
  );
}
