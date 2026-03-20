import { FormData, FormMode } from "../types";

type Props = {
  formMode: FormMode;
  formData: FormData;
  setFormData: (data: FormData) => void;
  showCompanyFields: boolean;
  showProjectFields: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CorporateForm({
  formMode,
  formData,
  setFormData,
  showCompanyFields,
  showProjectFields,
  onSubmit,
}: Props) {
  const update = (patch: Partial<FormData>) => setFormData({ ...formData, ...patch });

  const formTitle = {
    add_company: "New Corporate Profile",
    edit_company: "Edit Corporate Profile",
    add_project: "Add Project to Company",
    edit_project: "Edit Project",
    closed: "",
  }[formMode];

  const inputClasses = "w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-colors";

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 mb-8 fade-in transition-colors duration-300">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">{formTitle}</h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Company Details ─────────────────────────────────────────────── */}
        {showCompanyFields && (
          <div className="bg-violet-50/50 dark:bg-violet-900/20 p-5 rounded-xl border border-violet-100 dark:border-violet-900/50 space-y-4 mb-6 transition-colors">
            <h4 className="font-bold text-violet-800 dark:text-violet-400 transition-colors">Company Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Company Name"
                className={inputClasses}
                value={formData.companyName}
                onChange={(e) => update({ companyName: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Company Logo URL"
                className={inputClasses}
                value={formData.companyLogo}
                onChange={(e) => update({ companyLogo: e.target.value })}
              />
            </div>
            <textarea
              required
              placeholder="Disclaimer"
              className={`${inputClasses} h-20 text-sm resize-y`}
              value={formData.disclaimer}
              onChange={(e) => update({ disclaimer: e.target.value })}
            />
          </div>
        )}

        {/* ── Project Details ──────────────────────────────────────────────── */}
        {showProjectFields && (
          <>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mt-8 transition-colors">Project Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Project Title"
                className={inputClasses}
                value={formData.title}
                onChange={(e) => update({ title: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Tag (e.g., Corporate Work)"
                className={inputClasses}
                value={formData.tag}
                onChange={(e) => update({ tag: e.target.value })}
              />
              <select
                className={inputClasses}
                value={formData.category}
                onChange={(e) => update({ category: e.target.value })}
              >
                <option value="Graphics">Graphics</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Branding">Branding</option>
                <option value="Logo">Logo</option>
                <option value="Video">Video</option>
                <option value="Publication">Publication</option>
                <option value="Presentation">Presentation</option>
              </select>
              <select
                className={inputClasses}
                value={formData.mediaType}
                onChange={(e) => update({ mediaType: e.target.value })}
              >
                <option value="image">Image(s)</option>
                <option value="video">Video URL</option>
                <option value="figma">Figma Embed</option>
                <option value="googleslides">Google Slides Embed</option>
                <option value="presentation">Presentation Images</option>
              </select>
            </div>

            <textarea
              required
              placeholder="Short Description"
              className={`${inputClasses} resize-y`}
              value={formData.description}
              onChange={(e) => update({ description: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                required
                placeholder="Media URLs / Embed Link"
                className={`${inputClasses} h-24 resize-y`}
                value={formData.media}
                onChange={(e) => update({ media: e.target.value })}
              />
              <textarea
                placeholder="Cover Image URL (Optional)"
                className={`${inputClasses} h-24 resize-y`}
                value={formData.coverImage}
                onChange={(e) => update({ coverImage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <textarea
                placeholder="Challenge (Optional)"
                className={`${inputClasses} text-sm resize-y`}
                value={formData.challenge}
                onChange={(e) => update({ challenge: e.target.value })}
              />
              <textarea
                placeholder="Process (Optional)"
                className={`${inputClasses} text-sm resize-y`}
                value={formData.process}
                onChange={(e) => update({ process: e.target.value })}
              />
              <textarea
                placeholder="Outcome (Optional)"
                className={`${inputClasses} text-sm resize-y`}
                value={formData.outcome}
                onChange={(e) => update({ outcome: e.target.value })}
              />
            </div>

            {/* Logo Fields */}
            {formData.category === "Logo" && (
              <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-4 mt-4 fade-in transition-colors">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 transition-colors">Logo Presentation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Brand Hex Colors (e.g. #000000, #FFFFFF)"
                    className={inputClasses}
                    value={formData.brandColorsStr}
                    onChange={(e) => update({ brandColorsStr: e.target.value })}
                  />
                  <textarea
                    placeholder="Mockup Image URLs (comma separated)"
                    className={`${inputClasses} resize-y`}
                    value={formData.brandMockupsStr}
                    onChange={(e) => update({ brandMockupsStr: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* UI/UX Case Study Fields */}
            {formData.category === "UI/UX" && (
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-4 mt-4 fade-in transition-colors">
                <h4 className="font-bold text-blue-800 dark:text-blue-400 transition-colors">UI/UX Case Study Builder</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Designer)"
                    className={`${inputClasses} text-sm`}
                    value={formData.csRole}
                    onChange={(e) => update({ csRole: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 4 Weeks)"
                    className={`${inputClasses} text-sm`}
                    value={formData.csDuration}
                    onChange={(e) => update({ csDuration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Tools (e.g. Figma, Miro)"
                    className={`${inputClasses} text-sm`}
                    value={formData.csToolsStr}
                    onChange={(e) => update({ csToolsStr: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    placeholder="Problem Statement"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csProblemText}
                    onChange={(e) => update({ csProblemText: e.target.value })}
                  />
                  <textarea
                    placeholder="Problem Images (URLs, comma separated)"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csProblemImagesStr}
                    onChange={(e) => update({ csProblemImagesStr: e.target.value })}
                  />
                  <textarea
                    placeholder="User Research Text"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csResearchText}
                    onChange={(e) => update({ csResearchText: e.target.value })}
                  />
                  <textarea
                    placeholder="Research Images (URLs, comma separated)"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csResearchImagesStr}
                    onChange={(e) => update({ csResearchImagesStr: e.target.value })}
                  />
                  <textarea
                    placeholder="Wireframes Text"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csWireframesText}
                    onChange={(e) => update({ csWireframesText: e.target.value })}
                  />
                  <textarea
                    placeholder="Wireframe Images (URLs, comma separated)"
                    className={`${inputClasses} text-sm resize-y`}
                    value={formData.csWireframeImagesStr}
                    onChange={(e) => update({ csWireframeImagesStr: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Key Takeaways / Learnings"
                  className={`${inputClasses} text-sm resize-y`}
                  value={formData.csLearnings}
                  onChange={(e) => update({ csLearnings: e.target.value })}
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-violet-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-violet-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}