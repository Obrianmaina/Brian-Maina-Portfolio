"use client";

import { useState } from "react";
import { Quote } from "@/types";
import KanbanColumn from "./KanbanColumn";

const ACTIVE_STATUSES: Quote["status"][] = ["New", "Contacted", "In Progress", "Closed Won"];
const CLOSED_STATUSES: Quote["status"][] = ["Closed Lost"];

interface KanbanBoardProps {
  quotes: Quote[];
  onStatusChange: (id: string, status: Quote["status"]) => void;
}

export default function KanbanBoard({ quotes, onStatusChange }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleDrop = (status: Quote["status"]) => {
    if (draggedId) {
      onStatusChange(draggedId, status);
      setDraggedId(null);
      setDragOverCol(null);
    }
  };

  const colProps = {
    draggedId,
    dragOverCol,
    onDragStart: (id: string) => setDraggedId(id),
    onDragEnd: () => { setDraggedId(null); setDragOverCol(null); },
    onDragOver: (status: string) => setDragOverCol(status),
    onDragLeave: () => setDragOverCol(null),
    onDrop: handleDrop,
  };

  const wonCount = quotes.filter((q) => q.status === "Closed Won").length;
  const lostCount = quotes.filter((q) => q.status === "Closed Lost").length;
  const total = wonCount + lostCount;
  const winRate = total > 0 ? Math.round((wonCount / total) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Active Pipeline */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">
          Active Pipeline
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {ACTIVE_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              quotes={quotes.filter((q) => (q.status || "New") === status)}
              {...colProps}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-dashed border-gray-300" />
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest whitespace-nowrap">
          Lost Leads
          {winRate !== null && (
            <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full normal-case font-bold">
              {winRate}% win rate
            </span>
          )}
        </span>
        <div className="flex-1 border-t border-dashed border-gray-300" />
      </div>

      {/* Closed Section */}
      <div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {CLOSED_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              quotes={quotes.filter((q) => q.status === status)}
              {...colProps}
              dimmed
            />
          ))}
        </div>
      </div>
    </div>
  );
}