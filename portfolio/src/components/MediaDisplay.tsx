"use client";

import { useState } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Showcase } from "@/types";

export default function MediaDisplay({ project }: { project: Showcase }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (project.mediaType === "image") {
    const media = Array.isArray(project.media) ? project.media : [project.media];
    return (
      <div className="relative">
        <Image
          src={media[currentSlide]}
          alt={`${project.title} slide ${currentSlide + 1}`}
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl"
          priority
        />
        {media.length > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(Math.max(0, currentSlide - 1)); }}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {media.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(Math.min(media.length - 1, currentSlide + 1)); }}
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
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  if (project.mediaType === "figma") {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-gray-300 border-t-teal-500 rounded-full"
              />
              <p className="text-sm text-gray-600">Loading prototype...</p>
            </div>
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
          title={`${project.title} Figma prototype`}
          className="rounded-xl"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  if (project.mediaType === "googleslides") {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
             <div className="flex flex-col items-center gap-4">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full"
               />
               <p className="text-sm text-gray-600">Loading slides...</p>
             </div>
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
            border: "none",
          }}
          src={project.media as string}
          allowFullScreen
          title={`${project.title} Google Slides presentation`}
          className="rounded-xl"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  if (project.mediaType === "presentation") {
    const slides = Array.isArray(project.media) ? project.media : [project.media];
    return (
      <div className="relative">
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <Image
            src={slides[currentSlide]}
            alt={`${project.title} slide ${currentSlide + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
        {slides.length > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(Math.max(0, currentSlide - 1)); }}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentSlide ? "bg-teal-500 w-6" : "bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1)); }}
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

  // --- THIS SECTION IS NOW CORRECTLY INCLUDED ---
  if (project.mediaType === "powerpoint") {
    return (
      <div className="relative w-full">
        <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(project.media as string)}`}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`${project.title} PowerPoint presentation`}
            className="rounded-xl"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          View in fullscreen for the best experience and animations.
        </p>
      </div>
    );
  }

  return null;
}

