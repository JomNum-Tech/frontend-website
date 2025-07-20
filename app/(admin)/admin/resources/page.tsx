import { AddResourceForm } from "@/components/admin/resource/AddResourceForm";
import { ResourcesList } from "@/components/admin/resource/ResourcesList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ResourcesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="px-12 py-8">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white/80 rounded-xl shadow p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <span className="inline-block align-middle">
            <svg
              className="w-14 h-14 text-blue-600 bg-blue-50 rounded-lg p-2 shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
              <path d="M7 3v4M17 3v4" strokeWidth="2" />
            </svg>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Manage Resources
          </h1>
        </div>
        <span className="text-base text-gray-600 mt-4 sm:mt-0 sm:text-right">
          Easily add and view your Google Slides resources by class.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <AddResourceForm />
        </div>
        <div>
          <ResourcesList />
        </div>
      </div>
    </div>
  );
}