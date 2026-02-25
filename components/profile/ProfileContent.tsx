"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import CloudStorage from "@/components/user/CloudStorage";

export default function ProfileContent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the tab from URL parameters, default to "profile"
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "security", "storage"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  // Use string values for formData to avoid type issues with Input
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Account deletion state
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center min-h-[200px] text-blue-600 font-semibold">
        Loading...
      </div>
    );
  if (!isSignedIn || !user)
    return (
      <div className="flex items-center justify-center min-h-[200px] text-blue-600 font-semibold">
        You must be signed in to view your profile.
      </div>
    );

  // Prepare editable fields (remove edit for email)
  const fields = [
    { label: "First Name", key: "firstName", value: user.firstName ?? "" },
    { label: "Last Name", key: "lastName", value: user.lastName ?? "" },
    { label: "Username", key: "username", value: user.username ?? "" },
    {
      label: "Email",
      key: "emailAddress",
      value: user.primaryEmailAddress?.emailAddress ?? "",
    },
    {
      label: "Role",
      key: "role",
      value:
        typeof user.publicMetadata?.role === "string"
          ? user.publicMetadata.role
          : "",
    },
    {
      label: "Created At",
      key: "createdAt",
      value: user.createdAt
        ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
        : "-",
    },
    {
      label: "Last Sign In",
      key: "lastSignInAt",
      value: user.lastSignInAt
        ? formatDistanceToNow(new Date(user.lastSignInAt), { addSuffix: true })
        : "Never",
    },
  ];

  const handleEdit = (key: string) => {
    // Prevent editing email
    if (key === "emailAddress") return;
    setEditMode((prev) => ({ ...prev, [key]: true }));
    // Get the value as string for the form input
    let value = "";
    if (key === "firstName" || key === "lastName" || key === "username") {
      value = (user[key as "firstName" | "lastName" | "username"] ??
        "") as string;
    } else if (key === "role") {
      value =
        typeof user.publicMetadata?.role === "string"
          ? user.publicMetadata.role
          : "";
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    if (!user) return;
    try {
      if (key === "firstName" || key === "lastName" || key === "username") {
        await user.update({ [key]: formData[key] });
        toast({
          title: "Profile updated",
          description: `${
            fields.find((f) => f.key === key)?.label
          } updated successfully.`,
        });
      } else {
        toast({
          title: "Not editable",
          description: "This field cannot be edited from here.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Update failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
    setEditMode((prev) => ({ ...prev, [key]: false }));
  };

  // Profile image upload/update
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      // Clerk expects a File object for profile image update
      await user.setProfileImage({ file });
      await user.reload();
      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated.",
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Image update failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Password change handlers
  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordUpdate = async () => {
    if (!user) return;

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "Validation Error",
        description: "All password fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await user.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
    } catch (err: unknown) {
      const error = err as {
        errors?: Array<{ message: string; code: string }>;
      };
      let errorMessage = "An error occurred while updating your password.";

      if (error.errors && error.errors.length > 0) {
        const firstError = error.errors[0];
        if (firstError.code === "form_password_incorrect") {
          errorMessage = "Current password is incorrect.";
        } else if (firstError.code === "form_password_pwned") {
          errorMessage =
            "This password has been found in a data breach. Please choose a different password.";
        } else if (firstError.code === "form_password_validation_failed") {
          errorMessage = "Password does not meet security requirements.";
        } else {
          errorMessage = firstError.message;
        }
      }

      toast({
        title: "Password Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Account deletion handlers
  const handleDeleteAccount = async () => {
    if (!user) return;

    // Validate confirmation text
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Confirmation Required",
        description: 'Please type "DELETE" to confirm account deletion.',
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await user.delete();

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Redirect to home page after successful deletion
      router.push("/");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Deletion Failed",
        description:
          error.message || "An error occurred while deleting your account.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmation("");
    }
  };

  const resetDeleteModal = () => {
    setDeleteConfirmation("");
    setShowDeleteModal(false);
  };

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // --- Tabs Layout ---
  return (
    <div className="w-full min-h-screen px-2 py-4 sm:px-6 md:px-12 md:py-8 bg-white">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar TabsList */}
          <TabsList
            className="
                            flex flex-row md:flex-col
                            w-full md:w-56 md:min-w-[180px] h-fit
                            bg-gradient-to-b from-blue-50 to-white
                            border border-blue-200 rounded-2xl shadow-lg
                            p-1 md:p-3 gap-1
                            mb-2 md:mb-0
                        "
          >
            <TabsTrigger
              value="profile"
              className="flex-1 md:w-full justify-start px-2 md:px-4 py-2 rounded-lg text-base font-medium transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="mr-2 inline-block">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 12c2.7 0 8 1.34 8 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="xs:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex-1 md:w-full justify-start px-2 md:px-4 py-2 rounded-lg text-base font-medium transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
            >
              <span className="mr-2 inline-block">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 2l7 4v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V6l7-4z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="xs:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="storage"
              className="flex-1 md:w-full justify-start px-2 md:px-4 py-2 rounded-lg text-base font-medium transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
            >
              <span className="mr-2 inline-block">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="xs:inline">JomNum Drive</span>
            </TabsTrigger>
          </TabsList>
          {/* Main Content */}
          <div className="flex-1 w-full">
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-blue-700 text-xl md:text-2xl">
                      My Profile
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <Image
                        height={400}
                        width={400}
                        src={user.imageUrl || "/default-avatar.png"}
                        alt="Profile"
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-400 shadow"
                      />
                      <Button
                        size="sm"
                        variant="default"
                        className="absolute bottom-0 right-0 rounded-full px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white border-2 border-white shadow transition"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        aria-label="Change profile image"
                      >
                        {imageUploading ? (
                          <span className="flex items-center gap-1">
                            <svg
                              className="animate-spin h-4 w-4 mr-1 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                            Uploading...
                          </span>
                        ) : (
                          "Change"
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={imageUploading}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-5">
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-50/60 border border-blue-100"
                      >
                        <span className="w-full sm:w-40 font-semibold text-blue-800">
                          {field.label}:
                        </span>
                        {editMode[field.key] ? (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                            <Input
                              value={formData[field.key] ?? field.value ?? ""}
                              onChange={(e) =>
                                handleChange(field.key, e.target.value)
                              }
                              className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                            />
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-lg shadow transition"
                              onClick={() => handleSave(field.key)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                            <span className="flex-1 text-gray-800 break-all">
                              {typeof field.value === "string" &&
                              field.value !== ""
                                ? field.value
                                : "-"}
                            </span>
                            {field.key !== "createdAt" &&
                              field.key !== "lastSignInAt" &&
                              field.key !== "role" &&
                              field.key !== "emailAddress" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-600 font-semibold px-4 py-1 rounded-lg transition"
                                  onClick={() => handleEdit(field.key)}
                                >
                                  Edit
                                </Button>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-blue-700 text-xl md:text-2xl">
                      Security Settings
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change Section */}
                  <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "currentPassword",
                                e.target.value
                              )
                            }
                            placeholder="Enter your current password"
                            className="pr-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={passwordLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility("current")}
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "newPassword",
                                e.target.value
                              )
                            }
                            placeholder="Enter your new password"
                            className="pr-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={passwordLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility("new")}
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Password must be at least 8 characters long
                        </p>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            placeholder="Confirm your new password"
                            className="pr-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={passwordLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility("confirm")}
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Update Button */}
                      <div className="pt-2">
                        <Button
                          onClick={handlePasswordUpdate}
                          disabled={
                            passwordLoading ||
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                        >
                          {passwordLoading ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                              Updating Password...
                            </span>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Account Deletion Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Delete Account
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                          <span className="inline-flex">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                          </span>
                          Warning: This action cannot be undone
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>
                            <span aria-hidden="true">•</span> Your account and
                            all associated data will be permanently deleted
                          </li>
                          <li>
                            <span aria-hidden="true">•</span> You will lose
                            access to all your classes and progress
                          </li>
                          <li>
                            <span aria-hidden="true">•</span> This action cannot
                            be reversed
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <Dialog
                          open={showDeleteModal}
                          onOpenChange={setShowDeleteModal}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                            >
                              {isDeleting ? (
                                <span className="flex items-center gap-2">
                                  <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                  </svg>
                                  Deleting Account...
                                </span>
                              ) : (
                                "Delete My Account"
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-red-800 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Delete Account
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                This action cannot be undone. This will
                                permanently delete your account and remove all
                                your data from our servers.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                                  <span className="inline-flex">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      focusable="false"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                      />
                                    </svg>
                                  </span>
                                  Warning: This action cannot be undone
                                </h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                  <li>
                                    <span aria-hidden="true">•</span> Your
                                    account and all associated data will be
                                    permanently deleted
                                  </li>
                                  
                                </ul>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-red-800">
                                  Type DELETE to confirm account deletion
                                </label>
                                <Input
                                  value={deleteConfirmation}
                                  onChange={(e) =>
                                    setDeleteConfirmation(e.target.value)
                                  }
                                  placeholder="Type DELETE here"
                                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                                  disabled={isDeleting}
                                />
                              </div>
                            </div>

                            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                              <Button
                                variant="outline"
                                onClick={resetDeleteModal}
                                disabled={isDeleting}
                                className="mt-2 sm:mt-0"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={
                                  deleteConfirmation !== "DELETE" || isDeleting
                                }
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {isDeleting ? (
                                  <span className="flex items-center gap-2">
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                      />
                                    </svg>
                                    Deleting...
                                  </span>
                                ) : (
                                  "Yes, delete my account"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-blue-700 text-xl md:text-2xl">
                      JomNum Drive
                    </CardTitle>
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">
                      New
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CloudStorage />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
