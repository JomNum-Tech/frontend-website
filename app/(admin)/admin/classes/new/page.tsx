import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateClassForm } from "@/components/admin/class/CreateClassForm";

export default async function CreateClassPage() {
  const { userId } = await auth();

  if (!userId /* || !isAdmin(userId) */) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Class Term</h1>
      <CreateClassForm />
    </div>
  );
}