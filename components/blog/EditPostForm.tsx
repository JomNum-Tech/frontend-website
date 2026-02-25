"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";

interface EditPostFormProps {
  slug: string;
}

export function EditPostForm({ slug }: EditPostFormProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}/edit`);
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        
        if (response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You can only edit your own posts",
            variant: "destructive",
          });
          router.push(`/blog/${slug}`);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const postData = await response.json();
        setPost(postData);
        
        // Populate form fields
        setTitle(postData.title);
        setContent(postData.content);
        setExcerpt(postData.excerpt || "");
        setPublished(postData.published);
        setCategory(postData.category || "");
        setTags(postData.tags ? postData.tags.join(", ") : "");
        setFeaturedImage(postData.featured_image || "");
        
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post for editing",
          variant: "destructive",
        });
        router.push(`/blog/${slug}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Parse tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`/api/blog/posts/${slug}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          category: category || undefined,
          tags: tagArray.length > 0 ? tagArray : undefined,
          featured_image: featuredImage.trim() || undefined,
          published,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        toast({
          title: "Success",
          description: `Blog post updated successfully`,
        });
        router.push(`/blog/${updatedPost.slug}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading post...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto px-12 py-8">
      <Card className="mx-auto shadow-lg border-blue-200 border-2 bg-white">
        <CardHeader className="bg-blue-100 rounded-t-lg px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/blog/${slug}`)}
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium hover:cursor-pointer">Back to Post</span>
            </Button>
            <CardTitle className="text-blue-700 text-2xl font-bold ml-2">
              Edit Blog Post
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-700 font-semibold">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog post title..."
                required
                className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              <p className="text-xs text-gray-500 italic">Make your title clear and catchy!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-blue-700 font-semibold">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                  <option value="programming">Programming</option>
                  <option value="web-development">Web Development</option>
                  <option value="career">Career</option>
                  <option value="tutorials">Tutorials</option>
                </select>
                <p className="text-xs text-gray-500 italic">Choose the best fit for your post.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-blue-700 font-semibold">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, javascript, tutorial"
                  className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                />
                <p className="text-xs text-gray-500 italic">Add tags to help others find your post.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage" className="text-blue-700 font-semibold">
                Featured Image URL <span className="text-blue-400">(JomNum Drive)</span>
              </Label>
              <Input
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              <p className="text-xs text-gray-500 italic">Add a visual to make your post stand out!</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-blue-700 font-semibold">
                Excerpt <span className="text-blue-400">(Optional)</span>
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your post..."
                rows={3}
                className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              <p className="text-xs text-gray-500 italic">A short summary for readers.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-blue-700 font-semibold">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here..."
                rows={10}
                required
                className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              <p className="text-xs text-gray-500 italic">Tip: Use paragraphs and headings for clarity.</p>
            </div>

            <div className="flex items-center space-x-2 bg-blue-50 rounded-md px-3 py-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(checked) => setPublished(checked as boolean)}
                className="border-blue-400 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="published" className="text-blue-700 font-medium">
                Publish post <span className="text-blue-400">(uncheck to save as draft)</span>
              </Label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/blog/${slug}`)}
                disabled={saving}
                className="border-blue-400 text-blue-600 hover:bg-blue-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}