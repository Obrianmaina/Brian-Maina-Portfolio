"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Building2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import AdminModal from "@/components/AdminModal";

// Define the Showcase type
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

type CompanyProject = {
  _id?: string;
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  projects: Showcase[]; 
};

export default function CorporateCMS() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const initialFormState = {
    // Company Fields
    companyName: "",
    companyLogo: "",
    disclaimer: "The following work was created during my tenure. It is shared with permission for portfolio purposes only.",
    // Project Fields
    title: "", category: "Graphics", description: "", tag: "Corporate Work", mediaType: "image", media: "", coverImage: "", challenge: "", process: "", outcome: "",
    // Logo Specifics
    brandColorsStr: "", brandMockupsStr: "",
    // UI/UX Specifics
    csRole: "", csDuration: "", csToolsStr: "", csProblemText: "", csProblemImagesStr: "",
    csResearchText: "", csResearchImagesStr: "", csWireframesText: "", csWireframeImagesStr: "", csLearnings: ""
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
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const splitAndTrim = (str: string) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

      const projectPayload: Partial<Showcase> = { 
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tag: formData.tag,
        mediaType: formData.mediaType,
        challenge: formData.challenge,
        process: formData.process,
        outcome: formData.outcome,
        media: formData.mediaType === 'image' && typeof formData.media === 'string' 
          ? splitAndTrim(formData.media) 
          : formData.media 
      };

      if (formData.coverImage) projectPayload.coverImage = formData.coverImage;

      if (formData.category === 'Logo') {
        projectPayload.brandDetails = {
          colors: splitAndTrim(formData.brandColorsStr),
          mockups: splitAndTrim(formData.brandMockupsStr)
        };
      }

      if (formData.category === 'UI/UX') {
        projectPayload.caseStudy = {
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

      const payload = { 
        companyName: formData.companyName,
        companyLogo: formData.companyLogo,
        disclaimer: formData.disclaimer,
        project: projectPayload
      };

      const res = await fetch("/api/admin/corporate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({ show: true, type: 'success', title: 'Success', message: 'Corporate entry added!' });
        setIsAdding(false);
        setFormData(initialFormState);
        fetchCompanies();
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to add corporate entry.' });
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Corporate Entry', message: `Are you sure you want to delete "${name}" and all its nested projects?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/corporate", {
          method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setCompanies(companies.filter(c => c._id !== id));
          setModal({ show: false, type: 'success', title: '', message: '' });
        }
      }
    });
  };

  const handleDeleteProject = async (companyId: string, projectTitle: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Project', message: `Remove "${projectTitle}" from this company?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/corporate", {
          method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: companyId, projectTitle }),
        });
        if (res.ok) {
          fetchCompanies();
          setModal({ show: false, type: 'success', title: '', message: '' });
        }
      }
    });
  };

  // Helper to pre-fill company details when adding to an existing company
  const selectExistingCompany = (company: CompanyProject) => {
    setFormData({ ...formData, companyName: company.companyName, companyLogo: company.companyLogo, disclaimer: company.disclaimer });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            {isAdding ? "Cancel" : <><Plus size={18} className="mr-2" /> Add Company</>}
          </button>
        </div>

        <div className="flex items-center mb-8 border-l-4 border-violet-500 pl-4">
          <Building2 size={28} className="text-violet-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Corporate Manager</h2>
        </div>

        {isAdding && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">New Corporate Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* COMPANY DETAILS */}
              <div className="bg-violet-50/50 p-5 rounded-xl border border-violet-100 space-y-4 mb-6">
                <h4 className="font-bold text-violet-800">Company Information</h4>
                <p className="text-sm text-violet-600 mb-2">Tip: Use the exact Company Name to add this project to an existing company profile.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Company Name" className="p-3 border rounded-xl" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  <input required type="text" placeholder="Company Logo URL" className="p-3 border rounded-xl" value={formData.companyLogo} onChange={e => setFormData({...formData, companyLogo: e.target.value})} />
                </div>
                <textarea required placeholder="Disclaimer" className="w-full p-3 border rounded-xl h-20 text-sm" value={formData.disclaimer} onChange={e => setFormData({...formData, disclaimer: e.target.value})} />
              </div>

              {/* PROJECT DETAILS */}
              <h4 className="font-bold text-gray-800 border-b pb-2 mt-8">Project Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Project Title" className="p-3 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input required type="text" placeholder="Tag (e.g., Corporate Work)" className="p-3 border rounded-xl" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                
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
                <textarea placeholder="Cover Image URL (Optional)" className="w-full p-3 border rounded-xl h-24" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
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

              <button type="submit" className="w-full bg-violet-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-violet-700 shadow-md">Create Corporate Profile & Project</button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading corporate profiles...</p>
        ) : (
          <div className="space-y-6">
            {companies.map((company) => (
              <div key={company._id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {company.companyLogo ? (
                         <Image src={company.companyLogo} alt={company.companyName} fill className="object-contain p-2" unoptimized />
                      ) : (
                        <ImageIcon className="text-gray-300" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{company.companyName}</h3>
                      <button onClick={() => selectExistingCompany(company)} className="text-sm text-violet-600 hover:text-violet-800 font-semibold mt-1">
                        + Add Project to this Company
                      </button>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCompany(company._id!, company.companyName)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center bg-red-50 px-3 py-1.5 rounded-lg">
                    <Trash2 size={16} className="mr-1" /> Delete Company
                  </button>
                </div>
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-gray-100 mb-6">{company.disclaimer}</p>
                
                {/* Nested Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.projects && company.projects.map((project, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                      <div className="h-24 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                        {project.coverImage ? (
                          <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
                        ) : project.mediaType === 'image' && project.media.length > 0 ? (
                          <Image src={Array.isArray(project.media) ? project.media[0] : (project.media as string)} alt={project.title} fill className="object-cover" unoptimized />
                        ) : (
                          <ImageIcon className="text-gray-300" size={24} />
                        )}
                        <span className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold rounded z-10">{project.category}</span>
                      </div>
                      <div className="p-3 flex flex-col flex-grow">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{project.title}</h4>
                        <div className="mt-auto border-t border-gray-200 pt-2 text-right">
                          <button onClick={() => handleDeleteProject(company._id!, project.title)} className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center justify-end w-full">
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