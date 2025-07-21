import { EditClassForm } from "@/components/admin/class/EditClassForm";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { notFound, redirect } from "next/navigation";

const sql = neon(process.env.NEON_DATABASE_URL!);

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();

  // Verify admin role
  if (!userId /* || !isAdmin(userId) */) {
    redirect("/");
  }

  const { slug } = await params;

  const classData = await sql`
    SELECT * FROM class_terms
    WHERE slug = ${slug}
  `;

  if (!classData || classData.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-12 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Edit Class: <span className="ml-2 text-blue-600">{classData[0].title}</span>
      </h1>
      <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
        <EditClassForm initialData={classData[0]} />
      </div>
    </div>
  );
}