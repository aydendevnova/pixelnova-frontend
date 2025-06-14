"use client";

import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { type Database } from "@/lib/types_db";
import Link from "next/link";
import { env } from "@/env";
import { ImageIcon, Download, Grid, Archive, CheckIcon } from "lucide-react";
import { downloadAsZip, downloadAsSpritesheet } from "@/lib/utils/download";

const ITEMS_PER_PAGE = 18;

// Example images that showcase different styles (using placeholder images for now)
const EXAMPLE_IMAGES = [
  {
    src: "images/example-1.png",
    alt: "Pixel Art Example 1",
    title: "Purple Fox Character",
  },
  {
    src: "images/example-2.png",
    alt: "Pixel Art Example 2",
    title: "Green RPG Character",
  },
  {
    src: "images/example-3.png",
    alt: "Pixel Art Example 3",
    title: "Purple Fox 2",
  },
  {
    src: "images/example-4.png",
    alt: "Pixel Art Example 4",
    title: "Thanksgiving Turkey",
  },
  {
    src: "images/example-5.png",
    alt: "Pixel Art Example 5",
    title: "PixelNova New Years 2025",
  },
  {
    src: "images/example-6.png",
    alt: "Pixel Art Example 6",
    title: "Orange Fox",
  },
];

export default function GalleryPage() {
  const { user, isSignedIn } = useUser();
  const supabase = useSupabaseClient<Database>();
  const [userImages, setUserImages] = useState<
    Array<{ url: string; name: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchUserImages() {
      if (!isSignedIn || !user) {
        console.log("Not signed in or no user:", {
          isSignedIn,
          userId: user?.id,
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Attempting to list files for user:", user.id);

        // List files in the pixel-art bucket for the user
        const { data: files, error } = await supabase.storage
          .from("pixel-art")
          .list(user.id);

        console.log("Files response:", { files, error });

        if (error) {
          console.error("Error fetching images:", error);
          setError(`Failed to fetch images: ${error.message}`);
          return;
        }

        if (!files || files.length === 0) {
          console.log("No files found in bucket for user:", user.id);
          setUserImages([]);
          return;
        }

        // Construct public URLs directly
        const imageUrls = files
          .filter((file) => file.name)
          .map((file) => ({
            url: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pixel-art/${user.id}/${file.name}`,
            name: file.name,
          }));

        // reverse the array
        imageUrls.reverse();

        console.log("Valid images found:", imageUrls.length);
        setUserImages(imageUrls);
      } catch (error) {
        console.error("Error processing images:", error);
        setError("An unexpected error occurred while fetching your images");
      } finally {
        setLoading(false);
      }
    }

    void fetchUserImages();
  }, [supabase, user, isSignedIn]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const displayedImages = userImages.slice(0, displayCount);
  const hasMore = displayCount < userImages.length;

  const handleDownloadSingle = async (imageUrl: string, name: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.split(".")[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleDownloadSelected = async (type: "zip" | "spritesheet") => {
    if (selectedImages.size === 0) return;

    try {
      // First, fetch all selected images and convert them to ImageData
      const results = await Promise.all(
        Array.from(selectedImages).map(async (index) => {
          const image = userImages[index];
          if (!image || !image.name) {
            throw new Error("Invalid image data");
          }

          const response = await fetch(image.url);
          const blob = await response.blob();
          const bitmap = await createImageBitmap(blob);

          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not get canvas context");

          ctx.drawImage(bitmap, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          return {
            preset: image.name.split(".")[0] ?? `image_${index}`, // Fallback name if split fails
            imageData: imageData,
          };
        }),
      );

      if (type === "zip") {
        await downloadAsZip(
          results,
          new Set(Array.from({ length: results.length }, (_, i) => i)),
        );
      } else {
        downloadAsSpritesheet(
          results,
          new Set(Array.from({ length: results.length }, (_, i) => i)),
        );
      }
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  };

  const toggleImageSelection = (index: number) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="duration-500 animate-in fade-in">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Main Content Section */}
          <div className="w-full overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 lg:h-[90vh]">
            {/* Header */}
            <div className="border-b border-slate-700/50">
              <div className="mx-auto pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-blue-400" />
                    <div className="">
                      <h1 className="text-3xl font-bold text-white">Gallery</h1>
                      <p className="text-slate-400">
                        View and manage your pixel art creations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Images Section */}
            <section className="mb-12 mt-6">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Example Creations
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                {EXAMPLE_IMAGES.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                    <h3 className="mt-4 text-center  font-medium text-white">
                      {image.title}
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            {/* User Images Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Your Generations
                </h2>
                <div className="flex gap-2">
                  {displayedImages.length > 0 && (
                    <button
                      onClick={() => {
                        const allIndices = new Set(
                          displayedImages.map((_, i) => i),
                        );
                        setSelectedImages(
                          selectedImages.size === allIndices.size
                            ? new Set()
                            : allIndices,
                        );
                      }}
                      className="flex items-center gap-2 rounded-md bg-slate-700/50 px-3 py-1.5 text-sm text-white hover:bg-slate-600/50"
                    >
                      {selectedImages.size === displayedImages.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                  {selectedImages.size > 0 && (
                    <>
                      <button
                        onClick={() => handleDownloadSelected("spritesheet")}
                        className="flex items-center gap-2 rounded-md bg-slate-700/50 px-3 py-1.5 text-sm text-white hover:bg-slate-600/50"
                      >
                        <Grid className="h-4 w-4" />
                        Download as Spritesheet
                      </button>
                      <button
                        onClick={() => handleDownloadSelected("zip")}
                        className="flex items-center gap-2 rounded-md bg-slate-700/50 px-3 py-1.5 text-sm text-white hover:bg-slate-600/50"
                      >
                        <Archive className="h-4 w-4" />
                        Download as ZIP
                      </button>
                    </>
                  )}
                </div>
              </div>
              {error ? (
                <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-center text-red-200">
                  {error}
                </div>
              ) : !isSignedIn ? (
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center">
                  <p className="mb-4 text-slate-400">
                    Sign in to view and manage your pixel art creations
                  </p>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-pink-500"
                  >
                    Sign In
                  </Link>
                </div>
              ) : loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : userImages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                    {displayedImages.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => toggleImageSelection(index)}
                        className={`group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-lg border p-4 transition-all duration-300 ${
                          selectedImages.has(index)
                            ? "border-amber-400 bg-amber-500/10"
                            : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600"
                        }`}
                      >
                        <div className="mb-2 flex w-full items-center justify-between">
                          <p className="select-none text-sm font-medium text-white">
                            {new Date(
                              parseInt(image?.name?.split(".")[0] ?? ""),
                            ).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDownloadSingle(
                                  image.url,
                                  image.name,
                                );
                              }}
                              className="select-none rounded-full bg-slate-700/50 p-2 opacity-0 transition-opacity duration-200 hover:bg-slate-600/50 group-hover:opacity-100"
                            >
                              <Download className="h-4 w-4 text-white" />
                            </button>
                            <div
                              className={`flex h-5 w-5 select-none items-center justify-center rounded border ${
                                selectedImages.has(index)
                                  ? "border-amber-400 bg-amber-400"
                                  : "border-slate-500"
                              }`}
                            >
                              {selectedImages.has(index) && (
                                <CheckIcon className="h-3 w-3 text-black" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="relative aspect-square w-full select-none overflow-hidden rounded-lg">
                          <Image
                            src={image.url}
                            alt={`User Creation ${index + 1}`}
                            fill
                            className="select-none object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{
                              imageRendering: "pixelated",
                            }}
                            draggable={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        className="rounded-md bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-pink-500"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center">
                  <p className="mb-4 text-slate-400">
                    You haven&apos;t created any pixel art yet
                  </p>
                  <Link
                    href="/ai-pixel-art"
                    className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-pink-500"
                  >
                    Create Your First Pixel Art
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
