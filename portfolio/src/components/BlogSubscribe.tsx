// src/components/BlogSubscribe.tsx
"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function BlogSubscribe() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nickname) return;

    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          nickname,
          subscriptionType: "blog"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage("Awesome! Check your inbox to verify your subscription.");
        setEmail("");
        setNickname("");
      } else {
        setStatus('error');
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 my-12 max-w-2xl mx-auto text-center">
      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail size={24} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Never miss an update
      </h3>
      <p className="text-gray-600 mb-6">
        Get notified whenever I publish a new article. No spam, unsubscribe at any time.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center text-green-700 bg-green-50 py-3 px-4 rounded-xl font-medium">
          <CheckCircle size={20} className="mr-2" />
          {message}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
               <input
                type="text"
                required
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-70 w-full"
            >
              {loading ? "Sending..." : "Subscribe"}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            By subscribing, you consent to the storage of your nickname and email address to receive blog updates. Read our{" "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-medium underline">
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-3 font-medium">{message}</p>
      )}
    </div>
  );
}