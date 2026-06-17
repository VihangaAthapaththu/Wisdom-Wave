import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Eye, Calendar, User, Pencil } from "lucide-react";
import { Button, PageLoader, Card } from "@/components/atoms";
import { ArticleCard } from "@/components/molecules";
import { useBlogBySlug } from "@/hooks";
import { useAuth } from "@/context";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError } = useBlogBySlug(slug);

  const blog = data?.data?.blog || null;
  const relatedBlogs = data?.data?.relatedBlogs || [];
  const isAuthor = user && blog && user._id === blog.author?._id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PageLoader />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Blog post not found.</p>
        <Button variant="outline" onClick={() => navigate("/blog")}>
          <ArrowLeft size={16} /> Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Hero */}
      {blog.featuredImageUrl ? (
        <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img
            src={blog.featuredImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 sm:h-52 bg-gradient-to-br from-primary/20 to-primary-600/10" />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button + owner edit */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/blog")}
            className="text-gray-500 hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Button>
          {isAuthor && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/blog/${blog._id}/edit`)}
            >
              <Pencil size={14} /> Edit Post
            </Button>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.category && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary uppercase tracking-wide">
              {blog.category.name}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
          {blog.title}
        </h1>

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8 pb-6 border-b border-border">
          <span className="inline-flex items-center gap-1.5">
            <User size={14} />
            {blog.author?.name || "Unknown"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(blog.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {blog.readTime || 1} min read
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye size={14} />
            {blog.viewCount || 0} views
          </span>
        </div>

        {/* Blog content */}
        <div
          className="prose prose-gray prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-a:text-primary prose-blockquote:border-primary prose-code:bg-surface prose-code:px-1 prose-code:rounded prose-img:rounded-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
        />

        {/* Related posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedBlogs.map((related) => (
                <ArticleCard
                  key={related._id}
                  blog={{
                    id: related._id,
                    title: related.title,
                    author: related.author?.name || "",
                    date: formatDate(related.publishedAt),
                    excerpt: related.excerpt || related.title,
                    category: related.category?.name || "",
                    readTime: `${related.readTime || 1} min read`,
                  }}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
