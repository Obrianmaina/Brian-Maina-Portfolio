"use client";

import React, { useEffect, useState } from "react";
// Using standard img and a tags to resolve resolution errors in the preview environment
// while maintaining the Next.js project structure
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types";
import Button from "@/components/ui/button";
import { X, Info, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevron icons if not already in ui/button
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";

export default function BlogLandingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans">Loading articles...</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative font-sans">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No articles published yet</h2>
        <p className="text-gray-600">Check back soon for new content!</p>
      </div>
    );
  }

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1, 13); // Up to 12 per page

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
      <main className="min-h-screen bg-gray-50 py-12 px-6 text-gray-900 font-sans">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Insights</h1>
        </div>
        {/* New Subtitle Line */}
        <p className="text-center text-gray-600 italic mb-8 -mt-6">
          Unapologetically random.
        </p>
        
       
        {/* Featured Blog */}
        {featuredBlog && (
          <a href={`/blog/${featuredBlog.slug}`} className="block">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              
              <Card className="relative overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer p-0 border-none shadow-md">
                  
                {/* Corner decorator */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 bg-teal-500 pointer-events-none z-30"
                />
                  
                <div className="flex flex-col md:flex-row">
                  
                  <div className="md:w-2/3 h-64 md:h-72 relative bg-gray-200 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                  
                    {featuredBlog.featuredImage ? (
                      <img 
                        src={featuredBlog.featuredImage} 
                        alt={featuredBlog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-20" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 relative z-20">No Image</div>
                    )}
                  </div>
                  
                  <div className="md:w-1/3 p-8 flex flex-col justify-center bg-white relative z-20">
                    <span className="text-teal-600 font-bold uppercase tracking-wider text-xs mb-2">Featured Post</span>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-teal-700 transition-colors">{featuredBlog.title}</h2>
                    <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                      {featuredBlog.description || (featuredBlog.content.substring(0, 150) + "...")}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-auto">
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
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
                  
                  <Card className="relative h-full overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer flex flex-col p-0 bg-white border-none shadow-sm">
                    
                    {/* Dynamic Corner decorator right here */}
                    <div className={`absolute bottom-0 right-0 w-24 h-24 -mr-12 -mb-12 rounded-full opacity-20 z-10 transition-transform duration-500 group-hover:scale-150 ${decoratorColors[idx % decoratorColors.length]}`} />
                    
                    <div className="h-48 relative rounded-lg bg-gray-200 w-full shrink-0 overflow-hidden">
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">No Image</div>
                      )}
                    </div>
                    
                    <CardContent className="relative z-20 p-6 flex-grow flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {blog.description || (blog.content.substring(0, 120) + "...")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-teal-600 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          Read More
                        </span>
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

    <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
       <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          {/* <a href="https://twitter.com/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-transform transform hover:scale-110" aria-label="X (formerly Twitter)"><SiX size={20} /></a> */}
          {/* <a href="https://instagram.com/brianmaina_design" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-transform transform hover:scale-110" aria-label="Instagram"><SiInstagram size={20} /></a> */}
          <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:request@brianmaina.de")}>Contact Me</Button>
    </footer>
  </>
  );
}