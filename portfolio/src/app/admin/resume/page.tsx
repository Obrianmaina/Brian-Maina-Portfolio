"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { TimelineSection, TimelineEntry } from "@/types";

// Create an extended type specifically for the admin panel so TypeScript knows _id exists
type AdminTimelineSection = TimelineSection & { _id: string };

export default function ResumeCMS() {
  const router = useRouter();
  
  // Use the new AdminTimelineSection type here
  const [experience, setExperience] = useState<AdminTimelineSection[]>([]);
  const [education, setEducation] = useState<AdminTimelineSection[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for forms
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills'>('experience');
  const [isAdding, setIsAdding] = useState(false);
  
  // Timeline Section Form
  const [heading, setHeading] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryDescription, setEntryDescription] = useState(""); 
  
  // Skills Form
  const [newSkill, setNewSkill] = useState("");

  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchResumeData(); }, []);

  const fetchResumeData = async () => {
    try {
      const res = await fetch("/api/admin/resume");
      if (res.ok) {
        const data = await res.json();
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const descArray = entryDescription.split('\n').map(s => s.trim()).filter(Boolean);
      const finalDescription = descArray.length === 1 ? descArray[0] : descArray;

      const payload = {
        section: activeTab, 
        heading: heading,
        entries: [{
          title: entryTitle,
          date: entryDate,
          description: finalDescription
        }],
        order: activeTab === 'experience' ? experience.length : education.length
      };

      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({ show: true, type: 'success', title: 'Success', message: `Added to ${activeTab}!` });
        setIsAdding(false);
        setHeading(""); setEntryTitle(""); setEntryDate(""); setEntryDescription("");
        fetchResumeData();
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to add entry.' });
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: 'skills', name: newSkill.trim() }),
      });
      if (res.ok) {
        setNewSkill("");
        fetchResumeData();
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to add skill.' });
    }
  };

  const handleDelete = async (id: string, section: string, titleName: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Entry', message: `Are you sure you want to delete "${titleName}"?`,
      onConfirm: async () => {
        const payload = section === 'skills' ? { section, name: titleName } : { section, id };
        const res = await fetch("/api/admin/resume", {
          method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchResumeData();
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
          {activeTab !== 'skills' && (
            <button onClick={() => setIsAdding(!isAdding)} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
              {isAdding ? "Cancel" : <><Plus size={18} className="mr-2" /> Add Entry</>}
            </button>
          )}
        </div>

        <div className="flex items-center mb-8 border-l-4 border-orange-500 pl-4">
          <GraduationCap size={28} className="text-orange-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Resume Manager</h2>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button onClick={() => { setActiveTab('experience'); setIsAdding(false); }} className={`pb-3 font-semibold px-2 transition-colors ${activeTab === 'experience' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-800'}`}>Experience</button>
          <button onClick={() => { setActiveTab('education'); setIsAdding(false); }} className={`pb-3 font-semibold px-2 transition-colors ${activeTab === 'education' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-800'}`}>Education</button>
          <button onClick={() => { setActiveTab('skills'); setIsAdding(false); }} className={`pb-3 font-semibold px-2 transition-colors ${activeTab === 'skills' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-800'}`}>Skills</button>
        </div>

        {/* ADD TIMELINE ENTRY FORM */}
        {isAdding && activeTab !== 'skills' && (
          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mb-8 fade-in">
            <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center capitalize">
              Add New {activeTab} 
            </h3>
            <p className="text-sm text-orange-600 mb-6">Tip: To create bullet points in the description, press Enter for a new line.</p>
            <form onSubmit={handleTimelineSubmit} className="space-y-4">
              <input required type="text" placeholder="Heading (e.g. SAP SE or Moi University)" className="w-full p-3 border rounded-xl" value={heading} onChange={e => setHeading(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Job Title / Degree" className="p-3 border rounded-xl" value={entryTitle} onChange={e => setEntryTitle(e.target.value)} />
                <input type="text" placeholder="Date (e.g. 2024 Sep - Present)" className="p-3 border rounded-xl" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
              </div>
              <textarea required placeholder="Description..." className="w-full p-3 border rounded-xl h-32" value={entryDescription} onChange={e => setEntryDescription(e.target.value)} />
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-orange-700 shadow-md">Save Entry</button>
            </form>
          </div>
        )}

        {/* LIST VIEW */}
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading {activeTab}...</p>
        ) : (
          <div>
            {/* TIMELINE RENDERER */}
            {(activeTab === 'experience' || activeTab === 'education') && (
              <div className="space-y-6">
                {/* Now we don't explicitly type 'section' in the map, TypeScript infers it from the state arrays */}
                {(activeTab === 'experience' ? experience : education).map((section) => (
                  <div key={section._id} className="border border-gray-200 rounded-2xl p-6 bg-white flex justify-between group hover:border-orange-200 transition-colors">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 inline-block">{section.heading}</h4>
                      {section.entries.map((entry: TimelineEntry, idx: number) => (
                        <div key={idx} className="mb-4">
                          <h5 className="font-semibold text-gray-800">{entry.title}</h5>
                          <p className="text-sm text-orange-600 mb-2 font-medium">{entry.date}</p>
                          {Array.isArray(entry.description) ? (
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                              {entry.description.map((item: string, i: number) => <li key={i}>{item}</li>)}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">{entry.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleDelete(section._id, activeTab, section.heading)} className="text-gray-300 hover:text-red-500 self-start p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {(activeTab === 'experience' ? experience : education).length === 0 && (
                   <p className="text-gray-500 italic text-center py-8">No {activeTab} data found.</p>
                )}
              </div>
            )}

            {/* SKILLS RENDERER */}
            {activeTab === 'skills' && (
              <div>
                <form onSubmit={handleAddSkill} className="flex gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input required type="text" placeholder="Add a new skill (e.g. Next.js, Figma)..." className="flex-grow p-3 border rounded-xl" value={newSkill} onChange={e => setNewSkill(e.target.value)} />
                  <button type="submit" className="bg-gray-900 text-white font-bold px-6 rounded-xl hover:bg-gray-800 shadow-sm whitespace-nowrap"><Plus size={20} className="inline mr-1" /> Add Skill</button>
                </form>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center bg-white border border-gray-200 rounded-full pl-4 pr-1 py-1 shadow-sm group">
                      <span className="text-sm font-medium text-gray-700 mr-2">{skill}</span>
                      <button onClick={() => handleDelete('', 'skills', skill)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors" title="Remove Skill">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}