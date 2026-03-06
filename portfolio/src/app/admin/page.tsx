"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Megaphone, Receipt, Inbox, Users, Briefcase } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function AdminDashboard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

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
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Command Center</h1>
        
        {/* Grid is 3 columns, fitting all 6 items perfectly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">

          <div
            onClick={() => router.push('/admin/blogs')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Blogs</h2>
            <p className="text-gray-500">Write, edit, publish, and manage your articles.</p>
          </div>

          <div
            onClick={() => router.push('/admin/broadcast')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Megaphone size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Broadcast</h2>
            <p className="text-gray-500">Target audiences and send your newsletters.</p>
          </div>

          <div
            onClick={() => router.push('/admin/accounts')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Receipt size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Books</h2>
            <p className="text-gray-500">Handle receipts, invoices, and financials.</p>
          </div>

          <div
            onClick={() => router.push('/admin/quotes')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Inbox size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lead Management</h2>
            <p className="text-gray-500">Review quote requests, manage your CRM, and convert leads.</p>
          </div>

          <div
            onClick={() => router.push('/admin/subscribers')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Audience</h2>
            <p className="text-gray-500">Manage your newsletter subscribers and contacts.</p>
          </div>

          <div
            onClick={() => router.push('/admin/portfolio')}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfolio CMS</h2>
            <p className="text-gray-500">Manage your projects, case studies, and showcase items.</p>
          </div>

        </div>
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}