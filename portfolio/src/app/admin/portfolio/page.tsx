"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Briefcase, Plus, Trash2, Image as ImageIcon, Pencil, X, Save, GripVertical } from "lucide-react";
import AdminModal from "@/components/AdminModal";

// Expanded Type to include the Case Study, Brand Details, Logo Concepts, Cover Image, and Order
type Showcase = {
  _id?: string;
  order?: number;
  title: string;
  category: string;
  description: string;
  tag: string;
  mediaType: string;
  media: string | string[];
  coverImage?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  brandDetails?: {
    colors?: string[];
    mockups?: string[];
  };
  logoConcepts?: {
    title: string;
    description?: string;
    primaryImage?: string;
    colors?: string[];
    fonts?: string[];
    mockups?: string[];
  }[];
  caseStudy?: {
    role?: string;
    duration?: string;
    tools?: string[];
    problemStatement?: string;
    problemImages?: string[];
    userResearch?: string;
    researchImages?: string[];
    wireframesText?: string;
    wireframesImages?: string[];
    learnings?: string;
  };
};

type LogoConceptForm = {
  title: string;
  description: string;
  primaryImage: string;
  colorsStr: string;
  fontsStr: string;
  mockupsStr: string;
};

type FormState = {
  title: string; category: string; description: string; tag: string;
  mediaType: string; media: string; coverImage: string;
  challenge: string; process: string; outcome: string;
  logoConcepts: LogoConceptForm[];
  csRole: string; csDuration: string; csToolsStr: string;
  csProblemText: string; csProblemImagesStr: string;
  csResearchText: string; csResearchImagesStr: string;
  csWireframesText: string; csWireframeImagesStr: string;
  csLearnings: string;
};

const initialFormState: FormState = {
  title: "", category: "Graphics", description: "", tag: "", mediaType: "image", media: "", coverImage: "",
  challenge: "", process: "", outcome: "",
  logoConcepts: [],
  csRole: "", csDuration: "", csToolsStr: "", csProblemText: "", csProblemImagesStr: "",
  csResearchText: "", csResearchImagesStr: "", csWireframesText: "", csWireframeImagesStr: "", csLearnings: ""
};

/** Map a saved Showcase back into flat FormState for editing */
function showcaseToFormState(p: Showcase): FormState {
  const joinArr = (arr?: string[]) => arr?.join(", ") ?? "";
  const mediaStr = Array.isArray(p.media) ? p.media.join(", ") : (p.media ?? "");

  // Handle new logoConcepts or fall back to legacy brandDetails
  let mappedConcepts: LogoConceptForm[] = p.logoConcepts?.map(c => ({
    title: c.title || "",
    description: c.description || "",
    primaryImage: c.primaryImage || "",
    colorsStr: joinArr(c.colors),
    fontsStr: joinArr(c.fonts),
    mockupsStr: joinArr(c.mockups),
  })) || [];

  if (mappedConcepts.length === 0 && p.brandDetails) {
    mappedConcepts = [{
      title: "Concept 1",
      description: "",
      primaryImage: "",
      colorsStr: joinArr(p.brandDetails.colors),
      fontsStr: "",
      mockupsStr: joinArr(p.brandDetails.mockups)
    }];
  }

  return {
    title: p.title ?? "",
    category: p.category ?? "Graphics",
    description: p.description ?? "",
    tag: p.tag ?? "",
    mediaType: p.mediaType ?? "image",
    media: mediaStr,
    coverImage: p.coverImage ?? "",
    challenge: p.challenge ?? "",
    process: p.process ?? "",
    outcome: p.outcome ?? "",
    logoConcepts: mappedConcepts,
    csRole: p.caseStudy?.role ?? "",
    csDuration: p.caseStudy?.duration ?? "",
    csToolsStr: joinArr(p.caseStudy?.tools),
    csProblemText: p.caseStudy?.problemStatement ?? "",
    csProblemImagesStr: joinArr(p.caseStudy?.problemImages),
    csResearchText: p.caseStudy?.userResearch ?? "",
    csResearchImagesStr: joinArr(p.caseStudy?.researchImages),
    csWireframesText: p.caseStudy?.wireframesText ?? "",
    csWireframeImagesStr: joinArr(p.caseStudy?.wireframesImages),
    csLearnings: p.caseStudy?.learnings ?? "",
  };
}

export default function PortfolioCMS() {
  const router = useRouter();
  const [projects, setProjects] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  // Reorder States
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // null  -> no form open
  // "new" -> adding new project
  // string (id) -> editing that project
  const [formMode, setFormMode] = useState<null | "new" | string>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const [modal, setModal] = useState<{
    show: boolean; type: "success" | "error" | "confirm";
    title: string; message: string; onConfirm?: () => void;
  }>({ show: false, type: "success", title: "", message: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) setProjects(await res.json());
    } catch {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  /** Open the form pre-filled for an existing project */
  const openEdit = (project: Showcase) => {
    setFormData(showcaseToFormState(project));
    setFormMode(String(project._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Open the form blank for a new project */
  const openAdd = () => {
    setFormData(initialFormState);
    setFormMode("new");
    setIsReordering(false);
  };

  const closeForm = () => {
    setFormMode(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced safety to ensure it always correctly handles inputs
    const splitAndTrim = (str: string | string[] | null | undefined): string[] => {
      if (!str) return [];
      return String(str).split(",").map(s => s.trim()).filter(Boolean);
    };

    const payload: Partial<Showcase> & { id?: string } = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tag: formData.tag,
      mediaType: formData.mediaType,
      challenge: formData.challenge,
      process: formData.process,
      outcome: formData.outcome,
      media:
        formData.mediaType === "image"
          ? splitAndTrim(formData.media)
          : formData.media,
    };

    if (formData.coverImage) payload.coverImage = formData.coverImage;

    if (formData.category === "Logo") {
      payload.logoConcepts = formData.logoConcepts.map(concept => ({
        title: concept.title,
        description: concept.description,
        primaryImage: concept.primaryImage,
        colors: splitAndTrim(concept.colorsStr),
        fonts: splitAndTrim(concept.fontsStr),
        mockups: splitAndTrim(concept.mockupsStr),
      }));
    }

    if (formData.category === "UI/UX") {
      payload.caseStudy = {
        role: formData.csRole,
        duration: formData.csDuration,
        tools: splitAndTrim(formData.csToolsStr),
        problemStatement: formData.csProblemText,
        problemImages: splitAndTrim(formData.csProblemImagesStr),
        userResearch: formData.csResearchText,
        researchImages: splitAndTrim(formData.csResearchImagesStr),
        wireframesText: formData.csWireframesText,
        wireframesImages: splitAndTrim(formData.csWireframeImagesStr),
        learnings: formData.csLearnings,
      };
    }

    const isEditing = formMode !== null && formMode !== "new";
    if (isEditing) payload.id = formMode as string;

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({
          show: true, type: "success", title: "Success",
          message: isEditing ? "Project updated successfully!" : "Project added to portfolio!",
        });
        closeForm();
        fetchProjects();
      } else {
        // Here we extract the EXACT error being returned by the server API
        const errorData = await res.json().catch(() => ({}));
        const serverErrorMsg = errorData.error || errorData.message || res.statusText;

        setModal({
          show: true,
          type: "error",
          title: "Update Failed",
          message: `Server reported: ${serverErrorMsg}. Please check that you haven't included large Base64 images.`
        });
      }
    } catch (error) {
      setModal({ show: true, type: "error", title: "Network Error", message: "Failed to reach the server. Check your connection." });
    }
  };

  const handleDelete = (id: string, title: string) => {
    setModal({
      show: true, type: "confirm", title: "Delete Project",
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/portfolio", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setProjects(projects.filter(p => p._id !== id));
          setModal({ show: false, type: "success", title: "", message: "" });
          if (formMode === id) closeForm();
        }
      },
    });
  };

  // DRAG AND DROP HANDLERS
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== draggedIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newProjects = [...projects];
    const draggedItem = newProjects[draggedIndex];

    newProjects.splice(draggedIndex, 1);
    newProjects.splice(dropIndex, 0, draggedItem);

    setProjects(newProjects);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    const orderData = projects.map((p, index) => ({
      _id: p._id,
      order: index,
    }));

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: "Portfolio order updated successfully!" });
        setIsReordering(false);
        fetchProjects();
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to update order." });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." });
    }
  };

  const isFormOpen = formMode !== null;
  const isEditing = isFormOpen && formMode !== "new";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>

          <div className="flex gap-2">
            {!isFormOpen && !isReordering && (
              <button
                onClick={() => setIsReordering(true)}
                className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Reorder Projects
              </button>
            )}

            {isReordering && (
              <>
                <button
                  onClick={() => { setIsReordering(false); fetchProjects(); }}
                  className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel Reorder
                </button>
                <button
                  onClick={handleSaveOrder}
                  className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                >
                  <Save size={18} className="mr-2" /> Save Order
                </button>
              </>
            )}

            {!isReordering && (
              <>
                {isFormOpen && (
                  <button
                    onClick={closeForm}
                    className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                )}
                <button
                  onClick={isFormOpen ? closeForm : openAdd}
                  className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  {isFormOpen ? "Close Form" : <><Plus size={18} className="mr-2" /> Add Project</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center mb-8 border-l-4 border-emerald-500 pl-4">
          <Briefcase size={28} className="text-emerald-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Portfolio Manager</h2>
        </div>

        {/* Add / Edit Form */}
        {isFormOpen && (
          <div className={`p-6 rounded-2xl border mb-8 fade-in ${isEditing ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {isEditing ? `Editing: ${formData.title || "Project"}` : "New Project Details"}
            </h3>
            {isEditing && (
              <p className="text-xs text-amber-700 mb-4">
                You are editing an existing project. Changes will overwrite the saved data.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">

              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Project Title" className="p-3 border rounded-xl" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <input required type="text" placeholder="Tag (e.g., Branding)" className="p-3 border rounded-xl" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />

                <select className="p-3 border rounded-xl" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Graphics">Graphics</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Branding">Branding</option>
                  <option value="Logo">Logo</option>
                  <option value="Video">Video</option>
                  <option value="Publication">Publication</option>
                  <option value="Presentation">Presentation</option>
                </select>

                <select className="p-3 border rounded-xl" value={formData.mediaType} onChange={e => setFormData({ ...formData, mediaType: e.target.value })}>
                  <option value="image">Image(s)</option>
                  <option value="video">Video URL</option>
                  <option value="figma">Figma Embed</option>
                  <option value="googleslides">Google Slides Embed</option>
                  <option value="presentation">Presentation Images</option>
                </select>
              </div>

              <textarea required placeholder="Short Description" className="w-full p-3 border rounded-xl" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea required placeholder="Media URLs / Embed Link (If multiple images, separate with commas)" className="w-full p-3 border rounded-xl h-24" value={formData.media} onChange={e => setFormData({ ...formData, media: e.target.value })} />
                <textarea placeholder="Cover Image URL (Optional, best for Figma/Video thumbnails)" className="w-full p-3 border rounded-xl h-24" value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea placeholder="Challenge (Optional)" className="p-3 border rounded-xl text-sm" value={formData.challenge} onChange={e => setFormData({ ...formData, challenge: e.target.value })} />
                <textarea placeholder="Process (Optional)" className="p-3 border rounded-xl text-sm" value={formData.process} onChange={e => setFormData({ ...formData, process: e.target.value })} />
                <textarea placeholder="Outcome (Optional)" className="p-3 border rounded-xl text-sm" value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })} />
              </div>

              {/* CONDITIONAL: LOGO FIELDS */}
              {formData.category === "Logo" && (
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 mt-4 fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-emerald-800">Logo Concepts</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        logoConcepts: [...formData.logoConcepts, { title: "", description: "", primaryImage: "", colorsStr: "", fontsStr: "", mockupsStr: "" }]
                      })}
                      className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold hover:bg-emerald-300 transition-colors"
                    >
                      + Add Concept
                    </button>
                  </div>

                  {formData.logoConcepts.length === 0 && (
                    <p className="text-sm text-emerald-700 italic">No concepts added yet. Click &quot;Add Concept&quot; to start.</p>
                  )}

                  {formData.logoConcepts.map((concept, index) => (
                    <div key={index} className="p-4 bg-white border border-emerald-200 rounded-lg relative space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          const newConcepts = [...formData.logoConcepts];
                          newConcepts.splice(index, 1);
                          setFormData({ ...formData, logoConcepts: newConcepts });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder={`Concept ${index + 1} Title`}
                          className="p-3 border rounded-xl"
                          value={concept.title}
                          onChange={e => {
                            const newConcepts = [...formData.logoConcepts];
                            newConcepts[index].title = e.target.value;
                            setFormData({ ...formData, logoConcepts: newConcepts });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Colors (e.g. #000, #FFF)"
                          className="p-3 border rounded-xl"
                          value={concept.colorsStr}
                          onChange={e => {
                            const newConcepts = [...formData.logoConcepts];
                            newConcepts[index].colorsStr = e.target.value;
                            setFormData({ ...formData, logoConcepts: newConcepts });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Fonts (e.g. Inter, Roboto)"
                          className="p-3 border rounded-xl"
                          value={concept.fontsStr}
                          onChange={e => {
                            const newConcepts = [...formData.logoConcepts];
                            newConcepts[index].fontsStr = e.target.value;
                            setFormData({ ...formData, logoConcepts: newConcepts });
                          }}
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Primary Concept Image URL (Main Media Image)"
                        className="w-full p-3 border rounded-xl text-sm"
                        value={concept.primaryImage}
                        onChange={e => {
                          const newConcepts = [...formData.logoConcepts];
                          newConcepts[index].primaryImage = e.target.value;
                          setFormData({ ...formData, logoConcepts: newConcepts });
                        }}
                      />

                      <textarea
                        placeholder="Concept Description (Optional)"
                        className="w-full p-3 border rounded-xl text-sm"
                        value={concept.description}
                        onChange={e => {
                          const newConcepts = [...formData.logoConcepts];
                          newConcepts[index].description = e.target.value;
                          setFormData({ ...formData, logoConcepts: newConcepts });
                        }}
                      />
                      <textarea
                        placeholder="Mockup Image URLs (comma separated)"
                        className="w-full p-3 border rounded-xl text-sm"
                        value={concept.mockupsStr}
                        onChange={e => {
                          const newConcepts = [...formData.logoConcepts];
                          newConcepts[index].mockupsStr = e.target.value;
                          setFormData({ ...formData, logoConcepts: newConcepts });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* CONDITIONAL: UI/UX CASE STUDY FIELDS */}
              {formData.category === "UI/UX" && (
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4 mt-4 fade-in">
                  <h4 className="font-bold text-blue-800">UI/UX Case Study Builder</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Role (e.g. Lead Designer)" className="p-3 border rounded-xl text-sm" value={formData.csRole} onChange={e => setFormData({ ...formData, csRole: e.target.value })} />
                    <input type="text" placeholder="Duration (e.g. 4 Weeks)" className="p-3 border rounded-xl text-sm" value={formData.csDuration} onChange={e => setFormData({ ...formData, csDuration: e.target.value })} />
                    <input type="text" placeholder="Tools (e.g. Figma, Miro)" className="p-3 border rounded-xl text-sm" value={formData.csToolsStr} onChange={e => setFormData({ ...formData, csToolsStr: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea placeholder="Problem Statement" className="p-3 border rounded-xl text-sm" value={formData.csProblemText} onChange={e => setFormData({ ...formData, csProblemText: e.target.value })} />
                    <textarea placeholder="Problem Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csProblemImagesStr} onChange={e => setFormData({ ...formData, csProblemImagesStr: e.target.value })} />

                    <textarea placeholder="User Research Text" className="p-3 border rounded-xl text-sm" value={formData.csResearchText} onChange={e => setFormData({ ...formData, csResearchText: e.target.value })} />
                    <textarea placeholder="Research Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csResearchImagesStr} onChange={e => setFormData({ ...formData, csResearchImagesStr: e.target.value })} />

                    <textarea placeholder="Wireframes Text" className="p-3 border rounded-xl text-sm" value={formData.csWireframesText} onChange={e => setFormData({ ...formData, csWireframesText: e.target.value })} />
                    <textarea placeholder="Wireframe Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csWireframeImagesStr} onChange={e => setFormData({ ...formData, csWireframeImagesStr: e.target.value })} />
                  </div>

                  <textarea placeholder="Key Takeaways / Learnings" className="w-full p-3 border rounded-xl text-sm" value={formData.csLearnings} onChange={e => setFormData({ ...formData, csLearnings: e.target.value })} />
                </div>
              )}

              <button
                type="submit"
                className={`w-full text-white font-bold py-4 mt-4 rounded-xl shadow-md transition-colors ${isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                {isEditing ? "Save Changes" : "Publish Project"}
              </button>
            </form>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={project._id}
                draggable={isReordering}
                onDragStart={(e) => isReordering && handleDragStart(e, idx)}
                onDragEnter={(e) => isReordering && handleDragEnter(e, idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => isReordering && handleDrop(e, idx)}
                className={`border rounded-2xl overflow-hidden bg-white flex flex-col transition-all duration-200
                  ${formMode === project._id ? "border-amber-400 ring-2 ring-amber-300" : "border-gray-200"}
                  ${isReordering ? "cursor-grab active:cursor-grabbing" : ""}
                  ${draggedIndex === idx ? "opacity-50 scale-95 shadow-inner" : "hover:shadow-lg"}
                  ${dragOverIndex === idx && draggedIndex !== idx ? "border-emerald-500 ring-4 ring-emerald-200 scale-105 z-10" : ""}
                `}
              >
                <div className={`h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden ${isReordering ? "pointer-events-none" : ""}`}>
                  {project.coverImage ? (
                    <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
                  ) : project.mediaType === "image" && project.media.length > 0 ? (
                    <Image src={Array.isArray(project.media) ? project.media[0] : (project.media as string)} alt={project.title} fill className="object-cover" unoptimized />
                  ) : (
                    <ImageIcon className="text-gray-300" size={48} />
                  )}
                  <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded-md z-10">{project.category}</span>

                  {isReordering && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-5xl font-black opacity-50">#{idx + 1}</span>
                    </div>
                  )}
                </div>

                <div className={`p-4 flex flex-col flex-grow ${isReordering ? "pointer-events-none" : ""}`}>
                  <h3 className="font-bold text-gray-900 mb-1 truncate">{project.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{project.description}</p>

                  <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center pointer-events-auto">
                    <span className="text-xs font-semibold text-gray-400">
                      {project.category === "Logo" && "Branding"}
                      {project.category === "UI/UX" && "Case Study"}
                    </span>
                    <div className="flex gap-3">
                      {isReordering ? (
                        <div className="text-gray-400 flex items-center gap-1 font-semibold text-sm">
                          <GripVertical size={16} /> Drag
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => openEdit(project)}
                            className="text-amber-500 hover:text-amber-700 text-sm font-bold flex items-center"
                          >
                            <Pencil size={15} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project._id!, project.title)}
                            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center"
                          >
                            <Trash2 size={15} className="mr-1" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}