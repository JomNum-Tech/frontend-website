import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CreatePostForm } from '@/components/blog/CreatePostForm';

export default async function CreatePostPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatePostForm />
    </div>
  );
}