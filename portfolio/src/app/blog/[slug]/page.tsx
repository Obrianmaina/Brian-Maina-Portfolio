"use client";

import React, { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, Loader2, Share2, Mail, X } from "lucide-react";
import { BlogPost } from "@/types";
import Button from "@/components/ui/button";
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";
import BlogSubscribe from "@/components/BlogSubscribe";

// Updated local interface to include adminReply
interface BlogComment {
  _id: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  createdAt: string;
  adminReply?: string | null; // Added this field
}

export default function SingleBlogPage({ params }: { params?: Promise<{ slug?: string }> }) {
  const resolvedParams = params ? use(params) : null;
  const slug = resolvedParams?.slug || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasDismissedToast, setHasDismissedToast] = useState(false);
  const articleEndRef = useRef<HTMLDivElement>(null);

  const getApiUrl = (path: string) => {
    if (typeof window !== "undefined") {
      if (window.location.protocol === "blob:" || window.location.origin === "null") {
        return `http://localhost:3000${path}`;
      }
      return path;
    }
    return `http://localhost:3000${path}`;
  };


  useEffect(() => {
      if (slug) {
        fetch('/api/analytics', {
          method: 'POST',
          body: JSON.stringify({ target: slug, type: 'page_view' }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }, [slug]);

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

  useEffect(() => {
    if (loading || !blog) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDismissedToast) {
          setShowToast(true);
        }
      },
      { threshold: 0.1 }
    );

    if (articleEndRef.current) {
      observer.observe(articleEndRef.current);
    }

    return () => observer.disconnect();
  }, [loading, blog, hasDismissedToast]);

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

  const handleShare = async () => {
    if (!blog) return;
    
    const shareData = {
      title: blog.title,
      text: blog.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
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
        <Link href="/blog" className="text-teal-600 font-medium flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isSubscribeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsSubscribeModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="p-2">
                <BlogSubscribe />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && !isSubscribeModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className="fixed bottom-6 right-6 z-40 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 max-w-[320px] flex gap-4 items-start"
          >
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
            <div className="flex-1 pr-4">
              <h4 className="font-bold text-gray-900 mb-1 text-sm">Enjoying the read?</h4>
              <p className="text-xs text-gray-500 mb-3">Get notified whenever a new article drops.</p>
              <button
                onClick={() => {
                  setShowToast(false);
                  setIsSubscribeModalOpen(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-md shadow-teal-100"
              >
                Subscribe Now
              </button>
            </div>
            <button
              onClick={() => {
                setShowToast(false);
                setHasDismissedToast(true);
              }}
              className="text-gray-400 hover:text-gray-700 absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-white pb-24 font-sans">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-500 hover:text-teal-600 transition-colors font-medium group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Articles
            </Link>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-5 py-2.5 rounded-xl transition-all border border-teal-100 shadow-sm font-medium"
              >
                <Mail size={18} />
                Subscribe
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 px-5 py-2.5 rounded-xl transition-all border border-gray-100 shadow-sm font-medium"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

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

          <article className="text-gray-800 mb-20 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-4xl font-extrabold mt-12 mb-6 text-gray-900 leading-tight" {...props} />,
                h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 leading-tight" {...props} />,
                h3: ({ ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 leading-snug" {...props} />,
                p:  ({ ...props }) => <p className="mb-6 text-lg text-gray-700" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-lg text-gray-700 marker:text-teal-500" {...props} />,
                li: ({ ...props }) => <li className="pl-2" {...props} />,
                a:  ({ ...props }) => <a className="text-teal-600 underline decoration-teal-300 underline-offset-4 hover:text-teal-700 hover:decoration-teal-500 transition-colors font-medium" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-8 italic text-gray-600 bg-gray-50 rounded-r-xl" {...props} />,
                code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
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
                img: ({ ...props }) => <img className="rounded-2xl shadow-md my-10 w-full object-cover border border-gray-100" {...props} />,
                hr:  ({ ...props }) => <hr className="my-12 border-gray-200" {...props} />,
              }}
            >
              {blog.content}
            </ReactMarkdown>

            <div ref={articleEndRef} className="h-1 w-full mt-10"></div>
          </article>

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
                  <p className="text-[12px] sentencecase tracking-wider text-gray-400 pl-2">
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
                      className="flex gap-4 group flex-col"
                    >
                      <div className="flex gap-4">
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
                          
                          {/* Threaded Admin Reply Integration */}
                          {comment.adminReply && (
                            <div className="mt-4 ml-4 sm:ml-8 flex gap-3">
                               <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Send size={14} className="rotate-45" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-teal-700 text-sm">
                                    Brian (Admin)
                                  </span>
                                </div>
                                <div className="bg-teal-50/50 p-4 rounded-2xl rounded-tl-none border border-teal-100 text-gray-700 text-sm leading-relaxed italic">
                                  {comment.adminReply}
                                </div>
                              </div>
                            </div>
                          )}
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

      <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:request@brianmaina.de")}>Contact Me</Button>
      </footer>
    </>
  );
}