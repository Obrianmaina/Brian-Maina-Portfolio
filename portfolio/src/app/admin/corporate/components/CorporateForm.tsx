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

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{formTitle}</h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Company Details ─────────────────────────────────────────────── */}
        {showCompanyFields && (
          <div className="bg-violet-50/50 p-5 rounded-xl border border-violet-100 space-y-4 mb-6">
            <h4 className="font-bold text-violet-800">Company Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Company Name"
                className="p-3 border rounded-xl"
                value={formData.companyName}
                onChange={(e) => update({ companyName: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Company Logo URL"
                className="p-3 border rounded-xl"
                value={formData.companyLogo}
                onChange={(e) => update({ companyLogo: e.target.value })}
              />
            </div>
            <textarea
              required
              placeholder="Disclaimer"
              className="w-full p-3 border rounded-xl h-20 text-sm"
              value={formData.disclaimer}
              onChange={(e) => update({ disclaimer: e.target.value })}
            />
          </div>
        )}

        {/* ── Project Details ──────────────────────────────────────────────── */}
        {showProjectFields && (
          <>
            <h4 className="font-bold text-gray-800 border-b pb-2 mt-8">Project Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Project Title"
                className="p-3 border rounded-xl"
                value={formData.title}
                onChange={(e) => update({ title: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Tag (e.g., Corporate Work)"
                className="p-3 border rounded-xl"
                value={formData.tag}
                onChange={(e) => update({ tag: e.target.value })}
              />
              <select
                className="p-3 border rounded-xl"
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
                className="p-3 border rounded-xl"
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
              className="w-full p-3 border rounded-xl"
              value={formData.description}
              onChange={(e) => update({ description: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                required
                placeholder="Media URLs / Embed Link"
                className="w-full p-3 border rounded-xl h-24"
                value={formData.media}
                onChange={(e) => update({ media: e.target.value })}
              />
              <textarea
                placeholder="Cover Image URL (Optional)"
                className="w-full p-3 border rounded-xl h-24"
                value={formData.coverImage}
                onChange={(e) => update({ coverImage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <textarea
                placeholder="Challenge (Optional)"
                className="p-3 border rounded-xl text-sm"
                value={formData.challenge}
                onChange={(e) => update({ challenge: e.target.value })}
              />
              <textarea
                placeholder="Process (Optional)"
                className="p-3 border rounded-xl text-sm"
                value={formData.process}
                onChange={(e) => update({ process: e.target.value })}
              />
              <textarea
                placeholder="Outcome (Optional)"
                className="p-3 border rounded-xl text-sm"
                value={formData.outcome}
                onChange={(e) => update({ outcome: e.target.value })}
              />
            </div>

            {/* Logo Fields */}
            {formData.category === "Logo" && (
              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 mt-4 fade-in">
                <h4 className="font-bold text-emerald-800">Logo Presentation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Brand Hex Colors (e.g. #000000, #FFFFFF)"
                    className="p-3 border rounded-xl"
                    value={formData.brandColorsStr}
                    onChange={(e) => update({ brandColorsStr: e.target.value })}
                  />
                  <textarea
                    placeholder="Mockup Image URLs (comma separated)"
                    className="p-3 border rounded-xl"
                    value={formData.brandMockupsStr}
                    onChange={(e) => update({ brandMockupsStr: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* UI/UX Case Study Fields */}
            {formData.category === "UI/UX" && (
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4 mt-4 fade-in">
                <h4 className="font-bold text-blue-800">UI/UX Case Study Builder</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Designer)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csRole}
                    onChange={(e) => update({ csRole: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 4 Weeks)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csDuration}
                    onChange={(e) => update({ csDuration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Tools (e.g. Figma, Miro)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csToolsStr}
                    onChange={(e) => update({ csToolsStr: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    placeholder="Problem Statement"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csProblemText}
                    onChange={(e) => update({ csProblemText: e.target.value })}
                  />
                  <textarea
                    placeholder="Problem Images (URLs, comma separated)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csProblemImagesStr}
                    onChange={(e) => update({ csProblemImagesStr: e.target.value })}
                  />
                  <textarea
                    placeholder="User Research Text"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csResearchText}
                    onChange={(e) => update({ csResearchText: e.target.value })}
                  />
                  <textarea
                    placeholder="Research Images (URLs, comma separated)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csResearchImagesStr}
                    onChange={(e) => update({ csResearchImagesStr: e.target.value })}
                  />
                  <textarea
                    placeholder="Wireframes Text"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csWireframesText}
                    onChange={(e) => update({ csWireframesText: e.target.value })}
                  />
                  <textarea
                    placeholder="Wireframe Images (URLs, comma separated)"
                    className="p-3 border rounded-xl text-sm"
                    value={formData.csWireframeImagesStr}
                    onChange={(e) => update({ csWireframeImagesStr: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Key Takeaways / Learnings"
                  className="w-full p-3 border rounded-xl text-sm"
                  value={formData.csLearnings}
                  onChange={(e) => update({ csLearnings: e.target.value })}
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-violet-600 text-white font-bold py-4 mt-4 rounded-xl hover:bg-violet-700 shadow-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}