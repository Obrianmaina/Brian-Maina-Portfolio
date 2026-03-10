"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Mail, Clock, Calendar, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Quote } from "@/types";

interface QuotesTableProps {
  quotes: Quote[];
  expandedId: string | null;
  editingNotes: { [id: string]: string };
  onToggleExpand: (id: string) => void;
  onUpdateLead: (id: string, updates: Partial<Quote>) => void;
  onNotesSave: (id: string) => void;
  onContactDateUpdate: (id: string) => void;
  onNotesChange: (id: string, value: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":          return "bg-blue-100 text-blue-700 border-blue-200";
    case "Contacted":    return "bg-amber-100 text-amber-700 border-amber-200";
    case "In Progress":  return "bg-purple-100 text-purple-700 border-purple-200";
    case "Closed Won":   return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Closed Lost":  return "bg-red-100 text-red-700 border-red-200";
    default:             return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function QuotesTable({
  quotes,
  expandedId,
  editingNotes,
  onToggleExpand,
  onUpdateLead,
  onNotesSave,
  onContactDateUpdate,
  onNotesChange,
}: QuotesTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-4 rounded-tl-xl w-10"></th>
            <th className="px-4 py-4">Client Details</th>
            <th className="px-4 py-4">Project Request</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {quotes.map((quote) => (
            <React.Fragment key={quote._id}>
              <tr className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-4 align-top">
                  <button
                    onClick={() => onToggleExpand(quote._id)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    {expandedId === quote._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </td>

                <td className="px-4 py-4 align-top">
                  <p className="font-bold text-gray-900 text-base">{quote.name}</p>
                  <a
                    href={`mailto:${quote.email}`}
                    className="text-blue-600 hover:underline flex items-center mt-1 mb-2"
                  >
                    <Mail size={14} className="mr-1.5" /> {quote.email}
                  </a>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    Received: {new Date(quote.createdAt || new Date()).toLocaleDateString()}
                  </div>
                </td>

                <td className="px-4 py-4 align-top max-w-xs">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700 border border-gray-200">
                      {quote.service}
                    </span>
                    <span className="px-2 py-1 bg-green-50 rounded-md text-xs font-semibold text-green-700 border border-green-200">
                      {quote.budget}
                    </span>
                  </div>
                  <p className="text-gray-600 italic line-clamp-2" title={quote.message}>
                    &ldquo;{quote.message}&rdquo;
                  </p>
                </td>

                <td className="px-4 py-4 align-top whitespace-nowrap">
                  <select
                    value={quote.status || "New"}
                    onChange={(e) =>
                      onUpdateLead(quote._id, { status: e.target.value as Quote["status"] })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none ${getStatusColor(quote.status || "New")}`}
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </td>

                <td className="px-4 py-4 align-top text-right">
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/accounts?email=${encodeURIComponent(quote.email)}&name=${encodeURIComponent(quote.name)}`
                      )
                    }
                    className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Create Invoice
                  </button>
                </td>
              </tr>

              {/* Expanded CRM Row */}
              {expandedId === quote._id && (
                <tr className="bg-gray-50/50">
                  <td colSpan={5} className="p-0 border-b border-gray-200">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-4 border-blue-400">

                      {/* Full Message */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 flex items-center mb-2">
                          <MessageSquare size={16} className="mr-2 text-gray-500" />
                          Original Message
                        </h4>
                        <p className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm whitespace-pre-wrap">
                          {quote.message}
                        </p>
                      </div>

                      {/* CRM Tools */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 flex items-center">
                              <Calendar size={16} className="mr-2 text-gray-500" />
                              Last Contacted
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {quote.lastContactedDate
                                ? new Date(quote.lastContactedDate).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                          <button
                            onClick={() => onContactDateUpdate(quote._id)}
                            className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                          >
                            Mark as Contacted Today
                          </button>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">Internal Notes</h4>
                          <textarea
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows={3}
                            placeholder="Add notes from your client call here..."
                            value={
                              editingNotes[quote._id] !== undefined
                                ? editingNotes[quote._id]
                                : quote.notes || ""
                            }
                            onChange={(e) => onNotesChange(quote._id, e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => onNotesSave(quote._id)}
                              className="text-xs font-semibold px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}