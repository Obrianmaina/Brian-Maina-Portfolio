"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Briefcase, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import AdminModal from "@/components/AdminModal";

// Expanded Type to include the Case Study, Brand Details, and Cover Image
type Showcase = {
  _id?: string;
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

export default function PortfolioCMS() {
  const router = useRouter();
  const [projects, setProjects] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Flat state to make managing the form inputs easier
  const initialFormState = {
    title: "", category: "Graphics", description: "", tag: "", mediaType: "image", media: "", coverImage: "", challenge: "", process: "", outcome: "",
    // Logo Specifics
    brandColorsStr: "", brandMockupsStr: "",
    // UI/UX Specifics
    csRole: "", csDuration: "", csToolsStr: "", csProblemText: "", csProblemImagesStr: "",
    csResearchText: "", csResearchImagesStr: "", csWireframesText: "", csWireframeImagesStr: "", csLearnings: ""
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) setProjects(await res.json());
    } catch (error) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Helper to turn comma-separated strings into clean arrays
      const splitAndTrim = (str: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

      const payload: Partial<Showcase> = { 
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tag: formData.tag,
        mediaType: formData.mediaType,
        challenge: formData.challenge,
        process: formData.process,
        outcome: formData.outcome,
        // Only convert media to array if it is an image type
        media: formData.mediaType === 'image' && typeof formData.media === 'string' 
          ? splitAndTrim(formData.media) 
          : formData.media 
      };

      if (formData.coverImage) payload.coverImage = formData.coverImage;

      // Inject Brand Details if Logo
      if (formData.category === 'Logo') {
        payload.brandDetails = {
          colors: splitAndTrim(formData.brandColorsStr),
          mockups: splitAndTrim(formData.brandMockupsStr)
        };
      }

      // Inject Case Study if UI/UX
      if (formData.category === 'UI/UX') {
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
          learnings: formData.csLearnings
        };
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({ show: true, type: 'success', title: 'Success', message: 'Project added to portfolio!' });
        setIsAdding(false);
        setFormData(initialFormState); // Reset form
        fetchProjects();
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to add project.' });
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Project', message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/portfolio", {
          method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setProjects(projects.filter(p => p._id !== id));
          setModal({ show: false, type: 'success', title: '', message: '' });
        }
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            {isAdding ? "Cancel" : <><Plus size={18} className="mr-2" /> Add Project</>}
          </button>
        </div>

        <div className="flex items-center mb-8 border-l-4 border-emerald-500 pl-4">
          <Briefcase size={28} className="text-emerald-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Portfolio Manager</h2>
        </div>

        {isAdding && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">New Project Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Project Title" className="p-3 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input required type="text" placeholder="Tag (e.g., Branding)" className="p-3 border rounded-xl" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                
                <select className="p-3 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Graphics">Graphics</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Branding">Branding</option>
                  <option value="Logo">Logo</option>
                  <option value="Video">Video</option>
                  <option value="Publication">Publication</option>
                  <option value="Presentation">Presentation</option>
                </select>

                <select className="p-3 border rounded-xl" value={formData.mediaType} onChange={e => setFormData({...formData, mediaType: e.target.value})}>
                  <option value="image">Image(s)</option>
                  <option value="video">Video URL</option>
                  <option value="figma">Figma Embed</option>
                  <option value="googleslides">Google Slides Embed</option>
                  <option value="presentation">Presentation Images</option>
                </select>
              </div>

              <textarea required placeholder="Short Description" className="w-full p-3 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea required placeholder="Media URLs / Embed Link (If multiple images, separate with commas)" className="w-full p-3 border rounded-xl h-24" value={formData.media as string} onChange={e => setFormData({...formData, media: e.target.value})} />
                <textarea placeholder="Cover Image URL (Optional, best for Figma/Video thumbnails)" className="w-full p-3 border rounded-xl h-24" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea placeholder="Challenge (Optional)" className="p-3 border rounded-xl text-sm" value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} />
                <textarea placeholder="Process (Optional)" className="p-3 border rounded-xl text-sm" value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} />
                <textarea placeholder="Outcome (Optional)" className="p-3 border rounded-xl text-sm" value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} />
              </div>

              {/* CONDITIONAL: LOGO FIELDS */}
              {formData.category === 'Logo' && (
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 mt-4 fade-in">
                  <h4 className="font-bold text-emerald-800">Logo Presentation Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Brand Hex Colors (e.g. #000000, #FFFFFF)" className="p-3 border rounded-xl" value={formData.brandColorsStr} onChange={e => setFormData({...formData, brandColorsStr: e.target.value})} />
                    <textarea placeholder="Mockup Image URLs (comma separated)" className="p-3 border rounded-xl" value={formData.brandMockupsStr} onChange={e => setFormData({...formData, brandMockupsStr: e.target.value})} />
                  </div>
                </div>
              )}

              {/* CONDITIONAL: UI/UX CASE STUDY FIELDS */}
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

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-emerald-700 shadow-md">Publish Project</button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {/* Next.js Image component replaces the standard img tag here */}
                  {project.coverImage ? (
                    <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
                  ) : project.mediaType === 'image' && project.media.length > 0 ? (
                    <Image src={Array.isArray(project.media) ? project.media[0] : (project.media as string)} alt={project.title} fill className="object-cover" unoptimized />
                  ) : (
                    <ImageIcon className="text-gray-300" size={48} />
                  )}
                  <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded-md z-10">{project.category}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">{project.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{project.description}</p>
                  <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400">
                      {project.category === 'Logo' && 'Branding'}
                      {project.category === 'UI/UX' && 'Case Study'}
                    </span>
                    <button onClick={() => handleDelete(project._id!, project.title)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
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