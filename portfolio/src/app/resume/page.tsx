"use client"; 

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Button from "@/components/ui/button";
import Timeline from "@/components/Timeline";
import { TimelineSection } from "@/types";

export default function ResumePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [requestMessage, setRequestMessage] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  // Dynamic Data States
  const [experienceData, setExperienceData] = useState<TimelineSection[]>([]);
  const [educationData, setEducationData] = useState<TimelineSection[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingResume, setLoadingResume] = useState(true);

  // Fetch the data on load
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch('/api/admin/resume');
        if (res.ok) {
          const data = await res.json();
          setExperienceData(data.experience || []);
          setEducationData(data.education || []);
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error("Failed to load resume data");
      } finally {
        setLoadingResume(false);
      }
    };
    fetchResume();
  }, []);

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

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen overflow-x-hidden pt-24">
      {loadingResume ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Curriculum Vitae...</p>
        </div>
      ) : (
        <section id="cv" className="relative max-w-5xl mx-auto py-10 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-4xl font-bold mb-10 text-center"
          >
            Curriculum Vitae
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }} 
            className="mb-10"
          >
            <h3 className="text-2xl font-semibold mb-4">Professional Summary</h3>
            <p className="mb-4 text-gray-700">
              Results-oriented Visual Designer and AFRIKA KOMMT! alumni with experience creating compelling visual solutions for global brands like SAP. Skilled in designing UI components, multimedia assets, long-form document layout, editorial design and marketing collateral for diverse campaigns. Complemented by a foundational year of Computer Science study at DHBW Mosbach, which enhances the creation of practical, buildable designs and collaboration with development teams.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Address: Kikuyu, Kenya</li>
              <li>Email: brianmaina.nyawira@gmail.com</li>
              <li>
                LinkedIn: <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/brian-maina-nyawira</a>
              </li>
              <li>Primary Phone: +254 728 036 420</li>
              <li>Secondary Phone: +49 15172371222</li>
              <li>Nationality: Kenyan</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.5 }} 
            className="grid md:grid-cols-2 gap-10"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">Experience</h3>
              <Timeline sections={experienceData} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Education</h3>
              <Timeline sections={educationData} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.5 }} 
            className="mt-10"
          >
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
          </motion.div>
        </section>
      )}

      <motion.section 
        id="references" 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }} 
        className="relative max-w-5xl mx-auto py-20 px-6"
      >
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-gray-600 mb-6">Contact details are now visible. Thank you for verifying.</p>
            <ul className="space-y-6">
              <li><h4 className="font-medium">Oliver Gutzeit - Manager at SAP SE</h4><p className="text-sm text-gray-600">Email: oliver.gutzeit@sap.com | Phone: +49 622 774 2260</p></li>
              <li><h4 className="font-medium">Ilka Wiskemann - Global HR Business Partner SAP SE</h4><p className="text-sm text-gray-600">Email: ilka.wiskemann@sap.com | Phone: +49 622 776 2638</p></li>
              <li><h4 className="font-medium">Milena Schmidt - Corporate Learning Senior Specialist SAP SE</h4><p className="text-sm text-gray-600">Email: milena.schmidt@sap.com | Phone: +49 622 776 2119</p></li>
              <li><h4 className="font-medium">Britta Lehn - Manager at SAP SE</h4><p className="text-sm text-gray-600">Email: britta.lehn@sap.com | Phone: +49 622 775 4546</p></li>
              <li><h4 className="font-medium">Carola Ritzenhoff - Marketing and alumni network at AFRIKA KOMMT!</h4><p className="text-sm text-gray-600">Email: carola.ritzenhoff@giz.de | Phone: +49 228 4460 1513 </p></li>
              <li><h4 className="font-medium">Kim Champion - UI/UX Designer at SAP SE</h4><p className="text-sm text-gray-600">Email: kimchampion.work@gmail.com | Phone: +1 925 413 3896</p></li>
              <li><h4 className="font-medium">Maria Belov - UI/UX Designer at SAP SE</h4><p className="text-sm text-gray-600">Email: maria.belov@sap.com | Phone: +49 622 776 7055</p></li>
              <li><h4 className="font-medium">Anja Rosker - SAP Community Advocate</h4><p className="text-sm text-gray-600">Email: anja.rosker@sap.com | Phone: +49 622 777 1743</p></li>
              <li><h4 className="font-medium">Muhammed Maral - Software Engineer at FairUp</h4><p className="text-sm text-gray-600">Email: mami.maral@icloud.com</p></li>
              <li><h4 className="font-medium">Irshad Muttar - Head of Operations & IT Letshego Kenya </h4><p className="text-sm text-gray-600">Email: Irshadm@letshego.com | Phone: +254 795 359 049</p></li>
              <li><h4 className="font-medium">Madam Patricia E. Cheramboss - Corporate Affairs & Protocal Officer Moi University</h4><p className="text-sm text-gray-600">Email: pcheramboss@mu.ac.ke | Phone: +254 720 836 060</p></li>
              <li><h4 className="font-medium">Arnold Muthama - Manager at Aspira</h4><p className="text-sm text-gray-600">Email: arnoldmutisya@gmail.com | Phone: +254 726 176 272</p></li>
            </ul>
          </motion.div>
        )}
      </motion.section>

      <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:request@brianmaina.de")}>Contact Me</Button>
      </footer>
    </main>
  );
}