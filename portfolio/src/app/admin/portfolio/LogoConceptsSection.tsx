import { X } from "lucide-react";
import { FormState, LogoConceptForm } from "./types";

type Props = {
  logoConcepts: LogoConceptForm[];
  onChange: (updated: LogoConceptForm[]) => void;
};

export default function LogoConceptsSection({ logoConcepts, onChange }: Props) {
  const addConcept = () =>
    onChange([...logoConcepts, { title: "", description: "", primaryImage: "", colorsStr: "", fontsStr: "", mockupsStr: "" }]);

  const removeConcept = (index: number) => {
    const next = [...logoConcepts];
    next.splice(index, 1);
    onChange(next);
  };

  const updateConcept = (index: number, field: keyof LogoConceptForm, value: string) => {
    const next = [...logoConcepts];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  return (
    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4 mt-4 fade-in">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-emerald-800">Logo Concepts</h4>
        <button
          type="button"
          onClick={addConcept}
          className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold hover:bg-emerald-300 transition-colors"
        >
          + Add Concept
        </button>
      </div>

      {logoConcepts.length === 0 && (
        <p className="text-sm text-emerald-700 italic">No concepts added yet. Click &quot;Add Concept&quot; to start.</p>
      )}

      {logoConcepts.map((concept, index) => (
        <div key={index} className="p-4 bg-white border border-emerald-200 rounded-lg relative space-y-3">
          <button
            type="button"
            onClick={() => removeConcept(index)}
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
              onChange={e => updateConcept(index, "title", e.target.value)}
            />
            <input
              type="text"
              placeholder="Colors (e.g. #000, #FFF)"
              className="p-3 border rounded-xl"
              value={concept.colorsStr}
              onChange={e => updateConcept(index, "colorsStr", e.target.value)}
            />
            <input
              type="text"
              placeholder="Fonts (e.g. Inter, Roboto)"
              className="p-3 border rounded-xl"
              value={concept.fontsStr}
              onChange={e => updateConcept(index, "fontsStr", e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Primary Concept Image URL (Main Media Image)"
            className="w-full p-3 border rounded-xl text-sm"
            value={concept.primaryImage}
            onChange={e => updateConcept(index, "primaryImage", e.target.value)}
          />

          <textarea
            placeholder="Concept Description (Optional)"
            className="w-full p-3 border rounded-xl text-sm"
            value={concept.description}
            onChange={e => updateConcept(index, "description", e.target.value)}
          />
          <textarea
            placeholder="Mockup Image URLs (comma separated)"
            className="w-full p-3 border rounded-xl text-sm"
            value={concept.mockupsStr}
            onChange={e => updateConcept(index, "mockupsStr", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
