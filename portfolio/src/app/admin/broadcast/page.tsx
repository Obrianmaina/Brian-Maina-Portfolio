"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function BroadcastPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterImage, setNewsletterImage] = useState("");
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'blog' | 'client'>('all');

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

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSubject || !newsletterMessage) {
      showModal('error', 'Incomplete', 'Subject and message are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newsletterSubject,
          message: newsletterMessage,
          imageUrl: newsletterImage,
          audience: broadcastAudience,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal('success', 'Broadcast Sent!', `Your newsletter was sent to ${data.sentCount} ${broadcastAudience === 'all' ? '' : broadcastAudience} subscribers.`);
        setNewsletterSubject("");
        setNewsletterMessage("");
        setNewsletterImage("");
        setBroadcastAudience("all");
      } else {
        showModal('error', 'Broadcast Failed', data.error || "Failed to send newsletter.");
      }
    } catch {
      showModal('error', 'Error', "An unexpected error occurred while sending.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>
        <h2 className="text-3xl font-bold mb-2 border-l-4 border-indigo-300 pb-2 px-4">
          Broadcast Center
        </h2>
        <p className="text-gray-500 mb-8 ml-5 text-sm">
          Select your target audience and draft your message.
        </p>

        <form onSubmit={handleSendNewsletter} className="space-y-6">

          <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="text-sm font-bold text-gray-700 ml-1">Target Audience</label>
            <div className="flex flex-col sm:flex-row gap-3">
              {(['all', 'blog', 'client'] as const).map((audience) => (
                <button
                  key={audience}
                  type="button"
                  onClick={() => setBroadcastAudience(audience)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium border transition-all ${broadcastAudience === audience ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  {audience === 'all' ? 'All Subscribers' : audience === 'blog' ? 'Blog Only' : 'Clients Only'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Subject Line</label>
            <input
              type="text"
              required
              value={newsletterSubject}
              onChange={(e) => setNewsletterSubject(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="E.g., Updates on my latest UI project"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-end ml-1">
              <label className="text-sm font-semibold text-gray-700">Cover Image URL</label>
              <span className="text-xs text-gray-400 font-medium">Optional</span>
            </div>
            <input
              type="url"
              value={newsletterImage}
              onChange={(e) => setNewsletterImage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Message Body</label>
            <textarea
              required
              rows={10}
              value={newsletterMessage}
              onChange={(e) => setNewsletterMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Type your newsletter content here. Line breaks will be preserved."
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? "Sending Broadcast..."
                : <><Send size={20} className="mr-2" /> Send to {broadcastAudience === 'all' ? 'All' : broadcastAudience === 'blog' ? 'Blog' : 'Client'} Subscribers</>
              }
            </button>
          </div>
        </form>
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}