import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaBehance } from "react-icons/fa";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// ---- Types ----
interface Showcase {
  title: string;
  category: string; // used for filtering
  description: string;
  tag: string; // visual label
  image: string;
  challenge: string;
  process: string;
  outcome: string;
}

// ---- Animations ----
const cvSectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Portfolio() {
  // ---- State ----
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [error, setError] = useState("");

  // ---- Handlers ----
  const handleUnlock = () => {
    if (code === "ACCESS2025") {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect code. Please try again.");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Close lightbox on ESC
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  // ---- Particles ----
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  const particleOptions = {
    background: { color: { value: "#f3f4f6" } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: false, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false },
      number: { density: { enable: true, area: 800 }, value: 50 },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  } as const;

  // ---- Data ----
  const showcases: Showcase[] = [
    {
      title: "UI Dashboard Design",
      category: "UI/UX",
      description: "A modern dashboard interface design.",
      tag: "UI/UX",
      image: "/images/Church-E-card-07-2024.png",
      challenge: "Create an intuitive dashboard for enterprise users to monitor real-time data.",
      process: "Conducted user interviews, created wireframes in Figma, and iterated based on feedback.",
      outcome: "Reduced user task completion time by 20%, as validated by user testing.",
    },
    {
      title: "Mobile App Prototype",
      category: "UI/UX",
      description: "Interactive mobile prototype for testing.",
      tag: "UI/UX",
      image: "/images/mobile-prototype.png",
      challenge: "Design a user-friendly mobile app interface for a fitness tracking platform.",
      process: "Developed wireframes and prototypes in Figma, tested with users, and refined UX.",
      outcome: "Received 90% positive feedback in usability testing.",
    },
    {
      title: "Brand Identity Project",
      category: "Branding",
      description: "Logo and identity system for a startup.",
      tag: "Branding",
      image: "/images/brand-identity.png",
      challenge: "Develop a cohesive brand identity for a fintech startup.",
      process: "Created mood boards, designed logos in Adobe Illustrator, and developed brand guidelines.",

      outcome: "Increased brand recognition by 30% within three months.",
    },
    {
      title: "Marketing Campaign Graphics",
      category: "Graphics",
      description: "Social media campaign visuals.",
      tag: "Graphics",
      image: "/images/marketing-graphics.png",
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Twitter.",
      outcome: "Boosted campaign engagement by 25%.",
    },
    {
      title: "Poster & Print Design",
      category: "Graphics",
      description: "Creative poster and flyer designs.",
      tag: "Graphics",
      image: "/images/poster-design.png",
      challenge: "Design eye-catching posters for a cultural event.",
      process: "Used Adobe InDesign for layout and incorporated vibrant illustrations.",
      outcome: "Attracted 500+ attendees to the event.",
    },
    {
      title: "Slide Decks",
      category: "Slide Decks", // ensure filter works
      description: "Interactive on brand.",
      tag: "Slide Decks",
      image: "/images/data-viz.png",
      challenge: "Visualize complex stories.",
      process: "Built slide.",
      outcome: "Improved pitch 80% of users.",
    },
  ];

  const categories = ["All", "UI/UX", "Branding", "Graphics", "Illustration", "Slide Decks"] as const;

  const filteredShowcases =
    activeCategory === "All"
      ? showcases
      : showcases.filter((item) => item.category === activeCategory || item.tag === activeCategory);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen">
      {/* Particle Background */}
      <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={particleOptions} className="absolute inset-0 z-[-1]" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center">
        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-bold mb-4">
          Brian Maina Nyawira
        </motion.h1>
        <p className="text-lg mb-6">Visual Designer | Aspiring IT Professional</p>
        <Button className="rounded-2xl px-6 py-3 text-lg" onClick={() => scrollToSection("cv")} aria-label="Explore my work">
          Explore My Work
        </Button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce select-none" aria-hidden>
          ↓
        </div>
      </section>

      {/* CV Section */}
      <motion.section id="cv" className="relative max-w-5xl mx-auto py-20 px-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
        <motion.h2 variants={cvSectionVariants} className="text-3xl font-semibold mb-6">
          Curriculum Vitae
        </motion.h2>

        {/* About Me */}
        <motion.div variants={cvSectionVariants} className="mb-10">
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
        </motion.div>

        <motion.div variants={cvSectionVariants} className="grid md:grid-cols-2 gap-10">
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
        </motion.div>

        {/* Skills */}
        <motion.div variants={cvSectionVariants} className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Skills</h3>
          <ul className="flex flex-wrap gap-3">
            {["Adobe Creative Suite", "Figma", "UI/UX Design", "Java", "Machine Learning Basics", "React", "Pandas", "Matplotlib"].map((skill) => (
              <li key={skill} className="px-4 py-2 bg-gray-200 rounded-full text-sm">{skill}</li>
            ))}
          </ul>
        </motion.div>

        {/* References inside CV */}
        <motion.div variants={cvSectionVariants} className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">References</h3>
          <p className="text-gray-600 mb-4">Names are visible. Contact details require an access code.</p>

          {!unlocked && (
            <div className="space-y-4 mb-6">
              <label htmlFor="refCode" className="sr-only">Access code</label>
              <input
                id="refCode"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="border rounded-full p-2 w-full md:w-1/2"
                aria-invalid={!!error}
                aria-describedby={error ? "refError" : undefined}
              />
              <Button onClick={handleUnlock}>Unlock</Button>
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
        </motion.div>

        <motion.div variants={cvSectionVariants} className="mt-6">
          <Button asChild variant="outline">
            <a href="/files/Brian-CV.pdf" download>
              Download CV
            </a>
          </Button>
        </motion.div>
      </motion.section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8">Design Showcase</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredShowcases.map((project, idx) => (
            <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer" onClick={() => setLightbox(project)}>
                <CardContent className="p-0">
                  <div className="h-40 flex items-center justify-center relative">
                    <img src={project.image} alt={`${project.title} preview mockup`} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">{project.tag}</span>
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
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setLightbox(null)} aria-label="Close dialog">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-semibold mb-4">{lightbox.title}</h3>
              <div className="bg-gray-200 h-60 flex items-center justify-center rounded-xl mb-4">
                <img src={lightbox.image} alt={`${lightbox.title} full preview`} className="w-full h-full object-cover rounded-xl" />
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
            <FaLinkedin size={30} />
          </a>
          <a
            href="https://github.com/Obrienmaina-Mosbach"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C06EFF] transition-transform transform hover:scale-110"
            aria-label="GitHub"
          >
            <FaGithub size={30} />
          </a>
          <a
            href="https://twitter.com/brianmaina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DA1F2] transition-transform transform hover:scale-110"
            aria-label="Twitter"
          >
            <FaTwitter size={30} />
          </a>
          <a
            href="https://instagram.com/brianmaina_design"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-transform transform hover:scale-110"
            aria-label="Instagram"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://behance.net/brianmaina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1769FF] transition-transform transform hover:scale-110"
            aria-label="Behance"
          >
            <FaBehance size={30} />
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
