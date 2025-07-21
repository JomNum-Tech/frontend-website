import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClassList } from "@/components/admin/class/ClassList";
import Link from "next/link";

export default async function AdminClassesPage() {
  const { userId } = await auth();

  // Replace with your admin check logic
  if (!userId /* || !isAdmin(userId) */) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
          Manage Class Terms
        </h1>
        <Link
          href="/admin/classes/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Class
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <ClassList />
      </div>
    </div>
  );
}