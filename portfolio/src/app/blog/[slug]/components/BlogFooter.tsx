import Button from "@/components/ui/button";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";

export default function BlogFooter() {
  return (
    <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
      <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
      <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
      <div className="flex justify-center space-x-6 mb-6">
        <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn">
          <SiLinkedin size={20} />
        </a>
        <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub">
          <SiGithub size={20} />
        </a>
        <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance">
          <SiBehance size={20} />
        </a>
      </div>
      <Button
        className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl"
        onClick={() => (window.location.href = "mailto:request@brianmaina.de")}
      >
        Contact Me
      </Button>
    </footer>
  );
}
