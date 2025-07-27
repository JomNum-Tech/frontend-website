"use client";

import { Suspense } from "react";
import ProfileContent from "@/components/profile/ProfileContent";

function ProfileFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px] text-blue-600 font-semibold">
      Loading profile...
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileContent />
    </Suspense>
  );
}