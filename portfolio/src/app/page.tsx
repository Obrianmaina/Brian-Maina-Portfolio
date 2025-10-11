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
      heading: "Dual Study Program, Germany",
      entries: [{
        title: "B.Sc. Computer Science",
        date: "2024 September - 2025 October",
        description: "Undertook one year of computer science studies to bridge the gap between design and technical implementation. Gained foundational knowledge in software development, data visualization, and UI/UX principles through a combination of academic learning and practical application."
      }]
    },
    {
      heading: "Moi University, Kenya",
      entries: [{
        title: "B.A. Kiswahili",
        date: "Graduated 2021 (Seecond Class Honours, Upper Division)",
        description: "Focused on Communication, Marketing, Translation, and Swahili literature and linguistics."
      }]
    },
     // START: New Courses & Certifications Section
    {
      heading: "Courses & Certifications",
      entries: [
        {
          title: "LinkedIn Learning",
          date: "",
          description: [
            "After Effects CC 2023",
            "After Effects 2020 Essential Training",
            "An Introduction to AI and Sustainability",
            "Career Essentials in Software Development",
            "Figma For UX Design"
          ]
        },
        {
          title: "Coursera",
          date: "",
          description: [
            "Getting Started with Figma",
            "Introduction to UI Design (University of Minnesota)",
            "Graphic Design (University of Colorado Boulder)"
          ]
        },
        {
          title: "Goethe Institute (Bonn)",
          date: "",
          description: [
            "German A1 Certificate",
          ]
        },
        {
          title: "Other",
          date: "",
          description: [
            "Effective Presentation Skills Certificate (Metropolitan School of Business and Management)",
            "Ajira Program: Writing and Translation",
            "Computer Studies (Arknet Computer College)"
          ]
        }
      ]
    }
  ];

  const experienceData: TimelineSection[] = [
    {
      heading: "SAP SE",
      entries: [
        {
          title: "VT Student",
          date: "2024 September - 2025 October",
          description: "Worked on real-world projects, learning from mentors on the implementation of UI5 Framework in SAP Systems and in my final rotation delivered a Web Components API Viewer for the SAP UI5 Core Framework team."
        },
        {
          title: "Visual Designer",
          date: "February 2024 - September 2024",
          description: [
                "Designed banners, corporate slide decks, and edited images and videos for the Experience Technology team.",
                "Created User Interface designs and updated existing components for the Discovery Showroom.",
                "Assisted in the design of the Experience Technology team and Afrika Kommt! Workzone pages."
              ]
        }
      ]
    },
    {
      heading: "AFRIKA KOMMT! Fellowship",
      entries: [{
        title: "Fellow",
        date: "November 2023 - November 2024",
        description: ["Completed an intensive program focused on leadership, cross-cultural exchange, and management training in Germany.",
                      "Selected as one of 42 fellows from over 5,000 applicants for the 12th Afrika Kommt! Fellowship."
        ]
      }]
    },
    {
      heading: "Aspira",
      entries: [{
        title: "Junior Marketing Officer",
        date: "December 2022 - September 2023",
        description: [
                      "Created digital and print marketing materials, including social media and web banners, catalogues, brochures, posters, and office branding for over 50 partner retailers.",
                      "Created marketing copy and designed Google Ads.",
                      "Liaised with partner companies to get current offers and promotions.",
                      "Conducted web and social media audits."
        ]
      },
      {
        title: "Marketing and Design Associate",
        date: "June 2022 - November 2022",
        description: "Designed marketing and brand materials for a fintech startup, including social media visuals, pitch decks, and event branding."
      }
    ]
    },
    {
      heading: "Unicorn Stable",
      entries: [{
        title: "Apprenticeship (Video Editor)",
        date: "April 2022 - May 2022",
        description: 
                      "Learned and applied essentials in video editing, audio design, set management, and camera usage."
        
      },
      {
        title: "Apprenticeship",
        date: "June 2020 - October 2020",
        description: "Learned video editing basics, including cutting, transitions, and audio syncing using Adobe Premiere Pro and After Effects."
      }
    ]
    },
    {
      heading: "Breejoz Baby & Mums Shop and Danek Baby Shop",
      entries: [{
        title: "Designer and Marketer (Contract)",
        date: "December 2021 - March 2022",
        description: 
                      "Created social media campaign banners, videos, and copy for marketing campaigns."
        
      }
    ]
    },
    {
      heading: " Moi University (Eldoret, Kenya)",
      entries: [{
        title: "Intern (Public Relations Office)",
        date: "June 2021 - October 2021",
        description: 
                      ["Created banners, posters, and edited videos for the 40th Moi University Graduation.",
                        "Served as a graphic designer, translator, and editor under the Corporate Affairs and Protocol Office.",
                        "Led a team to collect and sort student data for the creation of student IDs."
                      ]
        
      }
    ]
    }
    
  ];

  // UPDATED: New skills array
  const skills = ["UI/UX Design", "Graphic Design", "Motion Graphics", "Adobe Photoshop", "Adobe Illustrator", "Adobe After Effects", "Adobe Premier Pro", "Canva", "Adobe InDesign", "Adobe Audition", "Figma", "Microsoft Powerpoint", "Google Slides", "Data Visualization", "HTML", "CSS", "Davinci Resolve", "Github", "AI"];

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
      title: "Mobile App Prototype Troubleshooters",
      category: "UI/UX",
      description: "Interactive mobile prototype for fitness tracking.",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/ui-dashboard/Ducr.png",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://embed.figma.com/proto/RYhQMvRdbgh89KQFbCVJQ6/Troubleshooters?page-id=0%3A1&node-id=17-825&viewport=315%2C330%2C0.13&scaling=scale-down&content-scaling=fixed&starting-point-node-id=12%3A421&embed-host=share",
      challenge: "Design a user-friendly mobile app interface for a fitness tracking platform.",
      process: "Developed wireframes and prototypes in Figma, tested with users, and refined UX.",
      outcome: "Received 90% positive feedback in usability testing.",
    },
    {
      title: "Mobile App Prototype DUCR",
      category: "UI/UX",
      description: "Interactive mobile prototype for car spare parts shop app.",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/ui-dashboard/Ducr.png",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://embed.figma.com/proto/kAq63P1dS8XZpn6y2KDROt/Ducr?page-id=0%3A1&node-id=17-12&embed-host=share",
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
      title: "Logo Design",
      category: "Graphics",
      description: "Logo for Authentic Vessels.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Authentic/authentic%20vessels%201.jpg",
      ],
      challenge: "Creating a unique logo for a worship team of young people.",
      process: "Designed graphics in Adobe Illustrator.",
      outcome: "Client loved the design.",
    },
    {
      title: "Breejoz Marketing Campaign Graphics",
      category: "Graphics",
      description: "A series of social media graphics for Danek and Breejoz Baby Shop.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Breejoz/Danek.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Breejoz/Danek%20(2).jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Breejoz/Dungia%20Krisi.jpg",

      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Facebook.",
      outcome: "Boosted brand awareness in the local market.",
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
      process: "Created comprehenive deck with transition animations.",
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
      companyName: "Company I worked for",
      companyLogo: "/images/logos/sap-logo.svg",
      disclaimer: "The following work was created during my tenure at Company. It is shared with permission for portfolio purposes only and remains the intellectual property of Company. The content is confidential and should not be distributed, copied, or disclosed.",
      projects: [ {
          title: "Confidential Project",
          category: "Graphics",
          description: "Still awaiting permission to showcase this projects.",
          tag: "Corporate Work",
          mediaType: "image",
          media: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Approval/Awaiting%20Consent.png",
          challenge: "Will update upon receiving permission.",
          process: "Will update upon receiving permission.",
          outcome: "Will update upon receiving permission."
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
        <p className="text-lg mb-6">Visual Designer</p>
        <Button onClick={() => scrollToSection("portfolio")}>Explore My Work</Button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce select-none">↓</div>
      </section>

      <section id="cv" className="relative max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-6">Curriculum Vitae</h2>
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">About Me</h3>
          <p className="mb-4 text-gray-700">
            Results-oriented Visual Designer and AFRIKA KOMMT! alumni with experience creating compelling visual solutions for global brands like SAP. Skilled in designing UI components , multimedia assets , and marketing collateral for diverse campaigns. Complemented by a foundational year of Computer Science study at DHBW Mosbach, which enhances the creation of practical, buildable designs and collaboration with development teams.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>Address: Walldorf, Germany</li>
            <li>Email: brianmaina.nyawira@gmail.com</li>
            <li>
              LinkedIn: <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/brian-maina-nyawira</a>
            </li>
            <li>Phone: +49 15172371222</li>
            <li>Nationality: Kenyan</li>
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
         {/* UPDATED: Skills Section with Tooltip for AI */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Skills and Technologies</h3>
          <ul className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              skill === "AI" ? (
                <li key={skill} className="relative group px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm cursor-pointer font-semibold">
                  AI
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    My take on AI is that it is a powerful tool to enhance creativity and productivity, but it cannot replace the human touch in design. I use AI tools to generate ideas and automate tasks, but always ensure my designs are original and aligned with the client&apos;s goals.
                    <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                    </svg>
                  </div>
                </li>
              ) : (
                <li key={skill} className="px-4 py-2 bg-gray-200 rounded-full text-sm">{skill}</li>
              )
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
              <li><h4 className="font-medium">Oliver Gutezeit - Manager at SAP SE</h4><p className="text-sm text-gray-600">Email: oliver.gutezeit@sap.com | Phone: +49 622 774 2260</p></li>
              <li><h4 className="font-medium">Ilka Wiskemann - Global HR Business Partner SAP SE</h4><p className="text-sm text-gray-600">Email: ilka.Wiskemann@sap.com | Phone: +49 622 776 2638</p></li>
              <li><h4 className="font-medium">Irshad Muttar - Head of Operations & IT Letshego Kenya </h4><p className="text-sm text-gray-600">Email: Irshadm@letshego.com | Phone: +254 795 359 049</p></li>
              <li><h4 className="font-medium">Arnold Muthama - Manager at Aspira</h4><p className="text-sm text-gray-600">Email: arnoldmutisya@gmail.com | Phone: +254 726 176 272</p></li>
              
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
        <h2 className="text-3xl font-semibold mb-8 text-center">Corporate Work</h2>
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
          <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          {/* <a href="https://twitter.com/brianmaina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-transform transform hover:scale-110" aria-label="X (formerly Twitter)"><SiX size={20} /></a> */}
          {/* <a href="https://instagram.com/brianmaina_design" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-transform transform hover:scale-110" aria-label="Instagram"><SiInstagram size={20} /></a> */}
          <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:brianmaina.nyawira@gmail.com")}>Contact Me</Button>
      </footer>
    </main>
  );
}

