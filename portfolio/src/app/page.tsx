"use client"; 

import { useState, useEffect } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { X, Info, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevron icons if not already in ui/button
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
  // --- ADDED STATE ---
  const [companyProjectsToShow, setCompanyProjectsToShow] = useState<Showcase[] | null>(null);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [requestMessage, setRequestMessage] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

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
                            "Created digital and print marketing materials, including social media and web banners, catalogues, posters, in-store branding and Aspira office branding for Aspira Kenya.",
                            "Created marketing copy and designed Google Ads.",
                            "Liaised with over 50 partner retailers to get current offers and promotions used in Marketing Assets.",
                            "Conducted web and social media audits."
        ]
      },
      {
        title: "Marketing and Design Associate",
        date: "June 2022 - November 2022",
        description: "Designed marketing and brand materials for a Aspira Kenya, including social media visuals, and event branding."
      }
    ]
    },
    {
      heading: "Unicorn Stable",
      entries: [{
        title: "Apprenticeship (Video Editor)",
        date: "April 2022 - May 2022",
        description: 
                            "Learned and applied essentials in video editing, audio design, set management, and camera operation."
        
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
        date: "Graduated 2021 (Second Class Honours, Upper Division)",
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
    },
    {
      heading: "Volunteer Experience",
      entries: [
        {
          title: "jaSiriCup Visual and Web Designer",
          date: "2024 October - Present",
          description: "Spearheaded the visual design strategy for a 3-person team, securing a first-place win in the AFRIKA KOMMT\! Change Initiative competition against 6 other teams; now leading the development of the initiative's official visual brand identity and public-facing website."
        }
      ]
    }
  ];

  



  // UPDATED: New skills array (removed duplicate "Google Slides")
  const skills = ["UI/UX Design", "Graphic Design", "Motion Graphics", "Email Marketing", "Copy Writing", "Adobe Photoshop", "Adobe Illustrator", "Adobe After Effects", "Adobe Premier Pro", "Figma", "Canva", "Adobe InDesign", "Adobe Audition", "Microsoft Powerpoint", "Data Visualization", "Mailchimp", "Inkscape", "Mural", "Figjam", "Miro", "Google Slides", "HTML", "CSS", "Davinci Resolve", "Github", "Python", "Corel Draw", "AI"];

  const showcases: Showcase[] = [
    
    {
      title: "Design Services Awareness Project",
      category: "Branding",
      description: "Campagn assets.",
      tag: "Branding",
      mediaType: "image",
      media: ["https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/Spark.jpg",
      "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/Social%20media%20freak.jpg",
      "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/Peacha%20Studio%20Promo.jpg",
      "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/Heavy%20Lifting.jpg",

      ],
      challenge: "Develop design awareness services campaign.",
      process: "Created artwork in Adobe Photoshop and Illustrator.",
      outcome: "Increased awareness of services offered, sparking interest.",
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
      process: "Designed graphics in Adobe Photoshop, and Illustrator tailored for Instagram and Facebook.",
      outcome: "Boosted brand awareness in the local market.",
    },
    {
      title: "Brendas Bracelet Marketing Poster",
      category: "Graphics",
      description: "A social media poster for Brenda's Bracelet.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Brendas%20Bracelet/Artboard%201BRENDAhdpi.png",

      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Illustrator, tailored for Whatsapp.",
      outcome: "Boosted brand awareness in the local market.",
    },
    {
      title: "P.C.E.A Musa Gitau Posters",
      category: "Graphics",
      description: "A series of social media poster for P.C.E.A Musa Gitau church.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Musa%20Gitau%20Youth/Worship%20Experience.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Career%20Talk/472914574_1133714768370441_8232531068171796553_n.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Family%20week/Family%20Week.jpg",

      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Facebook.",
      outcome: "Boosted brand awareness in the local market.",
    },
    {
      title: "Maggie's Catering Posters",
      category: "Graphics",
      description: "A series of social media poster for a catering service.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Catering/Maggie's%20Catering%20Services.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Catering/Maggie's%20Catering%20Service%20Business%20Card.jpg",

      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Whatsapp and Facebook.",
      outcome: "Boosted brand awareness in the local market.",
    },

    {
      title: "Podcast artwork for Breaking Jemimah",
      category: "Graphics",
      description: "A poscast cover art for Breaking Jemimah.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Podcast/Breaking%20Jemimah.jpg",
      ],
      challenge: "Create a podcast cover image for Breaking Jemimah.",
      process: "Designed graphics in Adobe Photoshop",
      outcome: "Graphic that showcases a breaking of glass, symbolic to the shattering story.",
    },

    {
      title: "JasiriCup Website UI",
      category: "UI/UX",
      description: "Interactive Figma prototype for JasiriCup Website UI.",
      tag: "UI/UX",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/ui-dashboard/Jasiri.png",
      mediaType: "figma",
      media: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/1R5mVhiFrzl9WwTtC3txpd/JasiriCup?page-id=176%3A3&node-id=458-164&starting-point-node-id=458%3A6",
      challenge: "Create an intuitive dashboard for a social impact website.",
      process: "Conducted online research on audience, and created wireframes in Figma.",
      outcome: "Informed the development of the website for the client.",
    },
    {
      title: "Mobile App Prototype Troubleshooters",
      category: "UI/UX",
      description: "Interactive mobile prototype for IT Support App.",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/ui-dashboard/Trouble%20Shooters.png",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://embed.figma.com/proto/RYhQMvRdbgh89KQFbCVJQ6/Troubleshooters?page-id=0%3A1&node-id=17-825&viewport=315%2C330%2C0.13&scaling=scale-down&content-scaling=fixed&starting-point-node-id=12%3A421&embed-host=share",
      challenge: "Design a user-friendly mobile app interface for an IT Support Application.",
      process: "Developed wireframes and prototypes in Figma.",
      outcome: "Helped me learn fundamentals of prototyping."
    },
    {
      title: "Mobile App Prototype DUCR",
      category: "UI/UX",
      description: "Interactive mobile prototype for car spare parts shop app.",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/ui-dashboard/Ducr.png",
      tag: "UI/UX",
      mediaType: "figma",
      media: "https://embed.figma.com/proto/kAq63P1dS8XZpn6y2KDROt/Ducr?page-id=0%3A1&node-id=5-57&viewport=920%2C350%2C0.39&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5%3A57&embed-host=share",
      challenge: "Design a user-friendly mobile app interface for spare parts shop app.",
      process: "Developed wireframes and prototypes in Figma.",
      outcome: "Helped me learn fundamentals of prototyping",
    },

    {
      title: "P.C.E.A Musa Gitau Youth Christmas Events Posters",
      category: "Graphics",
      description: "A series of social media poster for P.C.E.A Musa Gitau church youth Christmas events.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Christmas%20Csntata/474595016_915777410725579_9012517728664662188_n.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Christmas%20Csntata/Sherehesha%20Krisii.jpg",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Facebook.",
      outcome: "Boosted event marketing to the local community.",
    },
    {
      title: "Kongamano la CHAWAKAMA Posters",
      category: "Graphics",
      description: "A social media poster for  CHAWAKAMA.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Chawakama/CHAWAKAMA%2024%3B4%3B2021%20.jpg",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Illustrator, tailored for Whatsapp.",
      outcome: "Boosted brand awareness in the local market.",
    },
    {
      title: "P.C.E.A Musa Gitau Youth Events Posters",
      category: "Graphics",
      description: "A social media poster for P.C.E.A Musa Gitau church youth.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Youth%20Fellowship/P.C.E.A-Rev.-Musa-Gitau-Youth-Friday-Fellowship.png",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Roadtrip/roadtrip.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Games/Games.jpg",
      ],
      
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Instagram and Facebook.",
      outcome: "Boosted event marketing to the local community.",
    },
    {
      title: "A.C.K ST Christopher's Karuga Church",
      category: "Graphics",
      description: "A social media poster for A.C.K ST Christopher's Karuga Church.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Worship%20Experience/Woship%20Experience.jpg",
      
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for WhatsApp.",
      outcome: "Boosted event marketing to the local community.",
    },
    {
      title: "Youtube Thumbnails for Evolve with Esther",
      category: "Graphics",
      description: "Youtube Thhumbnails for Evolve with Esther",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Youtube%20Thumbnail/Thumbnails.png",
      
      challenge: "Create engaging thumbnails for youtube video series.",
      process: "Designed graphics in Adobe Photoshop, tailored for Youtube.",
      outcome: "Enhance video outlook and engagement.",
    },
    {
      title: "Social Media artwork",
      category: "Graphics",
      description: "Social Media artwork",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/social/londonLM.jpg",
      
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for Telegram.",
      outcome: "Boosted brand awareness in clients online community.",
    },
    {
      title: "P.C.E.A Musa Gitau Health Board Poster",
      category: "Graphics",
      description: "A series of social media poster for COVID-19 Vaccination Drive.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Covid%2019%20awareness/Covid%2019%20JAB.jpg",
      
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Whatapp and Facebook.",
      outcome: "Helped in creating awareness on COVID-19 vaccination.",
    },
    {
      title: "P.C.E.A Emmanuel Church Prayer Night Poster",
      category: "Graphics",
      description: "A social media poster for P.C.E.A Emmanuel Church Prayer Night.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Musa%20Gitau%20Youth/Night%20of%20Prayer.jpg",
      
      challenge: "Create an engaging visual tailored for WhatsApp to invite youths to a Prayer Night.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Whatapp.",
      outcome: "Spreading the word to youth in the community about the prayer night.",
    },
    {
      title: "Graced Family Hangout Poster",
      category: "Graphics",
      description: "A series of social media poster for Graced Family hangout event.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Graced%20Family/Hangout/graced%20retreat.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Graced%20Family/Hangout/KIM%202.jpg",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for WhatsApp.",
      outcome: "Boosted event marketing to local community.",
    },
    {
      title: "P.C.E.A Musa Gitau Youth Valentines Dinner Poster",
      category: "Graphics",
      description: "A series of social media poster for P.C.E.A Musa Gitau Youth Valentines Dinner Poster.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Valentines%20Dinner/Valentines%20Dinner%202.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Valentines%20Dinner/Valentines%20Dinner.jpg",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Facebook and WhatsApp.",
      outcome: "Boosted event marketing to local community and online.",
    },
    
    {
      title: "P.C.E.A Musa Gitau Youth Valentines Dinner 2nd Edition Poster",
      category: "Graphics",
      description: "A series of social media poster for P.C.E.A Musa Gitau Youth Valentines Dinner Poster.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/valentines%20dinner%202/474816741_916344564002197_7749855537292904508_n.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/valentines%20dinner%202/474655422_916400617329925_8099537377500473090_n.jpg",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop and Illustrator, tailored for Facebook and WhatsApp.",
      outcome: "Boosted event marketing to local community and online.",
    },
    {
      title: "Stanic Sneakers Poster",
      category: "Graphics",
      description: "A series of social media poster for Sneakers Poster.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Stanik%20Sneakers/Stanic%20Sneaakers.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Stanik%20Sneakers/Stanic%20Sneaakers.png",
      ],
      challenge: "Create engaging visuals for a social media campaign.",
      process: "Designed graphics in Adobe Photoshop, tailored for WhatsApp, Instagram and Facebook.",
      outcome: "Boosted brand awareness in the local market.",
    },
    {
      title: "HUWA Brands Logo",
      category: "Graphics",
      description: "A logo for HUWA Brands.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Huwa/Huwa%20Brands%20White%20Sample%201.jpg",
      challenge: "Create a logo for Huwa Brands.",
      process: "Designed logo in Adobe Illustrator",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    
    {
      title: "Sally Cyclist Logo",
      category: "Graphics",
      description: "A logo for Sally Cyclist .",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Sally%20Cyclist/Sally%20Cyclist%20on%20white%20.jpg",
      challenge: "Create a logo for Sally Cyclist.",
      process: "Designed logo in Adobe Illustrator",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    {
      title: "Authentic Vessels Logo Design",
      category: "Graphics",
      description: "Logo for Authentic Vessels.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Authentic/authentic%20vessels%201.jpg",
      ],
      challenge: "Creating a unique logo for a worship team of young people.",
      process: "Designed logo in Adobe Illustrator.",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    {
      title: "Njema Logo",
      category: "Graphics",
      description: "A logo for Njema.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Njema/Njema%20concept%202.jpg",
      challenge: "Create a logo for Njema Publishers.",
      process: "Designed logo in Adobe Illustrator.",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    {
      title: "JasiriCup Logo",
      category: "Graphics",
      description: "A logo for jasiriCup.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Jasiricup/JasiriCup%20logo.png",
      challenge: "Create a logo for JasiriCup.",
      process: "Designed the logo in Adobe Illustrator.",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    {
      title: "Kanyakwar Logo",
      category: "Graphics",
      description: "A logo for Kanyakwar.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Kanyakwar/Blue%20Concept_2.jpg",
      challenge: "Create a logo for a football club.",
      process: "Designed logo in Adobe Illustrator.",
      outcome: "Created a modern and versatile logo that effectively represents the brand's identity.",
    },
    {
      title: "Mizizi Therapies Logo",
      category: "Graphics",
      description: "A logo for Mizizi Therapies.",
      tag: "Graphics",
      mediaType: "image",
      media: 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Mizizi/MIZIZI%20THERAPIES%20upright%20jpeg.jpg",
      challenge: "Create a logo for a child therapy consultant.",
      process: "Designed logo in Adobe Illustrator.",
      outcome: "Created an audience-appropriate logo that effectively represents the brand's identity.",
    },
    {
      title: "Morning Inspiration Artwork for Social Media",
      category: "Graphics",
      description: "  Bible Verse artwork for P.C.E.A Musa Gitau Facebook Page during the COVID-19 pandemic.",
      tag: "Graphics",
      mediaType: "image",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/1%20Thessalonians%205%3B17.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/1%20John%204%3B18%20.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/105305137_126869325721662_523079190142161469_n.png",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/105359956_126872652387996_2375115218194050620_n.png",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/114119488_141708297571098_6968834607494226061_n.jpg",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Morning%20Inspiration/115439063_141711704237424_5525665149631524814_n.jpg",
      ],
      challenge: "Create a social media artwork for morning devotion.",
      process: "Designed graphics in Adobe Illustrator and Photoshop.",
      outcome: "Kept the online community engaged during the pandemic.",
    },
    {
      title: "Car Prices Prediction Model Presentation",
      category: "Presentation",
      description: "Presentation of Machine Learning Prediction Results.",
      tag: "Slide Decks",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Algorithms%20FoIS.jpg",
      mediaType: "googleslides",
      media: "https://docs.google.com/presentation/d/e/2PACX-1vTIYm5lReqSuqb2KM_6YqYkm2kDyDh6U4YuDIKGxzSiDfc-wF8eZgvJkN12eysdCiV49AST7nYTIDr-/pubembed?start=false&loop=false&delayms=3000",
      challenge: "Create a presentation to communicate machine learning model results.",
      process: "Designed slides in Google Slides with data visualizations.",
      outcome: "Effectively communicated complex data to a technical audience.",
    },
    /*{
      title: "Presentation with Animations",
      category: "Presentation",
      description: "Strategic business presentation with animations.",
      tag: "Slide Decks",
      mediaType: "powerpoint",
      media: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Circle%20reveal.pptx",
      challenge: "Presentation animations.",
      process: "Created comprehenive deck with transition animations.",
      outcome: "Engaged audience effectively.",
    },*/
    
    {
      title: "Edge Presentation",
      category: "Presentation",
      description: "Edge Computing presentation.",
      tag: "Slide Decks",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Slide.png",
      mediaType: "presentation",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide1.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide2.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide3.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide4.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide7.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide8.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide9.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide11.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Edge/Slide10.JPG",
      
      ],
      challenge: "Communicate Edge computing to stakeholders.",
      process: "Designed cohesive slide deck.",
      outcome: "Informed the stakeholders about edge Computing.",
    },
    {
      title: "MedTech Presentation",
      category: "Presentation",
      description: "Medicine Technology presentation",
      tag: "Slide Decks",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Slide%20Image/Slide3.png",
      mediaType: "presentation",
      media: [
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide1.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide2.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide3.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide4.JPG", 
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide5.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide6.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide7.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide8.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide9.JPG",
        "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/presentations/Tomorrow%20Medicine/Slide/Slide10.JPG",
      
      ],
      challenge: "Presentation that communicates MedTech advancements.",
      process: "Created comprehenive deck with transition animations.",
      outcome: "Engaged audience effectively.",
    },
    {
      title: "Peacha Studio Promo Video",
      category: "Graphics",
      description: "Peacha Studio Promo Video.",
      tag: "Video",
      coverImage: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/peacha%202.png",
      mediaType: "video",
      media: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/Stock/Peacha%20Studio%20Campaign/Advert.mp4",
      challenge: "Create a compelling product demonstration video.",
      process: "Edited with professional transitions and effects.",
      outcome: "Achieved brand visibility.",
    },
  ];

  const companyProjects: CompanyProject[] = [
    {
      companyName: "Aspira Kenya",
      companyLogo: "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/corporate/Aspira_Logo-1.svg",
      disclaimer: "The following work was created during my tenure at Aspira Kenya. It is shared with permission for portfolio purposes only and remains the intellectual property of Aspira Kenya. The content is confidential and should not be distributed, copied, or disclosed.",
      projects: [ {
          title: "Omoka na Aspira Marketing Campaign Visual",
          category: "Graphics",
          description: "Creating Omoka na Aspira visual, including lockup and social media banners for Aspira's marketing campaign.",
          tag: "Corporate Work",
          mediaType: "image",
          media: ["https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/corporate/Aspira/476121081_1070329765122570_6522906507805961232_n.jpg",
          "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/corporate/Aspira/476615140_1075259464629600_5660429119889293216_n.jpg",
          ],
          challenge: "Create a visual that clearly emphasized that Aspira will help you finance your dreams that you may pay later. Allowing customers to get what they want now and pay later.",
          process: "Understanding and conducting audience research, creating a moodboard, working with the Marketing Lead: Arnold Muthama, refining concepts and sending for approval.",
          outcome: "Creation of a harmonized campaign visual that spanned three months, used in marketing assets such as social media artwork, catalogues, email signitures and email campaigns."
      },
      {
          title: "Soma Education Financing Campaign Visuals for Aspira Kenya",
          category: "Graphics",
          description: "Creating social media artwork for Soma Education Financing, including the product's lockup.",
          tag: "Corporate Work",
          mediaType: "image",
          media: ["https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/corporate/Aspira/480434558_1082669703888576_6404166143007094392_n.jpg",
          "https://raw.githubusercontent.com/Obrianmaina/Brian-Maina-Portfolio/main/portfolio/public/images/corporate/Aspira/481247611_1087361026752777_8786450958040780973_n.jpg",
          ],
          challenge: "Create social media artwork for Aspira's Facebook and Instagram pages that will help create awareness of Aspira's Soma Education financing, allowing back to school to be a breeze for parents as they can settle fees now and pay later.",
          process: "Understanding and conducting audience research, creating a moodboard, working with the Marketing Lead: Arnold Muthama, refining concepts and sending for approval.",
          outcome: "Creation of social media banners that enhanced the product visibilty to the online audience of parents during the back to school period."
      }
     ]
    },
    {
      companyName: "Company I worked for",
      companyLogo: "/images/logos/company-logo.svg",
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

  // --- UPDATED USEEFFECT ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setDisclaimerProject(null);
        setCompanyProjectsToShow(null); // <-- ADDED THIS LINE
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-center h-screen text-center px-6">
        {/* --- RESPONSIVENESS FIX: Adjusted font size for small screens --- */}
        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl font-bold mb-4">
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
            <h3 className="text-2xl font-semibold mb-4">Experience</h3>
            <Timeline sections={experienceData} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Education</h3>
            <Timeline sections={educationData} />
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
              <li><h4 className="font-medium">Oliver Gutzeit - Manager at SAP SE</h4><p className="text-sm text-gray-600">Email: oliver.gutzeit@sap.com | Phone: +49 622 774 2260</p></li>
              <li><h4 className="font-medium">Ilka Wiskemann - Global HR Business Partner SAP SE</h4><p className="text-sm text-gray-600">Email: ilka.wiskemann@sap.com | Phone: +49 622 776 2638</p></li>
              <li><h4 className="font-medium">Milena Schmidt - Corporate Learning Senior Specialist SAP SE</h4><p className="text-sm text-gray-600">Email: milena.schmidt@sap.com | Phone: +49 622 776 2119</p></li>
              <li><h4 className="font-medium">Britta Lehn - Manager at SAP SE</h4><p className="text-sm text-gray-600">Email: britta.lehn@sap.com | Phone: +49 622 775 4546</p></li>
              <li><h4 className="font-medium">Kim Champion - UI/UX Designer at SAP SE</h4><p className="text-sm text-gray-600">Email: kimchampion.work@gmail.com | Phone: +1 925 413 3896</p></li>
              <li><h4 className="font-medium">Maria Belov - UI/UX Designer at SAP SE</h4><p className="text-sm text-gray-600">Email: maria.belov@sap.com | Phone: +49 622 776 7055</p></li>
              <li><h4 className="font-medium">Anja Rosker - SAP Community Advocate</h4><p className="text-sm text-gray-600">Email: anja.rosker@sap.com | Phone: +49 622 777 1743</p></li>
              <li><h4 className="font-medium">Muhammed Maral - Software Engineer at FairUp</h4><p className="text-sm text-gray-600">Email: mami.maral@icloud.com</p></li>
              <li><h4 className="font-medium">Irshad Muttar - Head of Operations & IT Letshego Kenya </h4><p className="text-sm text-gray-600">Email: Irshadm@letshego.com | Phone: +254 795 359 049</p></li>
              <li><h4 className="font-medium">Madam Patricia E. Cheramboss - Corporate Affairs & Protocal Officer Moi University</h4><p className="text-sm text-gray-600">Email: pcheramboss@mu.ac.ke | Phone: +254 720 836 060</p></li>
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
        {/* --- RESPONSIVENESS FIX: Added sm:grid-cols-2 for tablet view --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShowcases.map((project, idx) => (
            <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full" onClick={() => setLightbox(project)}>
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
        {/* --- 
          RESPONSIVENESS FIX: 
          Changed breakpoints from "md:grid-cols-2 lg:grid-cols-3" 
          to "sm:grid-cols-2 md:grid-cols-3" to match the "Design Showcase" section above.
          This fixes layout inconsistencies on iPad Mini and Galaxy Z Fold 5.
        --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {companyProjects.map((project, idx) => (
            <motion.div key={project.companyName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 bg-gray-100 hover:bg-white transition-colors" onClick={() => setDisclaimerProject(project)}>
                <Image src={project.companyLogo} alt={`${project.companyName} logo`} width={128} height={64} className="h-16 w-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800">{project.companyName}</h3>
                <p className="text-sm text-teal-600 font-semibold mt-4">View Projects</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          {/* --- RESPONSIVENESS FIX: Reduced padding on small screens (p-4) --- */}
          <div role="dialog" aria-modal="true" aria-labelledby="lightbox-title" className="bg-white rounded-2xl p-4 sm:p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setLightbox(null)} aria-label="Close dialog"><X size={24} /></button>
            <h3 id="lightbox-title" className="text-2xl font-semibold mb-4">{lightbox.title}</h3>
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
          {/* --- RESPONSIVENESS FIX: Reduced padding on small screens (p-4) --- */}
          <div role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setDisclaimerProject(null)} aria-label="Close dialog"><X size={24} /></button>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full p-3 mt-1"><Info size={24} /></div>
              <div>
                <h3 id="disclaimer-title" className="text-2xl font-semibold mb-2">Notice of Confidentiality</h3>
                <p className="text-sm text-gray-700 mb-6">{disclaimerProject.disclaimer}</p>
                {/* --- RESPONSIVENESS FIX: Stacked buttons vertically on mobile --- */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
                  <Button variant="outline" onClick={() => setDisclaimerProject(null)}>Cancel</Button>
                  {/* --- UPDATED ONCLICK LOGIC --- */}
                  <Button onClick={() => {
                    if (!disclaimerProject) return;
                    if (disclaimerProject.projects.length === 1) {
                      setLightbox(disclaimerProject.projects[0]);
                    } else if (disclaimerProject.projects.length > 1) {
                      setCompanyProjectsToShow(disclaimerProject.projects);
                    }
                    setDisclaimerProject(null);
                  }}>Acknowledge & Proceed</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADDED NEW MODAL FOR COMPANY PROJECT GALLERY --- */}
      {companyProjectsToShow && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setCompanyProjectsToShow(null)}>
        {/* --- RESPONSIVENESS FIX: Reduced padding on small screens (p-4) --- */}
        <div role="dialog" aria-modal="true" aria-labelledby="gallery-title" className="bg-white rounded-2xl p-4 sm:p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setCompanyProjectsToShow(null)} aria-label="Close dialog"><X size={24} /></button>
          
          <h3 id="gallery-title" className="text-2xl font-semibold mb-2">Corporate Projects</h3>
          <p className="text-gray-600 mb-6">Please select a project to view its details.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyProjectsToShow.map((project, idx) => (
              <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <Card className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full" onClick={() => {
                  setLightbox(project); // Open the selected project
                  setCompanyProjectsToShow(null); // Close this modal
                }}>
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
        </div>
      </div>
    )}
    {/* --- END OF NEW MODAL --- */}

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