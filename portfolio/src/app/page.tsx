import { useState, useEffect } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";

// --- Types ---
interface Showcase {
  title: string;
  category: string;
  description: string;
  tag: string;
  coverImage?: string;
  mediaType: "image" | "video" | "figma" | "presentation" | "googleslides" | "powerpoint";
  media: string | string[];
  challenge: string;
  process: string;
  outcome: string;
}

interface CompanyProject {
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  projects: Showcase[];
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

// --- UPDATED: Generic types for a reusable timeline ---
interface TimelineEntry {
  title: string;
  date: string;
  description: string;
}

interface TimelineSection {
  heading: string;
  entries: TimelineEntry[];
}
// -------------------------

// --- UI Components ---
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

// --- UPDATED: Generic Timeline Component ---
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
// -------------------------

// --- Media Display Components ---
const MediaDisplay: React.FC<{ project: Showcase }> = ({ project }) => {
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

  if (project.mediaType === "powerpoint") {
    return (
      <div className="relative w-full">
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(project.media as string)}`}
            width="100%"
            height="400"
            frameBorder="0"
            title={`${project.title} PowerPoint presentation`}
            className="rounded-xl"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          View in fullscreen for best experience and animations
        </p>
      </div>
    );
  }

  return null;
};

const ThumbnailPreview: React.FC<{ project: Showcase }> = ({ project }) => {
  if (project.coverImage) {
    return <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />;
  }

  if (project.mediaType === "image" || project.mediaType === "presentation") {
    const media = Array.isArray(project.media) ? project.media[0] : project.media;
    return <Image src={media as string} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />;
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

  if (project.mediaType === "powerpoint") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <span className="text-white font-bold">PowerPoint</span>
      </div>
    );
  }

  return null;
};
// -------------------------

// --- Main Portfolio Component ---
export default function Portfolio() {
  const categories = ["All", "UI/UX", "Presentation", "Branding", "Graphics"] as const;
  
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [disclaimerProject, setDisclaimerProject] = useState<CompanyProject | null>(null);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [requestMessage, setRequestMessage] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const educationData: TimelineSection[] = [
    {
      heading: "University of Nairobi",
      entries: [
        {
          title: "B.A. Kiswahili",
          date: "Graduated 2021",
          description: "Focused on linguistics and literature, developing strong analytical and communication skills."
        }
      ]
    },
    {
      heading: "Dual Study Program, Germany",
      entries: [
        {
          title: "B.Sc. Computer Science",
          date: "2024 – Present",
          description: "Currently enrolled in a dual study program combining academic learning with practical experience in the tech industry."
        }
      ]
    }
  ];

  const experienceData: TimelineSection[] = [
    {
      heading: "SAP SE",
      entries: [
        {
          title: "Visual Designer",
          date: "2023 – 2024",
          description: "Led visual design for enterprise dashboards, creating UI mockups and iterating based on user feedback to enhance usability for thousands of daily users."
        },
        {
          title: "Design Intern",
          date: "Summer 2022",
          description: "Assisted the senior design team with asset creation, wireframing, and participated in user research sessions for upcoming product features."
        }
      ]
    },
    {
      heading: "Aspira",
      entries: [
        {
          title: "Graphic Designer",
          date: "2021 – 2023",
          description: "Designed marketing and brand materials for a fintech startup, including social media visuals, pitch decks, and event branding."
        }
      ]
    },
    {
      heading: "AFRIKA KOMMT! Fellowship",
      entries: [
        {
          title: "Fellow",
          date: "2023 – 2024",
          description: "Completed an intensive program focused on leadership, cross-cultural exchange, and management training in Germany."
        }
      ]
    }
  ];

  const showcases: Showcase[] = [
    {
      title: "Enterprise Dashboard UI",
      category: "UI/UX",
      description: "Interactive Figma prototype for enterprise dashboard.",
      tag: "UI/UX",
      coverImage: "/images/covers/dashboard-cover.jpg",
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
      media: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/brand-identity/Motor%20Marvels_1.jpg",
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
        "https://scontent-fra3-2.xx.fbcdn.net/v/t39.30808-6/481246712_1085756750246538_8658201038425115753_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=sUL3_VpDyFsQ7kNvwF0V0lz&_nc_oc=AdnrZ8Rkewsxdikt_MgUk-mnHnEKrdTS9NB8iXAt15-fI_83jQg1NMDpjGsL3ZmWJ30&_nc_zt=23&_nc_ht=scontent-fra3-2.xx&_nc_gid=EzoEmLW6Fen8cyJr5mGr5Q&oh=00_Afe8hrSFcmNftU-6oBkDH4N0CF7TkksDdyD-0GxRFW741w&oe=68EC0D8B",
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
      title: "Q4 Business Plan",
      category: "Presentation",
      description: "Strategic business presentation with animations.",
      tag: "Slide Decks",
      mediaType: "powerpoint",
      media: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Circle%20reveal.pptx",
      challenge: "Present quarterly strategy to executives.",
      process: "Created comprehensive deck with transition animations.",
      outcome: "Approved budget increase of 25%.",
    },
    {
      title: "Demo Video",
      category: "Graphics",
      description: "Product demo video.",
      tag: "Video",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/brand-identity/Motor%20Marvels_1.jpg",
      mediaType: "video",
      media: "/videos/product-demo.mp4",
      challenge: "Create a compelling product demonstration video.",
      process: "Filmed, edited with professional transitions and effects.",
      outcome: "Achieved 50k+ views and 15% conversion rate.",
    },
  ];

  const companyProjects: CompanyProject[] = [
    {
      companyName: "SAP SE",
      companyLogo: "/images/logos/sap-logo.svg",
      disclaimer: "The following work was created during my tenure at SAP SE. It is shared with permission for portfolio purposes only and remains the intellectual property of SAP SE. The content is confidential and should not be distributed, copied, or disclosed.",
      projects: [
        {
          title: "Internal Dashboard Redesign (SAP)",
          category: "UI/UX",
          description: "A complete redesign of an internal enterprise dashboard.",
          tag: "Corporate UI/UX",
          mediaType: "figma",
          media: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/1R5mVhiFrzl9WwTtC3txpd/JasiriCup?page-id=176%3A3&node-id=458-164&starting-point-node-id=458%3A6",
          challenge: "Redesign a legacy internal tool to improve usability and data visualization for over 5,000 daily users.",
          process: "Collaborated with product managers and engineers, conducted stakeholder interviews, created high-fidelity prototypes in Figma, and performed usability testing sessions.",
          outcome: "The new design led to a 40% reduction in reported user errors and a 30% increase in task efficiency. Received positive feedback for its modern and intuitive interface."
        }
      ]
    },
    {
      companyName: "Aspira",
      companyLogo: "/images/logos/aspira-logo.svg",
      disclaimer: "This work was created for Aspira and is showcased here with their explicit permission. All rights and intellectual property belong to Aspira. This content is for portfolio display only.",
      projects: [
        {
          title: "Fintech Marketing Campaign (Aspira)",
          category: "Graphics",
          description: "Visual assets for a major fintech marketing campaign.",
          tag: "Branding",
          mediaType: "image",
          media: [
            "https://scontent-fra3-2.xx.fbcdn.net/v/t39.30808-6/481246712_1085756750246538_8658201038425115753_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=sUL3_VpDyFsQ7kNvwF0V0lz&_nc_oc=AdnrZ8Rkewsxdikt_MgUk-mnHnEKrdTS9NB8iXAt15-fI_83jQg1NMDpjGsL3ZmWJ30&_nc_zt=23&_nc_ht=scontent-fra3-2.xx&_nc_gid=EzoEmLW6Fen8cyJr5mGr5Q&oh=00_Afe8hrSFcmNftU-6oBkDH4N0CF7TkksDdyD-0GxRFW741w&oe=68EC0D8B",
            "/images/campaign-2.png",
          ],
          challenge: "To create a visually striking and cohesive set of graphics for a multi-platform digital marketing campaign aimed at increasing user acquisition.",
          process: "Developed a creative concept based on market research, designed visuals using Adobe Photoshop and Illustrator, and created templates for various social media formats.",
          outcome: "The campaign exceeded targets, contributing to a 25% increase in app downloads and a significant boost in social media engagement during the campaign period."
        }
      ]
    }
  ];

  const filteredShowcases = activeCategory === "All" ? showcases : showcases.filter((item) => item.category === activeCategory);

  const handleRequestCode = async () => {
    setRequestState('loading');
    setRequestMessage('');
    try {
      const response = await fetch('/api/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send code.');
      }
      setRequestState('success');
      setRequestMessage('Success! Please check your email for the access code.');
    } catch (err: any) {
      setRequestState('error');
      setRequestMessage(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleUnlock = async () => {
    setUnlockError("");
    setUnlockLoading(true);
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUnlocked(true);
        setUnlockError("");
      } else {
        setUnlockError(data.message || "Incorrect code. Please try again.");
      }
    } catch (err) {
      setUnlockError("An error occurred. Please try again later.");
    } finally {
      setUnlockLoading(false);
    }
  };
  
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) {
          setLightbox(null);
        } else if (disclaimerProject) {
          setDisclaimerProject(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, disclaimerProject]);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen">
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

      <section id="cv" className="relative max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6">Curriculum Vitae</h2>
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
          <div>
            <h3 className="text-2xl font-semibold mb-4">Education</h3>
            <Timeline sections={educationData} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Experience</h3>
            <Timeline sections={experienceData} />
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Skills</h3>
          <ul className="flex flex-wrap gap-3">
            {["Adobe Creative Suite", "Figma", "UI/UX Design", "Java", "Machine Learning Basics", "React", "Pandas", "Matplotlib"].map((skill) => (
              <li key={skill} className="px-4 py-2 bg-gray-200 rounded-full text-sm">{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="references" className="relative max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8">References</h2>
        
        {!unlocked ? (
          <>
            <p className="text-gray-600 mb-6">
              To protect my references' privacy, please enter your email address to receive a temporary access code.
            </p>
            <div className="space-y-4 mb-8 max-w-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="border border-gray-300 rounded-full p-3 w-full"
                  disabled={requestState === 'loading'}
                />
                <Button onClick={handleRequestCode} disabled={requestState === 'loading' || !email} className="whitespace-nowrap">
                  {requestState === 'loading' ? 'Sending...' : 'Request Code'}
                </Button>
              </div>

              {requestMessage && (
                <p className={`text-sm ${requestState === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {requestMessage}
                </p>
              )}

              {requestState === 'success' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t mt-6">
                  <input
                    id="refCode"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code from email"
                    className="border border-gray-300 rounded-full p-3 w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  />
                  <Button onClick={handleUnlock} disabled={unlockLoading || !code}>
                    {unlockLoading ? 'Verifying...' : 'Unlock'}
                  </Button>
                </div>
              )}
              {unlockError && (
                <p className="text-red-500 text-sm" role="alert">{unlockError}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">Contact details are now visible. Thank you for verifying.</p>
            <ul className="space-y-6">
              <li>
                <h4 className="font-medium">Oliver Gutezeit – SAP SE</h4>
                <p className="text-sm text-gray-600">Email: oliver.gutezeit@sap.com | Phone: +49 123 456 789</p>
              </li>
              <li>
                <h4 className="font-medium">Supervisor – Aspira</h4>
                <p className="text-sm text-gray-600">Email: supervisor@aspira.com | Phone: +254 700 123 456</p>
              </li>
              <li>
                <h4 className="font-medium">AFRIKA KOMMT! Program Manager</h4>
                <p className="text-sm text-gray-600">Email: manager@afrikakommt.de | Phone: +49 987 654 321</p>
              </li>
            </ul>
          </>
        )}
      </section>
      
      <section id="portfolio" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Design Showcase</h2>
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
      </section>

      <section id="corporate-work" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Client & Corporate Work</h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-center">
          This section contains confidential work created for specific companies. Access is granted for portfolio review purposes only after acknowledging the respective disclaimer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyProjects.map((project, idx) => (
            <motion.div
              key={project.companyName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card
                className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 bg-gray-100 hover:bg-white transition-colors"
                onClick={() => setDisclaimerProject(project)}
              >
                <img src={project.companyLogo} alt={`${project.companyName} logo`} className="h-16 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all" />
                <h3 className="text-xl font-medium text-gray-800">{project.companyName}</h3>
                <p className="text-sm text-teal-600 font-semibold mt-4">View Projects</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

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

      {disclaimerProject && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="disclaimer-title"
          onClick={() => setDisclaimerProject(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setDisclaimerProject(null)}
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full p-3 mt-1">
                <Info size={24} />
              </div>
              <div>
                <h3 id="disclaimer-title" className="text-2xl font-semibold mb-2">Notice of Confidentiality</h3>
                <p className="text-sm text-gray-700 mb-6">{disclaimerProject.disclaimer}</p>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setDisclaimerProject(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (disclaimerProject.projects.length > 0) {
                        setLightbox(disclaimerProject.projects[0]);
                      }
                      setDisclaimerProject(null);
                    }}
                  >
                    Acknowledge & Proceed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://linkedin.com/in/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn">
            <SiLinkedin size={30} />
          </a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub">
            <SiGithub size={30} />
          </a>
          <a href="https://twitter.com/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-transform transform hover:scale-110" aria-label="X (formerly Twitter)">
            <SiX size={30} />
          </a>
          <a href="https://instagram.com/brianmaina_design" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-transform transform hover:scale-110" aria-label="Instagram">
            <SiInstagram size={30} />
          </a>
          <a href="https://behance.net/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance">
            <SiBehance size={30} />
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
