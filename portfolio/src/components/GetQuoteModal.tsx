"use client";

import { useState } from "react";
import { X, CheckCircle, Tag } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function GetQuoteModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nickname: formData.get("nickname"),
      email: formData.get("email"),
      service: formData.get("service"),
      details: formData.get("details"),
      newsletter: formData.get("newsletter") === "on",
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send request");

     
      setIsSuccess(true);
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quote Request Sent!</h2>
              <p className="text-gray-600 mb-8">
                Thank you for reaching out. I have received your details and will get back to you at your email address shortly.
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-md transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              {/* Header with Pricing Icon Link */}
              <div className="flex items-center justify-between mb-1 pr-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Get a Quote</h2>
                
                <Link 
                  href="/pricing"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  title="View Pricing Guide"
                >
                  <Tag size={14} />
                  <span>Pricing</span>
                </Link>
              </div>
              
              <p className="text-sm text-gray-600 mb-5 sm:mb-6">Let&apos;s build something great together.</p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">Preferred Name / Nickname *</label>
                  <input 
                    type="text" 
                    id="nickname" 
                    name="nickname" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    placeholder="How should I address you?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
                  <input 
                    list="design-services" 
                    id="service" 
                    name="service" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    placeholder="Select or type a service"
                  />
                  <datalist id="design-services">
                    <option value="Logo Design" />
                    <option value="Poster Design" />
                    <option value="Publication Design" />
                    <option value="Print Banner" />
                    <option value="Web Banner" />
                    <option value="Landing Page UI" />
                    <option value="UI/UX Consultation" />
                    <option value="Email Template Design" />
                  </datalist>
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Project Details (Optional)</label>
                  <textarea 
                    id="details" 
                    name="details" 
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-sm sm:text-base"
                    placeholder="Tell me a bit about your project..."
                  ></textarea>
                </div>

                <div className="flex items-start space-x-2 pt-1 sm:pt-2">
                  <input 
                    type="checkbox" 
                    id="newsletter" 
                    name="newsletter" 
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600 leading-snug">
                    I would like to receive occasional updates, design tips, and promotional material via email.
                  </label>
                </div>

                <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500 mt-4 border border-gray-100">
                  <strong>Data Collection Notice:</strong> By submitting this form, you consent to the collection of your details to discuss your project.{" "}
                  {!showDisclaimer ? (
                    <button 
                      type="button" 
                      onClick={() => setShowDisclaimer(true)}
                      className="text-teal-600 hover:text-teal-700 font-medium underline inline-block"
                    >
                      Read more
                    </button>
                  ) : (
                    <span className="inline">
                      If you opt into the newsletter, your email will be used for marketing purposes. Your data is secure and will never be shared with or sold to third parties. You may withdraw your consent or unsubscribe at any time.
                      <button 
                        type="button" 
                        onClick={() => setShowDisclaimer(false)}
                        className="text-teal-600 hover:text-teal-700 font-medium underline ml-1"
                      >
                        Show less
                      </button>
                    </span>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-70 mt-2"
                >
                  {isLoading ? "Sending..." : "Request Quote"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}