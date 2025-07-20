"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserResource } from "@clerk/types";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

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
        { label: "Username", key: "username", value: user.username ?? "" },
        { label: "Email", key: "emailAddress", value: user.primaryEmailAddress?.emailAddress ?? "" },
        { label: "Role", key: "role", value: typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "" },
        { label: "Created At", key: "createdAt", value: user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "-" },
        { label: "Last Sign In", key: "lastSignInAt", value: user.lastSignInAt ? formatDistanceToNow(new Date(user.lastSignInAt), { addSuffix: true }) : "Never" },
    ];

    const handleEdit = (key: string) => {
        // Prevent editing email
        if (key === "emailAddress") return;
        setEditMode((prev) => ({ ...prev, [key]: true }));
        // Get the value as string for the form input
        let value = "";
        if (key === "firstName" || key === "lastName" || key === "username") {
            value = (user[key as "firstName" | "lastName" | "username"] ?? "") as string;
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
            if (key === "firstName" || key === "lastName" || key === "username") {
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

    // --- Tabs Layout ---
    return (
        <div className="w-full min-h-screen px-2 py-4 sm:px-6 md:px-12 md:py-8 bg-white">
            <Tabs defaultValue="profile" className="w-full">
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
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="currentColor" /></svg>
                            </span>
                            <span className="xs:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex-1 md:w-full justify-start px-2 md:px-4 py-2 rounded-lg text-base font-medium transition-colors data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
                        >
                            <span className="mr-2 inline-block">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2l7 4v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V6l7-4z" fill="currentColor" /></svg>
                            </span>
                            <span className="xs:inline">Security</span>
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">Soon</span>
                        </TabsTrigger>
                    </TabsList>
                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-blue-700 text-xl md:text-2xl">My Profile</CardTitle>
                                        {/* <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">Beta</span> */}
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
                                    <div className="flex flex-col gap-4 md:gap-5">
                                        {fields.map((field) => (
                                            <div
                                                key={field.key}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-50/60 border border-blue-100"
                                            >
                                                <span className="w-full sm:w-40 font-semibold text-blue-800">{field.label}:</span>
                                                {editMode[field.key] ? (
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
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
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                                                        <span className="flex-1 text-gray-800 break-all">
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
                                        <CardTitle className="text-blue-700 text-xl md:text-2xl">Security</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center py-8 md:py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7a4 4 0 10-8 0v4a4 4 0 008 0zm0 0v2m0 4h.01M17 16v-1a4 4 0 00-3-3.87M17 16a4 4 0 01-3 3.87M17 16h.01" />
                                            </svg>
                                        </span>
                                        <div className="text-lg font-semibold text-gray-800 text-center">
                                            Security features coming soon
                                        </div>
                                        <div className="text-gray-500 text-center max-w-xs">
                                            We are working on adding security settings and password management. Stay tuned for updates to help keep your account safe.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-gray-600">Personalization and notification settings coming soon.</div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}