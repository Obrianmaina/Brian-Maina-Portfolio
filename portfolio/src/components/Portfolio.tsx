import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// --- SVG Icon Components ---
const LinkedInIcon = ({ size = 30, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM6 9H2V21h4V9zM4 6.47c-1.12 0-2-.9-2-2s.88-2 2-2 2 .9 2 2-.88 2-2 2z"></path>
  </svg>
);

const GitHubIcon = ({ size = 30, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
  </svg>
);

const TwitterIcon = ({ size = 30, className = "" }) => (
    <svg 
        stroke="currentColor" 
        fill="currentColor" 
        strokeWidth="0" 
        viewBox="0 0 24 24" 
        height={size} 
        width={size} 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08"></path>
    </svg>
);

const InstagramIcon = ({ size = 30, className = "" }) => (
    <svg 
        stroke="currentColor" 
        fill="currentColor" 
        strokeWidth="0" 
        viewBox="0 0 24 24" 
        height={size} 
        width={size} 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.252 0-3.623.012-4.895.07-2.618.12-3.795 1.3-3.917 3.917-.058 1.272-.07 1.648-.07 4.908s.012 3.636.07 4.908c.122 2.618 1.3 3.795 3.917 3.917 1.272.058 1.643.07 4.895.07 3.252 0 3.623-.012 4.895-.07 2.618-.12 3.795-1.3 3.917-3.917.058-1.272.07-1.648.07-4.908s-.012-3.636-.07-4.908c-.122-2.618-1.3-3.795-3.917-3.917-1.272-.058-1.643-.07-4.895-.07zm0 4.25c-2.482 0-4.482 2.001-4.482 4.482s2.000 4.482 4.482 4.482 4.482-2.001 4.482-4.482-2.000-4.482-4.482-4.482zm0 7.164c-1.479 0-2.682-1.203-2.682-2.682s1.203-2.682 2.682-2.682 2.682 1.203 2.682 2.682-1.203 2.682-2.682 2.682zm4.194-8.067c-.66 0-1.194.534-1.194 1.194s.534 1.194 1.194 1.194 1.194-.534 1.194-1.194-.534-1.194-1.194-1.194z"></path>
    </svg>
);

const BehanceIcon = ({ size = 30, className = "" }) => (
    <svg 
        stroke="currentColor" 
        fill="currentColor" 
        strokeWidth="0" 
        viewBox="0 0 24 24" 
        height={size} 
        width={size} 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M22 6.5h-5.5v2h5.5c.28 0 .5.22.5.5s-.22.5-.5.5h-5.5v2h5.5c.28 0 .5.22.5.5s-.22.5-.5.5h-5.5v2H22c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zM4 6.5h4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-4v2h4c1.93 0 3.5-1.57 3.5-3.5S9.93 4.5 8 4.5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2H4V6.5zm8 4h-4v2h4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-4v2h4c1.93 0 3.5-1.57 3.5-3.5S13.93 10.5 12 10.5z"></path>
    </svg>
);
// -------------------------

// Types
interface Showcase {
  title: string;
  category: string;
  description: string;
  tag: string;
  mediaType: "image" | "video" | "figma" | "presentation" | "googleslides";
  media: string | string[];
  challenge: string;
  process: string;
  outcome: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition disabled:opacity-50";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-700",
    outline: "border border-teal-600 text-gray-900 hover:bg-teal-50",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = "",
  onClick,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

// Media Display Component
const MediaDisplay: React.FC<{ project: Showcase }> = ({ project }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (project.mediaType === "image") {
    const media = Array.isArray(project.media) ? project.media : [project.media];
    return (
      <div className="relative">
        <img
          src={media[currentSlide]}
          alt={`${project.title} slide ${currentSlide + 1}`}
          className="w-full h-auto rounded-xl"
        />
        {media.length > 1 && (
          <div className="flex justify-between mt-4">
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
          <img
            src={slides[currentSlide]}
            alt={`${project.title} slide ${currentSlide + 1}`}
            className="w-full h-auto"
          />
        </div>
        {slides.length > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentSlide ? "bg-teal-500 w-6" : "bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
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

  return null;
};

// Thumbnail Preview Component
const ThumbnailPreview: React.FC<{ project: Showcase }> = ({ project }) => {
  if (project.mediaType === "image") {
    const media = Array.isArray(project.media) ? project.media[0] : project.media;
    return <img src={media as string} alt={project.title} className="w-full h-full object-cover" />;
  }

  if (project.mediaType === "video") {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-4xl">▶</div>
      </div>
    );
  }

  if (project.mediaType === "figma") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold">Figma</span>
      </div>
    );
  }

  if (project.mediaType === "presentation") {
    const slides = Array.isArray(project.media) ? project.media : [project.media];
    return (
      <img src={slides[0] as string} alt={project.title} className="w-full h-full object-cover" />
    );
  }

  if (project.mediaType === "googleslides") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
        <span className="text-white font-bold">Slides</span>
      </div>
    );
  }

  return null;
};

export default function Portfolio() {
  const categories = ["All", "UI/UX", "Presentation", "Branding", "Graphics"] as const;
  
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUnlocked(true);
        setError("");
      } else {
        setError(data.message || "Incorrect code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const showcases: Showcase[] = [
    {
      title: "Enterprise Dashboard UI",
      category: "UI/UX",
      description: "Interactive Figma prototype for enterprise dashboard.",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/1R5mVhiFrzl9WwTtC3txpd/JasiriCup?page-id=176%3A3&node-id=458-164&starting-point-node-id=458%3A6",
      challenge: "Create an intuitive dashboard for enterprise users to monitor real-time data.",
      process: "Conducted user interviews, created wireframes in Figma, and iterated based on feedback.",
      outcome: "Reduced user task completion time by 20%, as validated by user testing.",
    },
    {
      title: "Product Launch Presentation",
      category: "Presentation",
      description: "Brand presentation for product launch.",
      tag: "Slide Decks",
      mediaType: "presentation",
      media: [
        "/images/presentation-slide-1.png",
        "/images/presentation-slide-2.png",
        "/images/presentation-slide-3.png",
      ],
      challenge: "Communicate product vision and strategy to stakeholders.",
      process: "Designed cohesive slide deck with data visualizations and brand guidelines.",
      outcome: "Secured buy-in from 95% of stakeholders.",
    },
    {
      title: "Mobile App Prototype",
      category: "UI/UX",
      description: "Interactive mobile prototype for fitness tracking.",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://embed.figma.com/proto/RYhQMvRdbgh89KQFbCVJQ6/Troubleshooters?page-id=0%3A1&node-id=17-825&viewport=315%2C330%2C0.13&scaling=scale-down&content-scaling=fixed&starting-point-node-id=12%3A421&embed-host=share",
      challenge: "Design a user-friendly mobile app interface for a fitness tracking platform.",
      process: "Developed wireframes and prototypes in Figma, tested with users, and refined UX.",
      outcome: "Received 90% positive feedback in usability testing.",
    },
    {
      title: "Brand Identity Project",
      category: "Branding",
      description: "Logo and identity system showcase.",
      tag: "Branding",
      mediaType: "image",
      media: "/images/brand-identity.png",
      challenge: "Develop a cohesive brand identity for a fintech startup.",
      process: "Created mood boards, designed logos in Adobe Illustrator, and developed brand guidelines.",
      outcome: "Increased brand recognition by 30% within three months.",
    },
    {
      title: "Marketing Campaign",
      category: "Graphics",
      description: "Social media campaign visuals.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "/images/campaign-1.png",
        "/images/campaign-2.png",
        "/images/campaign-3.png",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Twitter.",
      outcome: "Boosted campaign engagement by 25%.",
    },
    {
      title: "Product Strategy Deck",
      category: "Presentation",
      description: "Q4 strategy presentation in Google Slides.",
      tag: "Slide Decks",
      mediaType: "googleslides",
      media: "https://docs.google.com/presentation/d/e/2PACX-1vTIYm5lReqSuqb2KM_6YqYkm2kDyDh6U4YuDIKGxzSiDfc-wF8eZgvJkN12eysdCiV49AST7nYTIDr-/pubembed?start=false&loop=false&delayms=3000",
      challenge: "...",
      process: "...",
      outcome: "..."
    },
    {
      title: "Demo Video",
      category: "Graphics",
      description: "Product demo video.",
      tag: "Video",
      mediaType: "video",
      media: "/videos/product-demo.mp4",
      challenge: "Create a compelling product demonstration video.",
      process: "Filmed, edited with professional transitions and effects.",
      outcome: "Achieved 50k+ views and 15% conversion rate.",
    },
  ];

  const filteredShowcases =
    activeCategory === "All"
      ? showcases
      : showcases.filter((item) => item.category === activeCategory);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4"
        >
          Brian Maina Nyawira
        </motion.h1>
        <p className="text-lg mb-6">Visual Designer | Aspiring IT Professional</p>
        <Button onClick={() => scrollToSection("portfolio")}>Explore My Work</Button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce select-none">
          ↓
        </div>
      </section>

      {/* CV Section */}
      <section id="cv" className="relative max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6">Curriculum Vitae</h2>

        {/* About Me */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">About Me</h3>
          <p className="mb-4 text-gray-700">
            As a Visual Designer with a passion for creating user-centric solutions, I blend creativity with technical expertise. Originally from Kenya,
            I graduated with a B.A. in Kiswahili and am now pursuing a B.Sc. in Computer Science in Germany. My work reflects a commitment to solving real-world
            problems through design and technology.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>Address: Walldorf, Germany</li>
            <li>Email: brianmaina.nyawira@gmail.com</li>
            <li>LinkedIn: linkedin.com/in/brianmaina</li>
            <li>Phone: +49 123 456 789</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Education</h3>
            <ul className="space-y-4">
              <li>
                <h4 className="font-medium">B.A. Kiswahili – University of Nairobi</h4>
                <p className="text-sm text-gray-600">Graduated 2021</p>
              </li>
              <li>
                <h4 className="font-medium">B.Sc. Computer Science – Dual Study Program, Germany</h4>
                <p className="text-sm text-gray-600">Enrolled 2024 – Present</p>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Experience</h3>
            <ul className="space-y-4">
              <li>
                <h4 className="font-medium">Visual Designer – SAP SE</h4>
                <p className="text-sm text-gray-600">2023 – 2024</p>
                <p className="text-sm">Led visual design for enterprise dashboards, creating UI mockups and iterating based on user feedback.</p>
              </li>
              <li>
                <h4 className="font-medium">Graphic Designer – Aspira</h4>
                <p className="text-sm text-gray-600">2021 – 2023</p>
                <p className="text-sm">Designed marketing and brand materials for a fintech startup, including social media visuals and pitch decks.</p>
              </li>
              <li>
                <h4 className="font-medium">AFRIKA KOMMT! Fellow</h4>
                <p className="text-sm text-gray-600">2023 – 2024</p>
                <p className="text-sm">Completed leadership training, cross-cultural exchange, and management training in Germany.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Skills</h3>
          <ul className="flex flex-wrap gap-3">
            {["Adobe Creative Suite", "Figma", "UI/UX Design", "Java", "Machine Learning Basics", "React", "Pandas", "Matplotlib"].map((skill) => (
              <li key={skill} className="px-4 py-2 bg-gray-200 rounded-full text-sm">{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* References Section */}
      <section className="relative max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8">References</h2>
        <p className="text-gray-600 mb-6">Names are visible. Contact details require an access code.</p>

        {!unlocked && (
          <div className="space-y-4 mb-8">
            <label htmlFor="refCode" className="sr-only">
              Access code
            </label>
            <input
              id="refCode"
              type="password"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              placeholder="Enter access code"
              className="border border-gray-300 rounded-full p-3 w-full md:w-1/2"
              aria-invalid={!!error}
              aria-describedby={error ? "refError" : undefined}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleUnlock()}
            />
            <Button onClick={handleUnlock} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Unlock'}
            </Button>
            {error && (
              <p id="refError" className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        <ul className="space-y-6">
          <li>
            <h4 className="font-medium">Oliver Gutezeit – SAP SE</h4>
            {unlocked ? (
              <p className="text-sm text-gray-600">Email: oliver.gutezeit@sap.com | Phone: +49 123 456 789</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Contact details hidden</p>
            )}
          </li>
          <li>
            <h4 className="font-medium">Supervisor – Aspira</h4>
            {unlocked ? (
              <p className="text-sm text-gray-600">Email: supervisor@aspira.com | Phone: +254 700 123 456</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Contact details hidden</p>
            )}
          </li>
          <li>
            <h4 className="font-medium">AFRIKA KOMMT! Program Manager</h4>
            {unlocked ? (
              <p className="text-sm text-gray-600">Email: manager@afrikakommt.de | Phone: +49 987 654 321</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Contact details hidden</p>
            )}
          </li>
        </ul>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8">Design Showcase</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredShowcases.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card
                className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full"
                onClick={() => setLightbox(project)}
              >
                <CardContent>
                  <div className="h-40 flex items-center justify-center relative bg-gray-100 rounded-lg overflow-hidden">
                    <ThumbnailPreview project={project} />
                    <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                      {project.tag}
                    </span>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm mb-2 px-4 text-center">{project.description}</p>
                      <Button className="bg-teal-500 hover:bg-teal-600">View Project</Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">Category: {project.category}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${lightbox.title} details`}
            onClick={() => setLightbox(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setLightbox(null)}
                aria-label="Close dialog"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-semibold mb-4">{lightbox.title}</h3>
              <div className="mb-6">
                <MediaDisplay project={lightbox} />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">Challenge</h4>
                  <p className="text-sm text-gray-700">{lightbox.challenge}</p>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Process</h4>
                  <p className="text-sm text-gray-700">{lightbox.process}</p>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Outcome</h4>
                  <p className="text-sm text-gray-700">{lightbox.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="https://linkedin.com/in/brianmaina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0077B5] transition-transform transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://github.com/Obrienmaina-Mosbach"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C06EFF] transition-transform transform hover:scale-110"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://twitter.com/brianmaina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DA1F2] transition-transform transform hover:scale-110"
            aria-label="Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://instagram.com/brianmaina_design"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-transform transform hover:scale-110"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://behance.net/brianmaina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1769FF] transition-transform transform hover:scale-110"
            aria-label="Behance"
          >
            <BehanceIcon />
          </a>
        </div>
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl"
          onClick={() => (window.location.href = "mailto:brianmaina.nyawira@gmail.com")}
          aria-label="Contact me via email"
        >
          Contact Me
        </Button>
      </footer>
    </main>
  );
}

