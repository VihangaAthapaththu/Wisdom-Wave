import React from 'react';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import '../styles/blogStudent.css';

function BlogStudent() {
  const blogs = [
    {
      id: 1,
      title: 'Getting Started with React',
      author: 'John Smith',
      date: '2026-01-15',
      excerpt: 'Learn the React fundamentals and build your first interactive UI with confidence.',
      category: 'Tutorial',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'JavaScript Best Practices',
      author: 'Jane Doe',
      date: '2026-01-18',
      excerpt: 'Master clean code patterns, performance tips, and maintainable JS architecture.',
      category: 'Best Practices',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Web Design Trends 2026',
      author: 'Mike Johnson',
      date: '2026-01-20',
      excerpt: 'Explore the newest layout, typography, and UX patterns shaping modern web apps.',
      category: 'Design',
      readTime: '4 min read'
    },
    {
      id: 4,
      title: 'UI Components that Scale',
      author: 'Sarah Wilson',
      date: '2026-01-24',
      excerpt: 'Design reusable components and build design systems that evolve gracefully.',
      category: 'UI/UX',
      readTime: '7 min read'
    }
  ];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <h1 className="blog-title">Client Blog</h1>
          <p className="blog-subtitle">Beautiful reads curated for your learning journey</p>
        </div>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="blog-card">
              <div className="blog-card-header">
                <span className="blog-category">
                  <BookOpen size={16} />
                  {blog.category}
                </span>
                <span className="blog-readtime">{blog.readTime}</span>
              </div>

              <div className="blog-card-body">
                <h2 className="blog-card-title">{blog.title}</h2>
                <p className="blog-card-excerpt">{blog.excerpt}</p>
                <div className="blog-meta">
                  <span><User size={14} />{blog.author}</span>
                  <span><Calendar size={14} />{blog.date}</span>
                </div>
              </div>

              <div className="blog-card-footer">
                <button className="blog-readmore">
                  Read more
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogStudent;
