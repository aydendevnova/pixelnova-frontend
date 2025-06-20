"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Pencil, Upload } from "lucide-react";

import useUser from "@/hooks/use-user";
import { useUpdateAccount } from "@/hooks/use-api";
import { useEffect, useState } from "react";

import AvatarPlaceholder from "@/assets/avatar-placeholder.webp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import ChangeUsernameModal from "./change-username";
import { useRouter } from "next/navigation";
import SignOutButton from "@/components/auth/sign-out-button";
import { validateFormUtil } from "@/lib/validate-form";
import { updateAccountSchema } from "@/shared-types";

type FormErrors = {
  fullName?: string;
  username?: string;
  website?: string;
};

export default function PageClient() {
  const router = useRouter();
  const { user, isLoading, isSignedIn, profile, invalidateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    website: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    mutate: updateAccount,
    isLoading: isUpdatingAccount,
    isError: isError,
    error,
  } = useUpdateAccount();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleEdit = () => {
    setFormData({
      fullName: profile?.full_name ?? "",
      username: profile?.username ?? "",
      website:
        (profile?.website && profile.website.replace("https://", "")) ?? "",
    });
    setFormErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(undefined);
    setPreviewImage(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const result = validateFormUtil(updateAccountSchema, {
      ...formData,
      website:
        formData.website.length > 0 ? "https://" + formData.website : undefined,
    });
    if (!result.success) {
      setFormErrors(result.errors ?? {});
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // validate form
    //clear form errors
    setFormErrors({});
    if (!validateForm()) return;
    updateAccount(
      {
        fullName: formData.fullName,
        username: formData.username,
        website:
          formData.website.length > 0
            ? "https://" + formData.website
            : undefined,
        image: selectedImage,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedImage(undefined);
          setPreviewImage(null);
          void invalidateUser();
          // Add a cache-busting query parameter to force image refresh
          if (profile?.avatar_url) {
            const url = new URL(profile.avatar_url);
            url.searchParams.set("t", Date.now().toString());
            profile.avatar_url = url.toString();
          }
        },
      },
    );
  };

  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] =
    useState(false);

  function handleChangeUsernameModalClose() {
    setIsChangeUsernameModalOpen(false);
  }

  function handleChangeUsernameModalSave(username: string) {
    setFormData({ ...formData, username });
    setIsChangeUsernameModalOpen(false);
  }

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 scroll-m-20 text-4xl font-bold tracking-tight">
          Account Settings
        </h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && !profile && <div>Loading...</div>}
            {!!profile && !isLoading && (
              <div className="space-y-6">
                {user && (
                  <>
                    <div className="space-y-2">
                      {isEditing && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Profile Picture Notice</AlertTitle>
                          <AlertDescription>
                            It may take some time for your profile picture to
                            update.
                          </AlertDescription>
                        </Alert>
                      )}
                      <Label>Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              previewImage ??
                              profile?.avatar_url ??
                              AvatarPlaceholder.src
                            }
                            alt="Profile"
                            className="object-cover"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                        {isEditing && (
                          <div className="flex flex-col gap-2">
                            <Input
                              type="file"
                              accept="image/jpeg, image/png, image/webp"
                              onChange={handleImageChange}
                              className="max-w-[220px]"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            });
                          }}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profile?.full_name ?? "Not set"}
                        </p>
                      )}
                      {formErrors.fullName && (
                        <p className="text-sm text-destructive">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Username</Label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Input
                              value={formData.username}
                              readOnly
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  username: e.target.value,
                                })
                              }
                              placeholder="Enter your username"
                              className="w-fit"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              className="mx-2 py-5"
                              onClick={() => setIsChangeUsernameModalOpen(true)}
                            >
                              <div className="flex items-center gap-4">
                                <Pencil className="h-4 w-4" />
                                <span>Change username</span>
                              </div>
                            </Button>
                          </div>

                          {formErrors.username && (
                            <p className="text-sm text-destructive">
                              {formErrors.username}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {"@" + profile.username}
                        </p>
                      )}
                      {isEditing &&
                        !!formData.username &&
                        formData.username != profile.username && (
                          <div>
                            <Alert className="mb-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Username</AlertTitle>
                              <AlertDescription>
                                Save changes to confirm your username.
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label>Website (optional)</Label>
                      {isEditing ? (
                        <div className="flex flex-col space-y-2">
                          <div className="relative">
                            {formData.website.length > 0 && (
                              <p className="absolute left-2.5 top-2.5 text-sm text-muted-foreground">
                                https://
                              </p>
                            )}
                            <Input
                              value={formData.website}
                              className={
                                formData.website.length > 0 ? "pl-14" : ""
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  website: e.target.value,
                                })
                              }
                              placeholder="Enter your website"
                            />
                          </div>

                          {/* {formData.website && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <p>Test your link:</p>
                            <a
                              href={"https://" + formData.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              {formData.website}
                            </a>
                          </div>
                        )} */}
                          {formErrors.website && (
                            <p className="text-sm text-destructive">
                              {formErrors.website}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profile?.website ?? "Not set"}
                        </p>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isUpdatingAccount}
                        >
                          {isUpdatingAccount ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isUpdatingAccount}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start space-y-2">
                        <SignOutButton />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>An error occurred</AlertTitle>

                <AlertDescription>
                  Message: {(error as Error).message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <ChangeUsernameModal
        isOpen={isChangeUsernameModalOpen}
        onClose={handleChangeUsernameModalClose}
        onSave={handleChangeUsernameModalSave}
        currentUsername={formData.username}
        onOpen={() => setIsChangeUsernameModalOpen(true)}
      />
    </div>
  );
}
