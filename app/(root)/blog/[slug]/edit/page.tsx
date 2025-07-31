import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { EditPostForm } from '@/components/blog/EditPostForm';

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/login');
  }

  const { slug } = await params;

  return <EditPostForm slug={slug} />;
}