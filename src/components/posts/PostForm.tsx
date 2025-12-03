"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Save, Send, ArrowLeft } from "lucide-react";
import type { PostWithDetails, CreatePostInput } from "@/types";

interface PostFormProps {
  post?: PostWithDetails;
  categories?: { id: string; name: string }[];
}

export function PostForm({ post, categories = [] }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreatePostInput>({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    featuredImage: post?.featuredImage || "",
    published: post?.published || false,
    categoryIds: post?.categories.map((c) => c.id) || [],
  });

  const handleSubmit = async (e: React.FormEvent, shouldPublish?: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        ...formData,
        published: shouldPublish ?? formData.published,
      };

      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save post");
      }

      const result = await response.json();

      toast({
        title: post ? "Post updated" : "Post created",
        description: shouldPublish
          ? "Your post is now live!"
          : "Your draft has been saved.",
        variant: "success",
      });

      router.push(`/posts/${result.data.slug}`);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Send className="w-4 h-4" />
            {post?.published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Featured Image
        </label>
        <ImageUpload
          value={formData.featuredImage || ""}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, featuredImage: url }))
          }
        />
      </div>

      {/* Title */}
      <div>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Your post title..."
          className="text-3xl font-bold border-0 border-b-2 border-slate-200 rounded-none px-0 py-4 focus:ring-0 focus:border-indigo-500 placeholder:text-slate-300"
          required
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          placeholder="A brief description of your post (shown in previews)..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Categories
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.categoryIds?.includes(category.id)}
                  onChange={(e) => {
                    const ids = formData.categoryIds || [];
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: e.target.checked
                        ? [...ids, category.id]
                        : ids.filter((id) => id !== category.id),
                    }));
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Content
        </label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, content }))
          }
          placeholder="Write your story..."
        />
      </div>
    </form>
  );
}

