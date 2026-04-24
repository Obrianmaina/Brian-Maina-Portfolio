"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types";

export default function BlogLandingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Sorting and Filtering
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  const [selectedTopic, setSelectedTopic] = useState('All');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
           throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();
        
        // Filter to only show articles where isPublished is true
        const publishedOnly = data.filter((blog: BlogPost) => blog.isPublished === true);
        
        setBlogs(publishedOnly);
      } catch (error) {
        console.error("Failed to load blogs", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Extract unique topics for the filter dropdown
  const topics = useMemo(() => {
    const allTopics = blogs.map(b => b.topic).filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(allTopics))];
  }, [blogs]);

  // Apply filters and sorting
  const displayedBlogs = useMemo(() => {
    let filtered = [...blogs];

    if (selectedTopic !== 'All') {
      filtered = filtered.filter(blog => blog.topic === selectedTopic);
    }

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [blogs, sortOrder, selectedTopic]);


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">Loading articles...</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 relative font-sans transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">No articles published yet</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Check back soon for new content!</p>
      </div>
    );
  }

  const featuredBlog = displayedBlogs[0];
  const gridBlogs = displayedBlogs.slice(1, 13); // Up to 12 per page

  // Array of colors to cycle through for the card decorators
  const decoratorColors = [
    "bg-teal-500",
    "bg-blue-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-indigo-500"
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 transition-colors">Insights</h1>
        </div>
        {/* Subtitle Line */}
        <p className="text-center text-gray-600 dark:text-gray-400 italic mb-8 -mt-6 transition-colors">
          Unapologetically random.
        </p>
        
        {/* Sorting & Filtering Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-end">
          <select 
            value={selectedTopic} 
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors shadow-sm cursor-pointer"
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic === 'All' ? 'All Topics' : topic}</option>
            ))}
          </select>

          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
       
        {/* Featured Blog */}
        {featuredBlog && (
          <a href={`/blog/${featuredBlog.slug}`} className="block">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              
              <Card className="relative overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow cursor-pointer p-0 border border-transparent dark:border-gray-800 shadow-md">
                  
                {/* Corner decorator for featured blog */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 bg-teal-500 pointer-events-none z-30"
                />
                  
                <div className="flex flex-col md:flex-row">
                  
                  <div className="md:w-2/3 h-64 md:h-72 relative bg-gray-200 dark:bg-gray-800 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden transition-colors">
                  
                    {featuredBlog.featuredImage ? (
                      <img 
                        src={featuredBlog.featuredImage} 
                        alt={featuredBlog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-20" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 relative z-20 transition-colors">No Image</div>
                    )}
                  </div>
                  
                  <div className="md:w-1/3 p-8 flex flex-col justify-center bg-white dark:bg-gray-900 relative z-20 transition-colors">
                    
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-xs transition-colors">
                        Featured Post
                      </span>
                      {featuredBlog.topic && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded text-xs font-semibold">
                          {featuredBlog.topic}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-50 leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{featuredBlog.title}</h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 leading-relaxed transition-colors">
                      {featuredBlog.description || (featuredBlog.content.substring(0, 150) + "...")}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto transition-colors">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {featuredBlog.author || "Brian Maina"}
                      </span>
                      <span>
                        {featuredBlog.createdAt 
                          ? new Date(featuredBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                          : 'Recently'}
                      </span>
                    </div>

                    {/* Featured Tags */}
                    {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {featuredBlog.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                  
                </div>
              </Card>
            </motion.div>
          </a>
        )}

        {/* 3x4 Grid */}
        {gridBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridBlogs.map((blog, idx) => (
              <a key={blog.slug || idx} href={`/blog/${blog.slug}`} className="block h-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="h-full">
                  
                  <Card className="relative h-full overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow cursor-pointer flex flex-col p-0 bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 shadow-sm">
                    
                    {/* Dynamic Corner decorator: 
                      Placed at bottom-0 and left-0, pulled out slightly with negative margins.
                      z-30 puts it OVER the image and text layer.
                      pointer-events-none ensures it does not block cursor clicks.
                    */}
                    <div className={`absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full opacity-30 z-30 pointer-events-none transition-transform duration-500 group-hover:scale-150 ${decoratorColors[idx % decoratorColors.length]}`} />
                    
                    <div className="h-48 relative rounded-t-lg bg-gray-200 dark:bg-gray-800 w-full shrink-0 overflow-hidden transition-colors">
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">No Image</div>
                      )}
                      
                      {/* Topic Badge overlaid on image */}
                      {blog.topic && (
                        <div className="absolute top-3 left-3 z-20">
                          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                            {blog.topic}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="relative z-20 p-6 flex-grow flex flex-col justify-between h-full bg-white dark:bg-gray-900 transition-colors">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed transition-colors">
                          {blog.description || (blog.content.substring(0, 120) + "...")}
                        </p>
                      </div>
                      <div className="flex flex-col mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium z-40">
                            {blog.author || "Brian Maina"}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors z-40">
                            {blog.createdAt 
                              ? new Date(blog.createdAt).toLocaleDateString() 
                              : 'New'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between z-40 relative">
                          <div className="flex gap-1.5 overflow-hidden">
                            {blog.tags && blog.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all ml-2 whitespace-nowrap">
                            Read More
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  </>
  );
}