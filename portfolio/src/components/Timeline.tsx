import { TimelineSection } from "@/types";

const Timeline: React.FC<{ sections: TimelineSection[] }> = ({ sections }) => {
  return (
    <div className="space-y-10">
      {sections.map((section, sectionIdx) => {
        // Detect if this is a section that needs highlighting
        const isHighlighted = 
          section.heading.toLowerCase().includes("certifications") || 
          section.heading.toLowerCase().includes("volunteer") || 
          section.heading.toLowerCase().includes("courses");

        return (
          <div key={sectionIdx}>
            <h4 
              className={`mb-5 ${
                isHighlighted 
                  ? "text-sm font-bold text-teal-700 bg-teal-50 inline-block px-4 py-1.5 rounded-lg border border-teal-100 uppercase tracking-wider" 
                  : "text-xl font-semibold text-gray-900"
              }`}
            >
              {section.heading}
            </h4>
            
            <div className="relative pl-6 border-l-2 border-gray-200">
              {section.entries.map((entry, entryIdx) => (
                <div key={entryIdx} className="mb-8 last:mb-0">
                  {/* All dots are permanently teal */}
                  <div className="absolute -left-[11px] top-1 h-5 w-5 bg-teal-500 rounded-full border-4 border-white"></div>
                  
                  <p className="text-sm text-gray-500 font-medium">{entry.date}</p>
                  <h5 className="font-bold text-gray-900 mt-1">{entry.title}</h5>

                  {/* This block checks if the description is an array and renders a list, otherwise it renders a paragraph. */}
                  {Array.isArray(entry.description) ? (
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                      {entry.description.map((point, pointIdx) => (
                        <li key={pointIdx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{entry.description}</p>
                  )}
                  
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;