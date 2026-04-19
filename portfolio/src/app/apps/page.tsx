"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

interface AppItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

function AppCard({
  app,
  isSelected,
  onSelect,
  onDeselect,
}: {
  app: AppItem;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: (e: React.MouseEvent) => void;
}) {
  const [accentColor, setAccentColor] = useState<string>("20, 184, 166");
  const [gradientColor, setGradientColor] = useState<string>("0, 0, 0");
  const [buttonColor, setButtonColor] = useState<string>("15, 118, 110"); // Fallback for darker button
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = app.image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);

      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      
      // The raw color for borders
      setAccentColor(`${r}, ${g}, ${b}`);
      
      // Darken by 50% for the gradient overlay
      setGradientColor(`${Math.floor(r * 0.5)}, ${Math.floor(g * 0.5)}, ${Math.floor(b * 0.5)}`);
      
      // Darken by 30% for the Visit Site button
      setButtonColor(`${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)}`);
    };
  }, [app.image]);

  return (
    <motion.div
      layout
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!isSelected ? { scale: 1.03 } : { scale: 1 }}
      transition={{ layout: { duration: 0.4, type: "spring", bounce: 0.2 } }}
      style={{
        borderColor: isSelected 
          ? undefined 
          : isHovered 
            ? `rgb(${accentColor})` 
            : "transparent",
      }}
      className={`overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg border-2 transition-colors duration-300 ${
        isSelected
          ? "col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row cursor-default z-10 relative border-gray-200 dark:border-gray-800"
          : "relative h-64 cursor-pointer"
      }`}
    >
      {/* Background Image Section */}
      <motion.div
        layout
        className={`relative overflow-hidden ${
          isSelected ? "h-64 md:h-auto md:w-1/2 lg:w-3/5" : "w-full h-full"
        }`}
      >
        <img
          src={app.image}
          alt={app.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dynamic Extracted Gradient Overlay */}
        <div
          style={{
            background: `linear-gradient(to top, rgb(${gradientColor}) 0%, rgba(${gradientColor}, 0.8) 40%, transparent 100%)`
          }}
          className={`absolute inset-0 transition-opacity duration-300 ${
            isSelected ? "opacity-0 md:opacity-100" : "opacity-100"
          }`}
        />

        {/* Title shown only when the card is NOT expanded */}
        {!isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-6 left-6 pr-6"
          >
            <h3 className="text-2xl font-bold text-white drop-shadow-md">
              {app.name}
            </h3>
          </motion.div>
        )}
      </motion.div>

      {/* Details Section */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-6 md:p-8 lg:p-12 flex flex-col justify-center relative md:w-1/2 lg:w-2/5 dark:bg-gray-900"
          >
            <button
              onClick={onDeselect}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 pr-8">
              {app.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap">
              {app.description}
            </p>

            {/* Button now uses the darker buttonColor */}
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: `rgb(${buttonColor})`,
                boxShadow: `0 4px 14px 0 rgba(${buttonColor}, 0.3)`
              }}
              className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-full font-medium transition-all hover:brightness-110 w-fit"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("/api/apps");
        const data = await res.json();
        if (data.success) {
          setApps(data.data);
        }
      } catch (error) {
        console.error("Failed to load apps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Explore a collection of web and mobile applications I have built. Click on any project to see more details.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No applications available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard
              key={app._id}
              app={app}
              isSelected={selectedId === app._id}
              onSelect={() => {
                if (selectedId !== app._id) setSelectedId(app._id);
              }}
              onDeselect={(e) => {
                e.stopPropagation();
                setSelectedId(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}