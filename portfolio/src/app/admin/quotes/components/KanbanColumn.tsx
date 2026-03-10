"use client";

import { Mail, Clock, Calendar } from "lucide-react";
import { Quote } from "@/types";

export const STATUS_STYLES: Record<string, { header: string; card: string; dot: string }> = {
  "New":         { header: "bg-blue-500",    card: "border-blue-200 bg-blue-50/40",       dot: "bg-blue-500" },
  "Contacted":   { header: "bg-amber-500",   card: "border-amber-200 bg-amber-50/40",     dot: "bg-amber-500" },
  "In Progress": { header: "bg-purple-500",  card: "border-purple-200 bg-purple-50/40",   dot: "bg-purple-500" },
  "Closed Won":  { header: "bg-emerald-500", card: "border-emerald-200 bg-emerald-50/40", dot: "bg-emerald-500" },
  "Closed Lost": { header: "bg-red-400",     card: "border-red-200 bg-red-50/40",         dot: "bg-red-400" },
};

interface KanbanColumnProps {
  status: Quote["status"];
  quotes: Quote[];
  draggedId: string | null;
  dragOverCol: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (status: string) => void;
  onDragLeave: () => void;
  onDrop: (status: Quote["status"]) => void;
  dimmed?: boolean;
}

export default function KanbanColumn({
  status,
  quotes,
  draggedId,
  dragOverCol,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  dimmed = false,
}: KanbanColumnProps) {
  const col = STATUS_STYLES[status!];
  const isOver = dragOverCol === status;

  return (
    <div
      className={`flex-shrink-0 w-72 rounded-2xl border-2 transition-all
        ${isOver ? "border-dashed border-gray-400 scale-[1.01]" : "border-transparent"}
        ${dimmed ? "opacity-60 hover:opacity-100 transition-opacity duration-200" : ""}
      `}
      onDragOver={(e) => { e.preventDefault(); onDragOver(status!); }}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(status)}
    >
      {/* Column Header */}
      <div className={`${col.header} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <span className="text-white font-bold text-sm tracking-wide">{status}</span>
        <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {quotes.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className={`rounded-b-xl p-3 space-y-3 min-h-[160px] transition-colors
          ${isOver ? "bg-gray-100" : "bg-gray-50"}
        `}
      >
        {quotes.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8 italic">Drop leads here</p>
        )}
        {quotes.map((quote) => (
          <div
            key={quote._id}
            draggable
            onDragStart={() => onDragStart(quote._id)}
            onDragEnd={onDragEnd}
            className={`rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md
              ${col.card}
              ${draggedId === quote._id ? "opacity-40 scale-95" : ""}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-bold text-gray-900 text-sm leading-tight">{quote.name}</p>
              <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${col.dot}`} />
            </div>

            <a
              href={`mailto:${quote.email}`}
              className="text-xs text-blue-600 hover:underline flex items-center mb-3"
            >
              <Mail size={11} className="mr-1" /> {quote.email}
            </a>

            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold text-gray-700 border border-gray-200">
                {quote.service}
              </span>
              <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold text-green-700 border border-green-200">
                {quote.budget}
              </span>
            </div>

            <p className="text-xs text-gray-500 italic line-clamp-2 mb-3">
              &ldquo;{quote.message}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/60">
              <span className="text-xs text-gray-400 flex items-center">
                <Clock size={10} className="mr-1" />
                {new Date(quote.createdAt || new Date()).toLocaleDateString()}
              </span>
              {quote.lastContactedDate && (
                <span className="text-xs text-gray-400 flex items-center">
                  <Calendar size={10} className="mr-1" />
                  {new Date(quote.lastContactedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}