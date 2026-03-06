"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Mail, UserMinus, CheckCircle, Clock, XCircle } from "lucide-react";
import AdminModal from "@/components/AdminModal";

type Subscriber = {
  _id: string;
  email: string;
  nickname: string;
  subscribed: boolean;
  verified: boolean;
  createdAt: string;
};

export default function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        setSubscribers(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    setModal({
      show: true,
      type: 'confirm',
      title: 'Remove Subscriber',
      message: `Are you sure you want to remove ${email} from your audience?`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/subscribers", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (res.ok) {
            setSubscribers(subscribers.filter(s => s._id !== id));
            setModal({ show: false, type: 'success', title: '', message: '' });
          } else {
            setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to delete subscriber.' });
          }
        } catch (error) {
          setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
        }
      }
    });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  // Calculate statistics
  const stats = useMemo(() => {
    const total = subscribers.length;
    const verified = subscribers.filter(s => s.verified && s.subscribed).length;
    const pending = subscribers.filter(s => !s.verified && !s.subscribed).length;
    const unsubscribed = subscribers.filter(s => s.verified && !s.subscribed).length;
    return { total, verified, pending, unsubscribed };
  }, [subscribers]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>
        
        <div className="flex items-center mb-8 border-l-4 border-indigo-500 pl-4">
          <Users size={28} className="text-indigo-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Audience Management</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Audience</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center">
            <p className="text-emerald-700 text-sm font-semibold mb-1">Active & Verified</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.verified}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center">
            <p className="text-amber-700 text-sm font-semibold mb-1">Pending Verification</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-center">
            <p className="text-red-700 text-sm font-semibold mb-1">Unsubscribed</p>
            <p className="text-3xl font-bold text-red-600">{stats.unsubscribed}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading audience data...</div>
        ) : subscribers.length === 0 ? (
          <div className="bg-gray-50 p-12 rounded-2xl border border-gray-200 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No subscribers yet</h3>
            <p className="text-gray-500">When users sign up for your newsletter, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Subscriber</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <p className="font-bold text-gray-900 text-base">{sub.nickname || 'Unknown'}</p>
                      <a href={`mailto:${sub.email}`} className="text-indigo-600 hover:underline flex items-center mt-1">
                        <Mail size={14} className="mr-1.5" /> {sub.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {sub.verified && sub.subscribed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={12} className="mr-1" /> Active
                        </span>
                      ) : sub.verified && !sub.subscribed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          <XCircle size={12} className="mr-1" /> Unsubscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle text-gray-500 font-medium">
                      {new Date(sub.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button 
                        onClick={() => handleDelete(sub._id, sub.email)}
                        className="inline-flex items-center px-3 py-1.5 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <UserMinus size={14} className="mr-1.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}