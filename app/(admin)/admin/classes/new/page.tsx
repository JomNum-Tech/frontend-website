import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateClassForm } from "@/components/admin/class/CreateClassForm";

export default async function CreateClassPage() {
  const { userId } = await auth();

  if (!userId /* || !isAdmin(userId) */) {
    redirect("/");
  }

  return (
    <div className="mx-auto py-8 px-12 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-6 text-left text-gray-800">
        Create New Class Term
      </h1>
    
      <CreateClassForm />
    </div>
  );
}