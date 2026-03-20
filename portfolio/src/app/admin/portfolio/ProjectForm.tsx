import { FormState } from "./types";
import LogoConceptsSection from "./LogoConceptsSection";
import CaseStudySection from "./CaseStudySection";

type Props = {
  formData: FormState;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updated: Partial<FormState>) => void;
};

export default function ProjectForm({ formData, isEditing, onSubmit, onChange }: Props) {
  const f = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) =>
      onChange({ [field]: e.target.value });

  const inputClasses = "w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-colors";

  return (
    <div className={`p-6 rounded-2xl border mb-8 fade-in transition-colors duration-300 ${isEditing ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800"}`}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 transition-colors">
        {isEditing ? `Editing: ${formData.title || "Project"}` : "New Project Details"}
      </h3>
      {isEditing && (
        <p className="text-xs text-amber-700 dark:text-amber-500 mb-4 transition-colors">
          You are editing an existing project. Changes will overwrite the saved data.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4 mt-4">

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="text" placeholder="Project Title" className={inputClasses} value={formData.title} onChange={f("title")} />
          <input required type="text" placeholder="Tag (e.g., Branding)" className={inputClasses} value={formData.tag} onChange={f("tag")} />

          <select className={inputClasses} value={formData.category} onChange={f("category")}>
            <option value="Graphics">Graphics</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Branding">Branding</option>
            <option value="Logo">Logo</option>
            <option value="Video">Video</option>
            <option value="Publication">Publication</option>
            <option value="Presentation">Presentation</option>
          </select>

          <select className={inputClasses} value={formData.mediaType} onChange={f("mediaType")}>
            <option value="image">Image(s)</option>
            <option value="video">Video URL</option>
            <option value="figma">Figma Embed</option>
            <option value="googleslides">Google Slides Embed</option>
            <option value="presentation">Presentation Images</option>
          </select>
        </div>

        <textarea required placeholder="Short Description" className={`${inputClasses} resize-y`} value={formData.description} onChange={f("description")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea required placeholder="Media URLs / Embed Link (If multiple images, separate with commas)" className={`${inputClasses} h-24 resize-y`} value={formData.media} onChange={f("media")} />
          <textarea placeholder="Cover Image URL (Optional, best for Figma/Video thumbnails)" className={`${inputClasses} h-24 resize-y`} value={formData.coverImage} onChange={f("coverImage")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <textarea placeholder="Challenge (Optional)" className={`${inputClasses} text-sm resize-y`} value={formData.challenge} onChange={f("challenge")} />
          <textarea placeholder="Process (Optional)" className={`${inputClasses} text-sm resize-y`} value={formData.process} onChange={f("process")} />
          <textarea placeholder="Outcome (Optional)" className={`${inputClasses} text-sm resize-y`} value={formData.outcome} onChange={f("outcome")} />
        </div>

        {/* CONDITIONAL: LOGO */}
        {formData.category === "Logo" && (
          <LogoConceptsSection
            logoConcepts={formData.logoConcepts}
            onChange={(updated) => onChange({ logoConcepts: updated })}
          />
        )}

        {/* CONDITIONAL: UI/UX */}
        {formData.category === "UI/UX" && (
          <CaseStudySection formData={formData} onChange={onChange} />
        )}

        <button
          type="submit"
          className={`w-full text-white font-bold py-4 mt-4 rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isEditing ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500" : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"}`}
        >
          {isEditing ? "Save Changes" : "Publish Project"}
        </button>
      </form>
    </div>
  );
}