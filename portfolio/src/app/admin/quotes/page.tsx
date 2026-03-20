"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Inbox, LayoutDashboard, List, Plus, X } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import KanbanBoard from "./components/KanbanBoard";
import QuotesTable from "./components/QuotesTable";
import { Quote } from "@/types";

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  // Add Lead Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "", // We will use this for phone numbers too
    service: "General Inquiry",
    budget: "Not specified",
    message: "",
    status: "New" as Quote["status"],
  });

  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
  }>({ show: false, type: "success", title: "", message: "" });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/admin/quotes");
      if (res.ok) setQuotes(await res.json());
    } catch (error) {
      console.error("Failed to fetch quotes", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<Quote>) => {
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { id, ...updates },
          (_key, value) => (value === undefined ? null : value)
        ),
      });
      if (res.ok) {
        setQuotes((prev) => prev.map((q) => (q._id === id ? { ...q, ...updates } : q)));
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to update lead." });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." });
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // We send this to your existing frontend API endpoint, or create a specific POST logic
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setNewLead({ name: "", email: "", service: "General Inquiry", budget: "Not specified", message: "", status: "New" });
        fetchQuotes(); // Refresh the board
        setModal({ show: true, type: "success", title: "Success", message: "Manual lead added to CRM." });
      } else {
        const data = await res.json();
        setModal({ show: true, type: "error", title: "Error", message: data.error || "Failed to add lead." });
      }
    } catch (error) {
      setModal({ show: true, type: "error", title: "Error", message: "Network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotesSave = (id: string) => {
    const note =
      editingNotes[id] !== undefined
        ? editingNotes[id]
        : quotes.find((q) => q._id === id)?.notes ?? "";
    updateLead(id, { notes: note });
  };
  const handleContactDateUpdate = (id: string) => updateLead(id, { lastContactedDate: new Date().toISOString() });
  const handleToggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));
  const handleNotesChange = (id: string, value: string) =>
    setEditingNotes((prev) => ({ ...prev, [id]: value }));

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">

        {/* Back */}
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center border-l-4 border-blue-500 pl-4">
            <Inbox size={28} className="text-blue-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-50 transition-colors">Lead CRM</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus size={18} className="mr-2" /> Add Lead
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 transition-colors">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${view === "list" ? "bg-white dark:bg-gray-950 shadow text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                <List size={16} /> List
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${view === "kanban" ? "bg-white dark:bg-gray-950 shadow text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                <LayoutDashboard size={16} /> Kanban
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">Loading leads...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-12 rounded-2xl border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <Inbox size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600 transition-colors" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2 transition-colors">No leads yet</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">When potential clients request a quote, they will appear here.</p>
          </div>
        ) : view === "kanban" ? (
          <KanbanBoard
            quotes={quotes}
            onStatusChange={(id, status) => updateLead(id, { status })}
          />
        ) : (
          <QuotesTable
            quotes={quotes}
            expandedId={expandedId}
            editingNotes={editingNotes}
            onToggleExpand={handleToggleExpand}
            onUpdateLead={updateLead}
            onNotesSave={handleNotesSave}
            onContactDateUpdate={handleContactDateUpdate}
            onNotesChange={handleNotesChange}
          />
        )}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl dark:shadow-none border border-transparent dark:border-gray-800 animate-in zoom-in-95 transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 transition-colors">Manually Add Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Client Name</label>
                <input required type="text" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-colors" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Contact (Phone or Email)</label>
                <input required type="text" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-colors" placeholder="+254 700 000 000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Service Interest</label>
                  <input type="text" value={newLead.service} onChange={e => setNewLead({...newLead, service: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-colors" placeholder="e.g. Logo Design" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Budget / Value</label>
                  <input type="text" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-colors" placeholder="e.g. 50,000 KES" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Initial Notes / Referral Source</label>
                <textarea value={newLead.message} onChange={e => setNewLead({...newLead, message: e.target.value})} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 transition-colors resize-y h-20" placeholder="Met at networking event..." />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 transition-colors">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  {isSubmitting ? 'Saving...' : 'Add Lead to Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}