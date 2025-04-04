import React, { useState } from 'react';

// Types
type Author = {
  name: string;
  image: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: Author;
  date: string;
  tags: string[];
};

// Mock Data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Building a Modern Blog with Next.js and NestJS',
    slug: 'building-modern-blog',
    content: '# Building a Modern Blog\n\nThis is a sample blog post...',
    excerpt: 'Learn how to build a full-featured blog using Next.js and NestJS with modern development practices.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
    },
    date: '2024-03-20T12:00:00Z',
    tags: ['Next.js', 'NestJS', 'TypeScript']
  },
  {
    id: '2',
    title: 'Advanced SEO Techniques for Your Blog',
    slug: 'advanced-seo-techniques',
    content: '# Advanced SEO Techniques\n\nThis is another sample blog post...',
    excerpt: 'Discover advanced SEO techniques to improve your blog\'s visibility and ranking in search engines.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60'
    },
    date: '2024-03-19T10:00:00Z',
    tags: ['SEO', 'Marketing', 'Content']
  }
];

const BlogSection: React.FC = () => {
  const [activeBlog, setActiveBlog] = useState<Post | null>(null);

  return (
    <div className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/20  opacity-50 blur-3xl -z-10"></div>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 ">
          Latest Insights
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative p-1 rounded-2xl bg-gradient-to-br from-indigo-100 to-rose-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              onMouseEnter={() => setActiveBlog(post)}
              onMouseLeave={() => setActiveBlog(null)}
            >
              <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl relative overflow-hidden">
                <div className="absolute z-10 -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-full  group-hover:opacity-70 transition-all duration-300"></div>
                
                {/* Blog Post Image */}
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Blog Post Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-800 relative z-10 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author and Tags */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.author.image} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">
                      {post.author.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-gradient-to-br from-indigo-100 to-rose-100 px-2 py-1 rounded-full text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;