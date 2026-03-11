import Image from "next/image";
import { GripVertical, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { CompanyProject, Showcase } from "../types";

type Props = {
  company: CompanyProject;
  idx: number;
  isReordering: boolean;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEditCompany: (company: CompanyProject) => void;
  onAddProject: (company: CompanyProject) => void;
  onEditProject: (company: CompanyProject, project: Showcase, idx: number) => void;
  onDeleteCompany: (id: string, name: string) => void;
  onDeleteProject: (companyId: string, projectIdx: number, projectTitle: string) => void;
};

export default function CompanyCard({
  company, idx, isReordering, draggedIndex, dragOverIndex,
  onDragStart, onDragEnter, onDragEnd, onDrop,
  onEditCompany, onAddProject, onEditProject, onDeleteCompany, onDeleteProject,
}: Props) {
  return (
    <div
      draggable={isReordering}
      onDragStart={(e) => isReordering && onDragStart(e, idx)}
      onDragEnter={(e) => isReordering && onDragEnter(e, idx)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => isReordering && onDrop(e, idx)}
      className={`border rounded-2xl p-6 bg-white transition-all duration-200
        ${isReordering ? "cursor-grab active:cursor-grabbing border-gray-300" : "border-gray-200 hover:shadow-md"}
        ${draggedIndex === idx ? "opacity-50 scale-95 shadow-inner" : ""}
        ${dragOverIndex === idx && draggedIndex !== idx ? "border-violet-500 ring-4 ring-violet-200 scale-105 z-10" : ""}
      `}
    >
      {/* ── Card Header ─────────────────────────────────────────────────────── */}
      <div className={`flex justify-between items-start mb-4 ${isReordering ? "pointer-events-none" : ""}`}>
        <div className="flex items-center gap-4">
          {isReordering && <GripVertical className="text-gray-400 mr-2" />}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            {company.companyLogo ? (
              <Image src={company.companyLogo} alt={company.companyName} fill className="object-contain p-2" unoptimized />
            ) : (
              <ImageIcon className="text-gray-300" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{company.companyName}</h3>
            {!isReordering && (
              <div className="flex gap-4 mt-1">
                <button
                  onClick={() => onAddProject(company)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-semibold flex items-center"
                >
                  + Add Project
                </button>
                <button
                  onClick={() => onEditCompany(company)}
                  className="text-sm text-amber-500 hover:text-amber-700 font-semibold flex items-center"
                >
                  <Pencil size={14} className="mr-1" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {!isReordering && (
          <button
            onClick={() => onDeleteCompany(company._id!, company.companyName)}
            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center bg-red-50 px-3 py-1.5 rounded-lg"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
        )}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
      <p className={`text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6 ${isReordering ? "pointer-events-none" : ""}`}>
        {company.disclaimer}
      </p>

      {/* ── Nested Projects Grid ─────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isReordering ? "pointer-events-none opacity-60" : ""}`}>
        {company.projects?.map((project, pIdx) => (
          <ProjectTile
            key={pIdx}
            project={project}
            pIdx={pIdx}
            company={company}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
          />
        ))}
      </div>
    </div>
  );
}

// ── ProjectTile ──────────────────────────────────────────────────────────────

type TileProps = {
  project: Showcase;
  pIdx: number;
  company: CompanyProject;
  onEdit: (company: CompanyProject, project: Showcase, idx: number) => void;
  onDelete: (companyId: string, projectIdx: number, projectTitle: string) => void;
};

function ProjectTile({ project, pIdx, company, onEdit, onDelete }: TileProps) {
  const thumbSrc = project.coverImage
    ? project.coverImage
    : project.mediaType === "image" && project.media.length > 0
    ? Array.isArray(project.media) ? project.media[0] : (project.media as string)
    : null;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
      <div className="h-24 bg-gray-200 relative overflow-hidden flex items-center justify-center">
        {thumbSrc ? (
          <Image src={thumbSrc} alt={project.title} fill className="object-cover" unoptimized />
        ) : (
          <ImageIcon className="text-gray-300" size={24} />
        )}
        <span className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold rounded z-10">
          {project.category}
        </span>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{project.title}</h4>
        <div className="mt-auto border-t border-gray-200 pt-2 flex justify-between items-center pointer-events-auto">
          <button
            onClick={() => onEdit(company, project, pIdx)}
            className="text-amber-500 hover:text-amber-700 text-xs font-bold flex items-center"
          >
            <Pencil size={12} className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(company._id!, pIdx, project.title)}
            className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center"
          >
            <Trash2 size={12} className="mr-1" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}