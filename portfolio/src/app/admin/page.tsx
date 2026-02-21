"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types";
import { Pencil, Trash2, Plus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [view, setView] = useState<'grid' | 'editor'>('grid');
  const [loading, setLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [photoCredit, setPhotoCredit] = useState("");

  // MODAL STATE
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  // MODAL HELPERS
  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        showModal('error', 'Access Denied', data.message || "Incorrect password");
      }
    } catch (error) {
      showModal('error', 'Error', "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!title || !content || !description) {
      showModal('error', 'Incomplete', "Title, Description, and Content are required.");
      return;
    }

    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId 
        ? { id: editingId, title, description, content, featuredImage, photoCredit, isPublished }
        : { title, description, content, featuredImage, photoCredit, isPublished };

      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showModal('success', 'Success', `Article ${isPublished ? "published" : "saved as draft"}!`);
        resetForm();
        fetchBlogs();
      } else {
        showModal('error', 'Save Failed', "Could not save the article.");
      }
    } catch (error) {
      showModal('error', 'Error', "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: HANDLE TOGGLE PUBLISH (UNPUBLISH / QUICK PUBLISH)
  const handleTogglePublish = async (blog: BlogPost) => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: blog._id,
          title: blog.title,
          description: blog.description,
          content: blog.content,
          featuredImage: blog.featuredImage,
          photoCredit: blog.photoCredit,
          isPublished: !blog.isPublished,
        }),
      });

      if (res.ok) {
        showModal(
          'success', 
          'Status Updated', 
          `Article has been ${!blog.isPublished ? "published" : "moved to drafts"}.`
        );
        fetchBlogs();
      } else {
        showModal('error', 'Update Failed', "Failed to change publication status.");
      }
    } catch (error) {
      showModal('error', 'Error', "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showModal(
      'confirm',
      'Delete Article',
      'Are you sure? This will permanently remove the article.',
      () => executeDelete(id)
    );
  };

  const executeDelete = async (id: string) => {
    closeModal();
    try {
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        showModal('error', 'Delete Failed', "Could not delete from database.");
      }
    } catch (error) {
      showModal('error', 'Error', "Error while deleting.");
    }
  };

  const openEditorForNew = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setContent("");
    setFeaturedImage("");
    setPhotoCredit("");
    setView('editor');
  };

  const openEditorForEdit = (blog: BlogPost) => {
    if (blog._id) {
      setEditingId(blog._id);
      setTitle(blog.title);
      setDescription(blog.description || "");
      setContent(blog.content);
      setFeaturedImage(blog.featuredImage || "");
      setPhotoCredit(blog.photoCredit || "");
      setView('editor');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setContent("");
    setFeaturedImage("");
    setPhotoCredit("");
    setView('grid');
  };

  const getWordCount = (str: string) => str.trim() === "" ? 0 : str.trim().split(/\s+/).length;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (getWordCount(value) <= 20 || value.length < description.length) {
      setDescription(value);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-xl mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access Portal"}
          </button>
        </form>
        <AdminModal modal={modal} close={closeModal} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {view === 'grid' ? (
          <>
            <h1 className="text-3xl font-bold mb-8 border-l-4 border-gray-300 pb-2 px-4">Blog Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tile 1: Create New Blog */}
              <div 
                onClick={openEditorForNew} 
                className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-teal-50 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-colors group"
              >
                <Plus size={32} className="text-gray-400 group-hover:text-teal-600 mb-4" />
                <p className="font-semibold text-gray-600 group-hover:text-teal-700">New Article</p>
              </div>

              {/* Dynamic Tiles: Existing Blogs */}
              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow relative">
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className={`mt-6 ml-6 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {blog.photoCredit && blog.isPublished && (
                      <span 
                        className="mt-6 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-white" 
                        title={`Credit: ${blog.photoCredit}`}
                      >
                        C
                      </span>
                    )}
                  </div>

                  <div className="h-40 relative bg-gray-200 shrink-0 rounded-xl overflow-hidden m-4 border border-gray-100">
                    {blog.featuredImage ? (
                      <Image 
                        src={blog.featuredImage} 
                        alt={blog.title} 
                        fill 
                        className="object-cover" 
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                    )}
                  </div>

                  <CardContent className="px-6 pb-6 pt-2 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{blog.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{blog.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <button 
                        onClick={() => openEditorForEdit(blog)} 
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors"
                        title="Edit Article"
                      >
                        <Pencil size={16} className="mr-1" /> Edit
                      </button>

                      <button 
                        onClick={() => handleTogglePublish(blog)} 
                        className={`${blog.isPublished ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'} flex items-center text-sm font-medium transition-colors`}
                        title={blog.isPublished ? "Unpublish to Drafts" : "Publish Now"}
                      >
                        {blog.isPublished ? (
                          <><EyeOff size={16} className="mr-1" /> Unpublish</>
                        ) : (
                          <><Eye size={16} className="mr-1" /> Publish</>
                        )}
                      </button>

                      <button 
                        onClick={(e) => blog._id && confirmDelete(blog._id, e)} 
                        className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <button onClick={resetForm} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-gray-300 pb-2 px-4">
              {editingId ? "Edit" : "New"} Article
            </h2>
            <form className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Title" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Short Description</label>
                <textarea required rows={3} value={description} onChange={handleDescriptionChange} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Short summary..." />
                <div className="flex justify-end text-xs text-gray-400 mt-1 font-medium">{getWordCount(description)} / 20 words</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Image URL</label>
                  <input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Photo Credit</label>
                  <input type="text" value={photoCredit} onChange={(e) => setPhotoCredit(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Photographer name" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Content (Markdown)</label>
                <textarea required rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" placeholder="Write your article here..." />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <button type="button" onClick={() => handleSubmit(false)} disabled={loading} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button type="button" onClick={() => handleSubmit(true)} disabled={loading} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-100">
                  {loading ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}