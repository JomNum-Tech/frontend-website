import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BlogService } from '@/lib/services/blogService';
import { initializeDatabase } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

async function getUserPosts(userId: string) {
  try {
    await initializeDatabase();
    return await BlogService.getPostsByAuthor(userId, true); // Include unpublished
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

export default async function MyPostsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/login');
  }

  const posts = await getUserPosts(userId);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700">My Blog Posts</h1>
          <p className="text-gray-500 mt-2">
            Manage your published posts and drafts
          </p>
        </div>
        
        <Link href="/blog/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            Write New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="text-center py-16">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              No blog posts yet
            </h3>
            <p className="text-base text-blue-500 mb-6">
              Start sharing your thoughts and ideas with the community
            </p>
            <Link href="/blog/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`border-2 ${
                post.published
                  ? "border-blue-400"
                  : "border-blue-200"
              } shadow-sm transition-all`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-2xl font-bold text-blue-900">{post.title}</CardTitle>
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.published
                            ? "bg-blue-600 text-white"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-400"
                        }`}
                        variant="outline"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      {post.updated_at !== post.created_at && (
                        <> • Updated {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}</>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-400 text-blue-700 hover:bg-blue-100"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/blog/${post.slug}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-400 text-blue-700 hover:bg-blue-100"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              
              {post.excerpt && (
                <CardContent>
                  <p className="text-gray-500">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}