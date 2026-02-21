"use client";

import React, { useEffect, useState, use } from "react";
// Note: Standard img and a tags used for preview compatibility
// next/navigation removed to fix preview build environment errors
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, Loader2, Linkedin, Github } from "lucide-react";
import { BlogPost, BlogComment } from "@/types";
import Button from "@/components/ui/button";
import { X, Info, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevron icons if not already in ui/button
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";
export default function SingleBlogPage({ params }: { params?: Promise<{ slug?: string }> }) {
  // Unwrap the params Promise using React.use() as required by Next.js
  const resolvedParams = params ? use(params) : null;
  const slug = resolvedParams?.slug || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helper function to resolve relative URLs safely in preview/blob environments
  const getApiUrl = (path: string) => {
    if (typeof window !== "undefined") {
      if (window.location.protocol === "blob:" || window.location.origin === "null") {
        return `http://localhost:3000${path}`;
      }
      return path; // Standard relative path for normal browser environment
    }
    return `http://localhost:3000${path}`;
  };

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        const blogRes = await fetch(getApiUrl(`/api/blogs?slug=${slug}`));
        const blogData = await blogRes.json();
        const currentBlog = Array.isArray(blogData) 
          ? blogData.find((b: BlogPost) => b.slug === slug) 
          : blogData;
        setBlog(currentBlog);

        const commentsRes = await fetch(getApiUrl(`/api/comments?postSlug=${slug}`));
        const commentsData = await commentsRes.json();
        if (Array.isArray(commentsData)) {
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Error loading post data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl("/api/comments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug: slug, text: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        const refreshRes = await fetch(getApiUrl(`/api/comments?postSlug=${slug}`));
        const refreshedData = await refreshRes.json();
        setComments(refreshedData);
      }
    } catch (err) {
      console.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
        <a href="/blog" className="text-teal-600 font-medium flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Return to Blog
        </a>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white pb-24 font-sans">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          <a 
            href="/blog" 
            className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-10 transition-colors font-medium group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Articles
          </a>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            <p className="text-lg text-gray-500 italic border-l-4 border-teal-500 pl-4 py-1">
              {blog.description}
            </p>
          </header>

          {blog.featuredImage && (
            <figure className="mb-12">
              <div className="w-full h-64 md:h-[480px] relative rounded-[1rem] overflow-hidden border border-gray-100">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {blog.photoCredit && (
                <figcaption className="text-sm text-gray-400 mt-4 text-center">
                  Photo Credit: <span className="italic">{blog.photoCredit}</span>
                </figcaption>
              )}
            </figure>
          )}

          {/* Cleaned up wrapper and using the powerful components prop below */}
          <article className="text-gray-800 mb-20 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl font-extrabold mt-12 mb-6 text-gray-900 leading-tight" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 leading-tight" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 leading-snug" {...props} />,
                p:  ({ node, ...props }) => <p className="mb-6 text-lg text-gray-700" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                a:  ({ node, ...props }) => <a className="text-teal-600 underline decoration-teal-300 underline-offset-4 hover:text-teal-700 hover:decoration-teal-500 transition-colors font-medium" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-8 italic text-gray-600 bg-gray-50 rounded-r-xl" {...props} />,
                code: ({ node, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { node?: unknown }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  return isInline ? (
                    <code className="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-md">
                      <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                img: ({ node, ...props }) => <img className="rounded-2xl shadow-md my-10 w-full object-cover border border-gray-100" {...props} />,
                hr:  ({ node, ...props }) => <hr className="my-12 border-gray-200" {...props} />,
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </article>

          {/* THE COMMENT THREAD UI */}
          <section className="border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <div className="bg-teal-50 p-2 rounded-lg mr-4">
                  <MessageSquare className="text-teal-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Comments <span className="text-teal-600 font-normal ml-1">({comments.length})</span>
                </h2>
              </div>
            </div>

            <form onSubmit={handlePostComment} className="mb-12">
              <div className="bg-white rounded-2xl p-1 border-2 border-gray-100 focus-within:border-teal-500 transition-all shadow-sm">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What's on your mind? Thoughts are shared anonymously..."
                  className="w-full bg-transparent border-none outline-none text-gray-700 p-4 resize-none h-28"
                  required
                />
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl m-1">
                  <p className="text-[12px] sentencecase tracking-wider  text-gray-400 pl-2">
                    Random Animal Identity Assigned on Post
                  </p>
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center hover:bg-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-100"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-8">
              <AnimatePresence initial={false}>
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 italic">No comments yet. Start the conversation!</p>
                  </div>
                ) : (
                  comments.map((comment, idx) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {comment.animalIcon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">
                            Anonymous {comment.animalIdentity}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gray-300">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="bg-gray-50/80 p-5 rounded-2xl rounded-tl-none border border-gray-100 text-gray-700 leading-relaxed">
                          {comment.text}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER COMPONENT */}
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
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:brianmaina.nyawira@gmail.com")}>Contact Me</Button>
    </footer>
    </>
  );
}