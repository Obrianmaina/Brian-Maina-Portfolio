import { TimelineSection } from "@/types";

const Timeline: React.FC<{ sections: TimelineSection[] }> = ({ sections }) => {
  return (
    <div className="space-y-8">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          <h4 className="text-xl font-semibold mb-4">{section.heading}</h4>
          <div className="relative pl-6 border-l-2 border-gray-200">
            {section.entries.map((entry, entryIdx) => (
              <div key={entryIdx} className="mb-8 last:mb-0">
                <div className="absolute -left-[11px] top-1 h-5 w-5 bg-teal-500 rounded-full border-4 border-white"></div>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <h5 className="font-medium mt-1">{entry.title}</h5>
                <p className="text-sm text-gray-700 mt-1">{entry.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

