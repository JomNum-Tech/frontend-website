"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserResource } from "@clerk/types";

import Image from "next/image";

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    // Use string values for formData to avoid type issues with Input
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

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
        { label: "Email", key: "emailAddress", value: user.primaryEmailAddress?.emailAddress ?? "" },
        { label: "Role", key: "role", value: typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "" },
        { label: "Created At", key: "createdAt", value: user.createdAt ? new Date(user.createdAt).toLocaleString() : "-" },
        { label: "Last Sign In", key: "lastSignInAt", value: user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never" },
    ];

    const handleEdit = (key: string) => {
        // Prevent editing email
        if (key === "emailAddress") return;
        setEditMode((prev) => ({ ...prev, [key]: true }));
        // Get the value as string for the form input
        let value = "";
        if (key === "firstName" || key === "lastName") {
            value = (user[key as "firstName" | "lastName"] ?? "") as string;
        } else if (key === "role") {
            value = typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "";
        }
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key: string) => {
        if (!user) return;
        try {
            if (key === "firstName" || key === "lastName") {
                await user.update({ [key]: formData[key] });
                toast({
                    title: "Profile updated",
                    description: `${fields.find((f) => f.key === key)?.label} updated successfully.`,
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

    return (
        <div className="max-w-xl mx-auto p-6 my-12 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex items-center justify-center mb-8">
                <h1 className="text-3xl font-bold text-blue-700 text-center tracking-tight mr-3">
                    My Profile
                </h1>
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">
                    Beta
                </span>
            </div>
            <div className="flex flex-col items-center mb-10">
                <div className="relative">
                    <Image
                        height={400}
                        width={400}
                        src={user.imageUrl || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
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
                                <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
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
            <div className="flex flex-col gap-5">
                {fields.map((field) => (
                    <div
                        key={field.key}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-50/60 border border-blue-100"
                    >
                        <span className="w-40 font-semibold text-blue-800">{field.label}:</span>
                        {/* Only allow editing for firstName and lastName */}
                        {editMode[field.key] ? (
                            <>
                                <Input
                                    value={formData[field.key] ?? field.value ?? ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                />
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded-lg shadow transition"
                                    onClick={() => handleSave(field.key)}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 text-gray-800">
                                    {typeof field.value === "string" && field.value !== "" ? field.value : "-"}
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
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}