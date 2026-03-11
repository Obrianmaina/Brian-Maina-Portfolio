"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Building2, Plus, Trash2, Image as ImageIcon, GripVertical, Save, X, Pencil } from "lucide-react";
import AdminModal from "@/components/AdminModal";

type Showcase = {
  _id?: string;
  title: string; category: string; description: string; tag: string;
  mediaType: string; media: string | string[]; coverImage?: string;
  challenge?: string; process?: string; outcome?: string;
  brandDetails?: { colors?: string[]; mockups?: string[]; };
  caseStudy?: { role?: string; duration?: string; tools?: string[]; problemStatement?: string; problemImages?: string[]; userResearch?: string; researchImages?: string[]; wireframesText?: string; wireframesImages?: string[]; learnings?: string; };
};

type CompanyProject = {
  _id?: string;
  order?: number;
  companyName: string; companyLogo: string; disclaimer: string;
  projects: Showcase[]; 
};

export default function CorporateCMS() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic Form States
  type FormMode = 'closed' | 'add_company' | 'edit_company' | 'add_project' | 'edit_project';
  const [formMode, setFormMode] = useState<FormMode>('closed');
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  
  // Reorder States
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const initialFormState = {
    companyName: "", companyLogo: "", disclaimer: "The following work was created during my tenure. It is shared with permission for portfolio purposes only.",
    title: "", category: "Graphics", description: "", tag: "Corporate Work", mediaType: "image", media: "", coverImage: "", challenge: "", process: "", outcome: "",
    brandColorsStr: "", brandMockupsStr: "",
    csRole: "", csDuration: "", csToolsStr: "", csProblemText: "", csProblemImagesStr: "", csResearchText: "", csResearchImagesStr: "", csWireframesText: "", csWireframeImagesStr: "", csLearnings: ""
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/corporate");
      if (res.ok) setCompanies(await res.json());
    } catch (error) {
      console.error("Failed to fetch corporate entries");
    } finally { setLoading(false); }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  // Form Population Helper
  const showcaseToFormState = (p: Showcase) => {
    const joinArr = (arr?: string[]) => arr?.join(", ") ?? "";
    const mediaStr = Array.isArray(p.media) ? p.media.join(", ") : (p.media ?? "");
    return {
      ...initialFormState,
      title: p.title ?? "", category: p.category ?? "Graphics", description: p.description ?? "", tag: p.tag ?? "",
      mediaType: p.mediaType ?? "image", media: mediaStr, coverImage: p.coverImage ?? "",
      challenge: p.challenge ?? "", process: p.process ?? "", outcome: p.outcome ?? "",
      brandColorsStr: joinArr(p.brandDetails?.colors), brandMockupsStr: joinArr(p.brandDetails?.mockups),
      csRole: p.caseStudy?.role ?? "", csDuration: p.caseStudy?.duration ?? "", csToolsStr: joinArr(p.caseStudy?.tools),
      csProblemText: p.caseStudy?.problemStatement ?? "", csProblemImagesStr: joinArr(p.caseStudy?.problemImages),
      csResearchText: p.caseStudy?.userResearch ?? "", csResearchImagesStr: joinArr(p.caseStudy?.researchImages),
      csWireframesText: p.caseStudy?.wireframesText ?? "", csWireframeImagesStr: joinArr(p.caseStudy?.wireframesImages),
      csLearnings: p.caseStudy?.learnings ?? "",
    };
  };

  // ACTION HANDLERS
  const handleOpenAddCompany = () => {
    setFormData(initialFormState);
    setFormMode('add_company');
    setIsReordering(false);
  };

  const handleOpenEditCompany = (company: CompanyProject) => {
    setFormData({ ...initialFormState, companyName: company.companyName, companyLogo: company.companyLogo, disclaimer: company.disclaimer });
    setActiveCompanyId(company._id!);
    setFormMode('edit_company');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddProject = (company: CompanyProject) => {
    setFormData(initialFormState);
    setActiveCompanyId(company._id!);
    setFormMode('add_project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditProject = (company: CompanyProject, project: Showcase, idx: number) => {
    setFormData(showcaseToFormState(project));
    setActiveCompanyId(company._id!);
    setActiveProjectIndex(idx);
    setFormMode('edit_project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const splitAndTrim = (str: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

      let projectPayload: Partial<Showcase> | null = null;
      
      // Build project payload if we aren't JUST editing the company info
      if (formMode !== 'edit_company') {
        projectPayload = { 
          title: formData.title, category: formData.category, description: formData.description, tag: formData.tag, mediaType: formData.mediaType, challenge: formData.challenge, process: formData.process, outcome: formData.outcome,
          media: formData.mediaType === 'image' && typeof formData.media === 'string' ? splitAndTrim(formData.media) : formData.media 
        };
        if (formData.coverImage) projectPayload.coverImage = formData.coverImage;
        if (formData.category === 'Logo') projectPayload.brandDetails = { colors: splitAndTrim(formData.brandColorsStr), mockups: splitAndTrim(formData.brandMockupsStr) };
        if (formData.category === 'UI/UX') projectPayload.caseStudy = { role: formData.csRole, duration: formData.csDuration, tools: splitAndTrim(formData.csToolsStr), problemStatement: formData.csProblemText, problemImages: splitAndTrim(formData.csProblemImagesStr), userResearch: formData.csResearchText, researchImages: splitAndTrim(formData.csResearchImagesStr), wireframesText: formData.csWireframesText, wireframesImages: splitAndTrim(formData.csWireframeImagesStr), learnings: formData.csLearnings };
      }

      let method = "PUT";
      let bodyPayload: Partial<CompanyProject> = {};

      if (formMode === 'add_company') {
        method = "POST";
        bodyPayload = { 
          companyName: formData.companyName, companyLogo: formData.companyLogo, disclaimer: formData.disclaimer, 
          projects: projectPayload ? [projectPayload as Showcase] : [] 
        };
      } else if (formMode === 'edit_company') {
        bodyPayload = { _id: activeCompanyId || undefined, companyName: formData.companyName, companyLogo: formData.companyLogo, disclaimer: formData.disclaimer };
      } else if (formMode === 'add_project') {
        const company = companies.find(c => c._id === activeCompanyId);
        bodyPayload = { _id: activeCompanyId || undefined, projects: [...(company?.projects || []), projectPayload as Showcase] };
      } else if (formMode === 'edit_project') {
        const company = companies.find(c => c._id === activeCompanyId);
        const newProjects = [...(company?.projects || [])];
        if (activeProjectIndex !== null) newProjects[activeProjectIndex] = projectPayload as Showcase;
        bodyPayload = { _id: activeCompanyId || undefined, projects: newProjects };
      }

      const res = await fetch("/api/admin/corporate", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyPayload) });

      if (res.ok) {
        setModal({ show: true, type: 'success', title: 'Success', message: 'Corporate portfolio updated successfully!' });
        setFormMode('closed'); setFormData(initialFormState); fetchCompanies();
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to save changes.' });
      }
    } catch (error) { setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' }); }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Corporate Entry', message: `Are you sure you want to delete "${name}" and all its nested projects?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/corporate", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        if (res.ok) { setCompanies(companies.filter(c => c._id !== id)); setModal({ show: false, type: 'success', title: '', message: '' }); }
      }
    });
  };

  const handleDeleteProject = async (companyId: string, projectIdx: number, projectTitle: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Project', message: `Remove "${projectTitle}" from this company?`,
      onConfirm: async () => {
        const company = companies.find(c => c._id === companyId);
        if (!company) return;
        
        // Remove project from array and update document
        const newProjects = company.projects.filter((_, idx) => idx !== projectIdx);
        const res = await fetch("/api/admin/corporate", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id: companyId, projects: newProjects }) });
        if (res.ok) { fetchCompanies(); setModal({ show: false, type: 'success', title: '', message: '' }); }
      }
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
    if (index !== draggedIndex) setDragOverIndex(index);
  };
  const handleDragEnd = () => { setDraggedIndex(null); setDragOverIndex(null); };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newItems = [...companies];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setCompanies(newItems);
    setDraggedIndex(null); setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    const orderData = companies.map((c, index) => ({ _id: c._id, order: index }));
    try {
      const res = await fetch("/api/admin/corporate", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: "Corporate order updated successfully!" });
        setIsReordering(false); fetchCompanies();
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to update order." });
      }
    } catch { setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." }); }
  };

  const isFormOpen = formMode !== 'closed';
  const showCompanyFields = formMode === 'add_company' || formMode === 'edit_company';
  const showProjectFields = formMode === 'add_company' || formMode === 'add_project' || formMode === 'edit_project';

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
          <div className="flex gap-2">
            {!isFormOpen && !isReordering && (
              <button onClick={() => setIsReordering(true)} className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Reorder
              </button>
            )}

            {isReordering && (
              <>
                <button onClick={() => { setIsReordering(false); fetchCompanies(); }} className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveOrder} className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors">
                  <Save size={18} className="mr-2" /> Save Order
                </button>
              </>
            )}

            {!isReordering && (
              <>
                {isFormOpen ? (
                  <button onClick={() => { setFormMode('closed'); setFormData(initialFormState); }} className="flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                    <X size={16} className="mr-1"/> Cancel
                  </button>
                ) : (
                  <button onClick={handleOpenAddCompany} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                    <Plus size={18} className="mr-2" /> Add Company
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center mb-8 border-l-4 border-violet-500 pl-4">
          <Building2 size={28} className="text-violet-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Corporate Manager</h2>
        </div>

        {/* Add / Edit Form */}
        {isFormOpen && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {formMode === 'add_company' && "New Corporate Profile"}
              {formMode === 'edit_company' && "Edit Corporate Profile"}
              {formMode === 'add_project' && "Add Project to Company"}
              {formMode === 'edit_project' && "Edit Project"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* COMPANY DETAILS */}
              {showCompanyFields && (
                <div className="bg-violet-50/50 p-5 rounded-xl border border-violet-100 space-y-4 mb-6">
                  <h4 className="font-bold text-violet-800">Company Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Company Name" className="p-3 border rounded-xl" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                    <input required type="text" placeholder="Company Logo URL" className="p-3 border rounded-xl" value={formData.companyLogo} onChange={e => setFormData({...formData, companyLogo: e.target.value})} />
                  </div>
                  <textarea required placeholder="Disclaimer" className="w-full p-3 border rounded-xl h-20 text-sm" value={formData.disclaimer} onChange={e => setFormData({...formData, disclaimer: e.target.value})} />
                </div>
              )}

              {/* PROJECT DETAILS */}
              {showProjectFields && (
                <>
                  <h4 className="font-bold text-gray-800 border-b pb-2 mt-8">Project Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Project Title" className="p-3 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <input required type="text" placeholder="Tag (e.g., Corporate Work)" className="p-3 border rounded-xl" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                    <select className="p-3 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Graphics">Graphics</option><option value="UI/UX">UI/UX</option><option value="Branding">Branding</option><option value="Logo">Logo</option><option value="Video">Video</option><option value="Publication">Publication</option><option value="Presentation">Presentation</option>
                    </select>
                    <select className="p-3 border rounded-xl" value={formData.mediaType} onChange={e => setFormData({...formData, mediaType: e.target.value})}>
                      <option value="image">Image(s)</option><option value="video">Video URL</option><option value="figma">Figma Embed</option><option value="googleslides">Google Slides Embed</option><option value="presentation">Presentation Images</option>
                    </select>
                  </div>

                  <textarea required placeholder="Short Description" className="w-full p-3 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea required placeholder="Media URLs / Embed Link" className="w-full p-3 border rounded-xl h-24" value={formData.media as string} onChange={e => setFormData({...formData, media: e.target.value})} />
                    <textarea placeholder="Cover Image URL (Optional)" className="w-full p-3 border rounded-xl h-24" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <textarea placeholder="Challenge (Optional)" className="p-3 border rounded-xl text-sm" value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} />
                    <textarea placeholder="Process (Optional)" className="p-3 border rounded-xl text-sm" value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} />
                    <textarea placeholder="Outcome (Optional)" className="p-3 border rounded-xl text-sm" value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} />
                  </div>

                  {formData.category === 'Logo' && (
                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 mt-4 fade-in">
                      <h4 className="font-bold text-emerald-800">Logo Presentation Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Brand Hex Colors (e.g. #000000, #FFFFFF)" className="p-3 border rounded-xl" value={formData.brandColorsStr} onChange={e => setFormData({...formData, brandColorsStr: e.target.value})} />
                        <textarea placeholder="Mockup Image URLs (comma separated)" className="p-3 border rounded-xl" value={formData.brandMockupsStr} onChange={e => setFormData({...formData, brandMockupsStr: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {formData.category === 'UI/UX' && (
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4 mt-4 fade-in">
                      <h4 className="font-bold text-blue-800">UI/UX Case Study Builder</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Role (e.g. Lead Designer)" className="p-3 border rounded-xl text-sm" value={formData.csRole} onChange={e => setFormData({...formData, csRole: e.target.value})} />
                        <input type="text" placeholder="Duration (e.g. 4 Weeks)" className="p-3 border rounded-xl text-sm" value={formData.csDuration} onChange={e => setFormData({...formData, csDuration: e.target.value})} />
                        <input type="text" placeholder="Tools (e.g. Figma, Miro)" className="p-3 border rounded-xl text-sm" value={formData.csToolsStr} onChange={e => setFormData({...formData, csToolsStr: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea placeholder="Problem Statement" className="p-3 border rounded-xl text-sm" value={formData.csProblemText} onChange={e => setFormData({...formData, csProblemText: e.target.value})} />
                        <textarea placeholder="Problem Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csProblemImagesStr} onChange={e => setFormData({...formData, csProblemImagesStr: e.target.value})} />
                        <textarea placeholder="User Research Text" className="p-3 border rounded-xl text-sm" value={formData.csResearchText} onChange={e => setFormData({...formData, csResearchText: e.target.value})} />
                        <textarea placeholder="Research Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csResearchImagesStr} onChange={e => setFormData({...formData, csResearchImagesStr: e.target.value})} />
                        <textarea placeholder="Wireframes Text" className="p-3 border rounded-xl text-sm" value={formData.csWireframesText} onChange={e => setFormData({...formData, csWireframesText: e.target.value})} />
                        <textarea placeholder="Wireframe Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csWireframeImagesStr} onChange={e => setFormData({...formData, csWireframeImagesStr: e.target.value})} />
                      </div>
                      <textarea placeholder="Key Takeaways / Learnings" className="w-full p-3 border rounded-xl text-sm" value={formData.csLearnings} onChange={e => setFormData({...formData, csLearnings: e.target.value})} />
                    </div>
                  )}
                </>
              )}

              <button type="submit" className="w-full bg-violet-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-violet-700 shadow-md">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading corporate profiles...</p>
        ) : (
          <div className="space-y-6">
            {companies.map((company, idx) => (
              <div 
                key={company._id} 
                draggable={isReordering}
                onDragStart={(e) => isReordering && handleDragStart(e, idx)}
                onDragEnter={(e) => isReordering && handleDragEnter(e, idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => isReordering && handleDrop(e, idx)}
                className={`border rounded-2xl p-6 bg-white transition-all duration-200 
                  ${isReordering ? "cursor-grab active:cursor-grabbing border-gray-300" : "border-gray-200 hover:shadow-md"}
                  ${draggedIndex === idx ? "opacity-50 scale-95 shadow-inner" : ""}
                  ${dragOverIndex === idx && draggedIndex !== idx ? "border-violet-500 ring-4 ring-violet-200 scale-105 z-10" : ""}
                `}
              >
                <div className={`flex justify-between items-start mb-4 ${isReordering ? "pointer-events-none" : ""}`}>
                  <div className="flex items-center gap-4">
                    {isReordering && <GripVertical className="text-gray-400 mr-2" />}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {company.companyLogo ? ( <Image src={company.companyLogo} alt={company.companyName} fill className="object-contain p-2" unoptimized /> ) : ( <ImageIcon className="text-gray-300" size={24} /> )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{company.companyName}</h3>
                      {!isReordering && (
                        <div className="flex gap-4 mt-1">
                          <button onClick={() => handleOpenAddProject(company)} className="text-sm text-violet-600 hover:text-violet-800 font-semibold flex items-center">
                            + Add Project
                          </button>
                          <button onClick={() => handleOpenEditCompany(company)} className="text-sm text-amber-500 hover:text-amber-700 font-semibold flex items-center">
                            <Pencil size={14} className="mr-1" /> Edit Profile
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isReordering && (
                    <button onClick={() => handleDeleteCompany(company._id!, company.companyName)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center bg-red-50 px-3 py-1.5 rounded-lg">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  )}
                </div>
                <p className={`text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6 ${isReordering ? "pointer-events-none" : ""}`}>{company.disclaimer}</p>
                
                {/* Nested Projects Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isReordering ? "pointer-events-none opacity-60" : ""}`}>
                  {company.projects && company.projects.map((project, pIdx) => (
                    <div key={pIdx} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                      <div className="h-24 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                        {project.coverImage ? ( <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized /> ) : project.mediaType === 'image' && project.media.length > 0 ? ( <Image src={Array.isArray(project.media) ? project.media[0] : (project.media as string)} alt={project.title} fill className="object-cover" unoptimized /> ) : ( <ImageIcon className="text-gray-300" size={24} /> )}
                        <span className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold rounded z-10">{project.category}</span>
                      </div>
                      <div className="p-3 flex flex-col flex-grow">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{project.title}</h4>
                        <div className="mt-auto border-t border-gray-200 pt-2 flex justify-between items-center pointer-events-auto">
                           <button onClick={() => handleOpenEditProject(company, project, pIdx)} className="text-amber-500 hover:text-amber-700 text-xs font-bold flex items-center">
                            <Pencil size={12} className="mr-1" /> Edit
                          </button>
                          <button onClick={() => handleDeleteProject(company._id!, pIdx, project.title)} className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center">
                            <Trash2 size={12} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {companies.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                No corporate profiles found. Add one to get started.
              </div>
            )}
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}