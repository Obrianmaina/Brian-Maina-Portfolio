"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleUnsubscribe() {
    if (!email) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to unsubscribe");

      setIsSuccess(true);
      toast.success("Successfully unsubscribed");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3 transition-colors">
          You have been unsubscribed
        </h1>
        <p className="text-gray-600 dark:text-gray-300 transition-colors">
          You will no longer receive updates from me. You can safely close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3 transition-colors">
        Unsubscribe
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors">
        Are you sure you want to unsubscribe <strong className="text-gray-900 dark:text-white">{email}</strong> from these updates?
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={isLoading || !email}
        className="bg-red-600 hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-70 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        {isLoading ? "Processing..." : "Confirm Unsubscribe"}
      </button>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300 font-sans">
      {/* Changed rounded-full to rounded-3xl so it doesn't distort awkwardly */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-10 max-w-md w-full transition-colors duration-300">
        <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400 animate-pulse font-medium">Loading...</div>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}