import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenLine, FilterX, NotebookPen, X } from "lucide-react";
import { ArticleCard } from "@/components/molecules";
import { Button, PageLoader } from "@/components/atoms";
import { usePublicBlogFeed, useCategories } from "@/hooks";
import { useAuth } from "@/context";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
      </div>
      <div className="px-5 pb-5">
        <div className="h-9 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, user, onClearFilters, onWrite, search, category }) {
  const isFiltered = hasFilters;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      {/* Icon ring */}
      <div className="w-20 h-20 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-6">
        {isFiltered ? (
          <FilterX size={30} className="text-gray-400" />
        ) : (
          <NotebookPen size={30} className="text-gray-400" />
        )}
      </div>

      {/* Heading */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {isFiltered
          ? "No posts match your filters"
          : user
          ? "No blogs yet — be the first"
          : "No blogs published yet"}
      </h3>

      {/* Subtext */}
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
        {isFiltered
          ? "Try a different category or search term — there are plenty of posts to discover."
          : user
          ? "Share a tutorial, a project story, or something you've learned. It only takes a few minutes."
          : "This is where student stories, tutorials, and ideas will live. Check back soon."}
      </p>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-primary hover:text-primary bg-white transition-colors"
          >
            <X size={13} />
            Clear filters
          </button>
        )}

        {user && (
          <Button
            onClick={onWrite}
            className="cursor-pointer bg-gradient-to-br from-primary to-primary-600 text-white"
          >
            <PenLine size={15} />
            {isFiltered ? "Write a new post" : "Write your first blog"}
          </Button>
        )}
      </div>

      {/* Active filter hint */}
      {isFiltered && (search || category) && (
        <p className="text-xs text-gray-300 mt-5">
          {[category && `Category: "${category}"`, search && `Search: "${search}"`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

export function BlogStudent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: feedData,
    isLoading,
    isError,
  } = usePublicBlogFeed({
    page,
    category: selectedCategory,
    search: debouncedSearch,
  });

  const { data: categories = [] } = useCategories();

  const blogs = feedData?.data?.blogs || [];
  const totalPages = feedData?.data?.totalPages || 1;

  function toBlogCardProps(blog) {
    return {
      id: blog._id,
      title: blog.title,
      author: blog.author?.name || "Unknown",
      date: formatDate(blog.publishedAt),
      excerpt: blog.excerpt || blog.title,
      category: blog.category?.name || "General",
      readTime: `${blog.readTime || 1} min read`,
    };
  }

  function handleClearFilters() {
    setSelectedCategory("");
    setSearchInput("");
    setPage(1);
  }

  // Resolve the readable category name for the filter hint
  const selectedCategoryName =
    categories.find((c) => c._id === selectedCategory)?.name || "";

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Our <span className="text-primary">Blog</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-600 mx-auto rounded-full mb-5" />
          <p className="text-gray-500 text-base">
            Beautiful reads curated for your learning journey
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-5 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search blogs…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 h-11 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === ""
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-border hover:border-primary hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedCategory === cat._id
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {user && (
            <Button
              onClick={() => navigate("/blog/new")}
              className="ml-8 cursor-pointer bg-gradient-to-br from-primary to-primary-600 text-white"
            >
              <PenLine size={15} />
              Write a Blog
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Failed to load blog posts.</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            hasFilters={!!(debouncedSearch || selectedCategory)}
            user={user}
            onClearFilters={handleClearFilters}
            onWrite={() => navigate("/blog/new")}
            search={debouncedSearch}
            category={selectedCategoryName}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <ArticleCard
                  key={blog._id}
                  blog={toBlogCardProps(blog)}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}