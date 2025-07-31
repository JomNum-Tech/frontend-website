"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

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

    setLoading(true);

    try {
      // Calculate reading time
      const wordsPerMinute = 200;
      const words = content.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / wordsPerMinute);

      // Parse tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch("/api/blog/posts", {
        method: "POST",
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
          reading_time: readingTime,
          published,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        toast({
          title: "Success",
          description: `Blog post ${
            published ? "published" : "saved as draft"
          } successfully`,
        });
        router.push(`/blog/${post.slug}`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50 rounded-t-md border-b border-blue-100 px-12 py-8">
        <CardTitle className="text-3xl font-extrabold text-blue-700">Create New Blog Post</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-blue-700 font-semibold">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title..."
              required
              className="border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-blue-700 font-semibold">Category <span className="text-red-500">*</span></Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
                <option value="career">Career</option>
                <option value="tutorials">Tutorials</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-blue-700 font-semibold">Tags <span className="text-blue-400">(comma-separated)</span></Label>
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
            <Label htmlFor="featuredImage" className="text-blue-700 font-semibold">Featured Image URL <span className="text-blue-400">(Optional)</span></Label>
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
            <Label htmlFor="excerpt" className="text-blue-700 font-semibold">Excerpt <span className="text-blue-400">(Optional)</span></Label>
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
              Publish immediately <span className="text-blue-400">(uncheck to save as draft)</span>
            </Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="border-blue-400 text-blue-600 hover:bg-blue-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {published ? "Publish Post" : "Save Draft"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
