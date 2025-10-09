"use client"; 

import { useState, useEffect } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { X, Info } from "lucide-react";
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";

import { Showcase, CompanyProject, TimelineSection } from "@/types";

import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Timeline from "@/components/Timeline";
import MediaDisplay from "@/components/MediaDisplay";
import ThumbnailPreview from "@/components/ThumbnailPreview";

export default function PortfolioPage() {
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
      entries: [{
        title: "B.A. Kiswahili",
        date: "Graduated 2021",
        description: "Focused on linguistics and literature, developing strong analytical and communication skills."
      }]
    },
    {
      heading: "Dual Study Program, Germany",
      entries: [{
        title: "B.Sc. Computer Science",
        date: "2024 – Present",
        description: "Currently enrolled in a dual study program combining academic learning with practical experience in the tech industry."
      }]
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
      entries: [{
        title: "Graphic Designer",
        date: "2021 – 2023",
        description: "Designed marketing and brand materials for a fintech startup, including social media visuals, pitch decks, and event branding."
      }]
    },
    {
      heading: "AFRIKA KOMMT! Fellowship",
      entries: [{
        title: "Fellow",
        date: "2023 – 2024",
        description: "Completed an intensive program focused on leadership, cross-cultural exchange, and management training in Germany."
      }]
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
      media: [ "/images/presentation-slide-1.png", "/images/presentation-slide-2.png", "/images/presentation-slide-3.png" ],
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
      media: [ "https://scontent-fra3-2.xx.fbcdn.net/v/t39.30808-6/481246712_1085756750246538_8658201038425115753_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=sUL3_VpDyFsQ7kNvwF0V0lz&_nc_oc=AdnrZ8Rkewsxdikt_MgUk-mnHnEKrdTS9NB8iXAt15-fI_83jQg1NMDpjGsL3ZmWJ30&_nc_zt=23&_nc_ht=scontent-fra3-2.xx&_nc_gid=EzoEmLW6Fen8cyJr5mGr5Q&oh=00_Afe8hrSFcmNftU-6oBkDH4N0CF7TkksDdyD-0GxRFW741w&oe=68EC0D8B", "/images/campaign-2.png", "/images/campaign-3.png" ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Twitter.",
      outcome: "Boosted campaign engagement by 25%.",
    },
  ];

  const companyProjects: CompanyProject[] = [
    {
      companyName: "SAP SE",
      companyLogo: "/images/logos/sap-logo.svg",
      disclaimer: "The following work was created during my tenure at SAP SE. It is shared with permission for portfolio purposes only and remains the intellectual property of SAP SE. The content is confidential and should not be distributed, copied, or disclosed.",
      projects: [ {
          title: "Internal Dashboard Redesign (SAP)",
          category: "UI/UX",
          description: "A complete redesign of an internal enterprise dashboard.",
          tag: "Corporate UI/UX",
          mediaType: "figma",
          media: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/1R5mVhiFrzl9WwTtC3txpd/JasiriCup?page-id=176%3A3&node-id=458-164&starting-point-node-id=458%3A6",
          challenge: "Redesign a legacy internal tool to improve usability and data visualization for over 5,000 daily users.",
          process: "Collaborated with product managers and engineers, conducted stakeholder interviews, created high-fidelity prototypes in Figma, and performed usability testing sessions.",
          outcome: "The new design led to a 40% reduction in reported user errors and a 30% increase in task efficiency. Received positive feedback for its modern and intuitive interface."
      } ]
    },
    {
      companyName: "Aspira",
      companyLogo: "/images/logos/aspira-logo.svg",
      disclaimer: "This work was created for Aspira and is showcased here with their explicit permission. All rights and intellectual property belong to Aspira. This content is for portfolio display only.",
      projects: [ {
          title: "Fintech Marketing Campaign (Aspira)",
          category: "Graphics",
          description: "Visual assets for a major fintech marketing campaign.",
          tag: "Branding",
          mediaType: "image",
          media: [ "https://scontent-fra3-2.xx.fbcdn.net/v/t39.30808-6/481246712_1085756750246538_8658201038425115753_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=sUL3_VpDyFsQ7kNvwF0V0lz&_nc_oc=AdnrZ8Rkewsxdikt_MgUk-mnHnEKrdTS9NB8iXAt15-fI_83jQg1NMDpjGsL3ZmWJ30&_nc_zt=23&_nc_ht=scontent-fra3-2.xx&_nc_gid=EzoEmLW6Fen8cyJr5mGr5Q&oh=00_Afe8hrSFcmNftU-6oBkDH4N0CF7TkksDdyD-0GxRFW741w&oe=68EC0D8B", "/images/campaign-2.png" ],
          challenge: "To create a visually striking and cohesive set of graphics for a multi-platform digital marketing campaign aimed at increasing user acquisition.",
          process: "Developed a creative concept based on market research, designed visuals using Adobe Photoshop and Illustrator, and created templates for various social media formats.",
          outcome: "The campaign exceeded targets, contributing to a 25% increase in app downloads and a significant boost in social media engagement during the campaign period."
      } ]
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
      if (!response.ok) throw new Error(data.message || 'Failed to send code.');
      setRequestState('success');
      setRequestMessage('Success! Please check your email for the access code.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRequestMessage(err.message);
      } else {
        setRequestMessage('An unknown error occurred.');
      }
      setRequestState('error');
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
        setUnlockError(data.message || "Incorrect code.");
      }
    } catch (error) {
      console.error("Unlock error:", error)
      setUnlockError("An error occurred.");
    } finally {
      setUnlockLoading(false);
    }
  };
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setDisclaimerProject(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen">
      <section className="relative flex flex-col items-center justify-center h-screen text-center px-6">
        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-bold mb-4">
          Brian Maina Nyawira
        </motion.h1>
        <p className="text-lg mb-6">Visual Designer | Aspiring IT Professional</p>
        <Button onClick={() => scrollToSection("portfolio")}>Explore My Work</Button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce select-none">↓</div>
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
            <p className="text-gray-600 mb-6">To protect my references&apos; privacy, please enter your email address to receive a temporary access code.</p>
            <div className="space-y-4 mb-8 max-w-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="border border-gray-300 rounded-full p-3 w-full" disabled={requestState === 'loading'} />
                <Button onClick={handleRequestCode} disabled={requestState === 'loading' || !email} className="whitespace-nowrap">
                  {requestState === 'loading' ? 'Sending...' : 'Request Code'}
                </Button>
              </div>
              {requestMessage && <p className={`text-sm ${requestState === 'error' ? 'text-red-500' : 'text-green-600'}`}>{requestMessage}</p>}
              {requestState === 'success' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t mt-6">
                  <input id="refCode" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code from email" className="border border-gray-300 rounded-full p-3 w-full" onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
                  <Button onClick={handleUnlock} disabled={unlockLoading || !code}>{unlockLoading ? 'Verifying...' : 'Unlock'}</Button>
                </div>
              )}
              {unlockError && <p className="text-red-500 text-sm" role="alert">{unlockError}</p>}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">Contact details are now visible. Thank you for verifying.</p>
            <ul className="space-y-6">
              <li><h4 className="font-medium">Oliver Gutezeit – SAP SE</h4><p className="text-sm text-gray-600">Email: oliver.gutezeit@sap.com | Phone: +49 123 456 789</p></li>
              <li><h4 className="font-medium">Supervisor – Aspira</h4><p className="text-sm text-gray-600">Email: supervisor@aspira.com | Phone: +254 700 123 456</p></li>
              <li><h4 className="font-medium">AFRIKA KOMMT! Program Manager</h4><p className="text-sm text-gray-600">Email: manager@afrikakommt.de | Phone: +49 987 654 321</p></li>
            </ul>
          </>
        )}
      </section>
      
      <section id="portfolio" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Design Showcase</h2>
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
              <Card className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full" onClick={() => setLightbox(project)}>
                <CardContent>
                  <div className="h-40 flex items-center justify-center relative bg-gray-100 rounded-lg overflow-hidden">
                    <ThumbnailPreview project={project} />
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
      </section>

      <section id="corporate-work" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Client & Corporate Work</h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-center">This section contains confidential work created for specific companies. Access is granted for portfolio review purposes only after acknowledging the respective disclaimer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyProjects.map((project, idx) => (
            <motion.div key={project.companyName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 bg-gray-100 hover:bg-white transition-colors" onClick={() => setDisclaimerProject(project)}>
                <Image src={project.companyLogo} alt={`${project.companyName} logo`} width={128} height={64} className="h-16 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all" />
                <h3 className="text-xl font-medium text-gray-800">{project.companyName}</h3>
                <p className="text-sm text-teal-600 font-semibold mt-4">View Projects</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setLightbox(null)} aria-label="Close dialog"><X size={24} /></button>
            <h3 className="text-2xl font-semibold mb-4">{lightbox.title}</h3>
            <div className="mb-6"><MediaDisplay project={lightbox} /></div>
            <div className="space-y-4">
              <div><h4 className="font-medium text-lg">Challenge</h4><p className="text-sm text-gray-700">{lightbox.challenge}</p></div>
              <div><h4 className="font-medium text-lg">Process</h4><p className="text-sm text-gray-700">{lightbox.process}</p></div>
              <div><h4 className="font-medium text-lg">Outcome</h4><p className="text-sm text-gray-700">{lightbox.outcome}</p></div>
            </div>
          </div>
        </div>
      )}

      {disclaimerProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setDisclaimerProject(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setDisclaimerProject(null)} aria-label="Close dialog"><X size={24} /></button>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full p-3 mt-1"><Info size={24} /></div>
              <div>
                <h3 id="disclaimer-title" className="text-2xl font-semibold mb-2">Notice of Confidentiality</h3>
                <p className="text-sm text-gray-700 mb-6">{disclaimerProject.disclaimer}</p>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setDisclaimerProject(null)}>Cancel</Button>
                  <Button onClick={() => { if (disclaimerProject.projects.length > 0) setLightbox(disclaimerProject.projects[0]); setDisclaimerProject(null); }}>Acknowledge & Proceed</Button>
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
          <a href="https://linkedin.com/in/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrianmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          <a href="https://twitter.com/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-transform transform hover:scale-110" aria-label="X (formerly Twitter)"><SiX size={20} /></a>
          <a href="https://instagram.com/brianmaina_design" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-transform transform hover:scale-110" aria-label="Instagram"><SiInstagram size={20} /></a>
          <a href="https://behance.net/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:brianmaina.nyawira@gmail.com")}>Contact Me</Button>
      </footer>
    </main>
  );
}

