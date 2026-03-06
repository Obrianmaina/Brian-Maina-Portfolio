"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Megaphone, 
  Receipt, 
  Inbox, 
  Users, 
  Briefcase, 
  Building2, 
  LogOut, 
  GraduationCap,
  MessageSquare,
  Settings, // Added this import
  BarChart3  // Added for Analytics tile
} from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function AdminDashboard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

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
    } catch {
      showModal('error', 'Error', "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setPassword("");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Verifying secure session...</p>
        </div>
      </div>
    );
  }

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
        
        <div className="relative mb-8 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Command Center</h1>
          <button
            onClick={handleLogout}
            className="absolute right-0 flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          
          <div onClick={() => router.push('/admin/blogs')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><FileText size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Blogs</h2>
            <p className="text-gray-500">Write, edit, publish, and manage your articles.</p>
          </div>

          <div onClick={() => router.push('/admin/comments')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><MessageSquare size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Moderation</h2>
            <p className="text-gray-500">Review, approve, or delete blog comments and replies.</p>
          </div>

          <div onClick={() => router.push('/admin/broadcast')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Megaphone size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Broadcast</h2>
            <p className="text-gray-500">Target audiences and send your newsletters.</p>
          </div>

          <div onClick={() => router.push('/admin/accounts')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Receipt size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Books</h2>
            <p className="text-gray-500">Handle receipts, invoices, and financials.</p>
          </div>

          <div onClick={() => router.push('/admin/quotes')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Inbox size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lead Management</h2>
            <p className="text-gray-500">Review quote requests, manage your CRM, and convert leads.</p>
          </div>

          <div onClick={() => router.push('/admin/subscribers')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Users size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Audience</h2>
            <p className="text-gray-500">Manage your newsletter subscribers and contacts.</p>
          </div>

          <div onClick={() => router.push('/admin/portfolio')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Briefcase size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfolio CMS</h2>
            <p className="text-gray-500">Manage your personal projects, case studies, and showcase items.</p>
          </div>

          <div onClick={() => router.push('/admin/corporate')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Building2 size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Corporate CMS</h2>
            <p className="text-gray-500">Manage agency/corporate projects and NDAs.</p>
          </div>

          <div onClick={() => router.push('/admin/resume')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><GraduationCap size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume / CV</h2>
            <p className="text-gray-500">Update your experience, education, and skills.</p>
          </div>

          {/* NEW: Analytics Tile */}
          <div onClick={() => router.push('/admin/analytics')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BarChart3 size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics</h2>
            <p className="text-gray-500">Track page views and resume downloads.</p>
          </div>

          {/* Corrected: Settings Tile */}
          <div onClick={() => router.push('/admin/settings')} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Settings size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Portal Settings</h2>
            <p className="text-gray-500">Manage security and admin profile data.</p>
          </div>

        </div>
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}