import { FormState } from "./types";

type Props = {
  formData: FormState;
  onChange: (updated: Partial<FormState>) => void;
};

export default function CaseStudySection({ formData, onChange }: Props) {
  const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    onChange({ [field]: e.target.value });

  return (
    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4 mt-4 fade-in">
      <h4 className="font-bold text-blue-800">UI/UX Case Study Builder</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Role (e.g. Lead Designer)" className="p-3 border rounded-xl text-sm" value={formData.csRole} onChange={f("csRole")} />
        <input type="text" placeholder="Duration (e.g. 4 Weeks)" className="p-3 border rounded-xl text-sm" value={formData.csDuration} onChange={f("csDuration")} />
        <input type="text" placeholder="Tools (e.g. Figma, Miro)" className="p-3 border rounded-xl text-sm" value={formData.csToolsStr} onChange={f("csToolsStr")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea placeholder="Problem Statement" className="p-3 border rounded-xl text-sm" value={formData.csProblemText} onChange={f("csProblemText")} />
        <textarea placeholder="Problem Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csProblemImagesStr} onChange={f("csProblemImagesStr")} />

        <textarea placeholder="User Research Text" className="p-3 border rounded-xl text-sm" value={formData.csResearchText} onChange={f("csResearchText")} />
        <textarea placeholder="Research Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csResearchImagesStr} onChange={f("csResearchImagesStr")} />

        <textarea placeholder="Wireframes Text" className="p-3 border rounded-xl text-sm" value={formData.csWireframesText} onChange={f("csWireframesText")} />
        <textarea placeholder="Wireframe Images (URLs, comma separated)" className="p-3 border rounded-xl text-sm" value={formData.csWireframeImagesStr} onChange={f("csWireframeImagesStr")} />
      </div>

      <textarea placeholder="Key Takeaways / Learnings" className="w-full p-3 border rounded-xl text-sm" value={formData.csLearnings} onChange={f("csLearnings")} />
    </div>
  );
}
