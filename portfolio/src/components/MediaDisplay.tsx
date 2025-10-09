import { useState } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Showcase } from "@/types";

const MediaDisplay: React.FC<{ project: Showcase }> = ({ project }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (project.mediaType === "image" || project.mediaType === "presentation") {
    const media = Array.isArray(project.media) ? project.media : [project.media];
    return (
      <div className="relative">
        <Image
          src={media[currentSlide]}
          alt={`${project.title} slide ${currentSlide + 1}`}
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl bg-gray-200"
          priority
        />
        {media.length > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {media.length}
            </span>
            <button
              onClick={() => setCurrentSlide(Math.min(media.length - 1, currentSlide + 1))}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (project.mediaType === "video") {
    return (
      <div className="relative w-full">
        <video
          src={project.media as string}
          controls
          className="w-full h-auto rounded-xl"
          controlsList="nodownload"
        />
      </div>
    );
  }

  if (project.mediaType === "figma" || project.mediaType === "googleslides") {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-gray-300 border-t-teal-500 rounded-full"
            />
            <p className="text-sm text-gray-600 ml-4">Loading interactive preview...</p>
          </div>
        )}
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
          src={project.media as string}
          allowFullScreen
          title={`${project.title} Preview`}
          className="rounded-xl"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  return null;
};

export default MediaDisplay;

