import { AnimatePresence } from "framer-motion";
import { Cpu, Palette, Zap } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import Preloader from "./components/Preloader";
import About from "./pages/About";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

// Import project images
import project1 from "./assets/project1.png";
import project2 from "./assets/project2.jpg";
import project3 from "./assets/project3.jpg";
import project4 from "./assets/project4.jpg";

const BRAND = {
  name: "William Hortone",
  tagline: "Engineering Digital Dimensions.",
  email: "willhortone@gmail.com",
  availability: "Software Engineer Web & mobile development.",
};

// const SOCIALS = [
//   { name: "Twitter", url: "#", icon: Twitter },
//   { name: "LinkedIn", url: "#", icon: Linkedin },
//   { name: "GitHub", url: "#", icon: Github },
// ];

const SERVICES = [
  {
    title: "Creative Development",
    description:
      "Bridging the gap between high-end design and flawless execution. I build digital experiences that feel alive, utilizing cutting-edge web technologies and experimental animation techniques.",
    icon: Palette,
    skills: ["React / Next.js", "WebGL / Three.js", "Framer Motion", "GSAP"],
  },
  {
    title: "Technical Architecture",
    description:
      "Building scalable, performant foundations. From headless CMS integrations to complex state management, ensuring the backend is as beautiful as the frontend.",
    icon: Cpu,
    skills: ["Node.js", "TypeScript", "PostgreSQL", "System Design"],
  },
  {
    title: "Motion Design",
    description:
      "Choreographing user interactions. Every hover, scroll, and click is meticulously designed to provide tactile, intuitive feedback that delights users.",
    icon: Zap,
    skills: ["Micro-interactions", "Scroll Scrollytelling", "Page Transitions"],
  },
];

const PROJECTS = [
  {
    id: "aether",
    title: "Aether Finance",
    category: "Web3 / Fintech",
    year: "2025",
    image: project1,
    color: "bg-emerald-500",
    role: "Lead Frontend Engineer",
    tech: ["React", "WebGL", "Framer Motion", "Zustand"],
    challenge:
      "Aether required a highly visual, immersive dashboard that could handle real-time blockchain data without sacrificing the premium, 60fps cinematic feel of their marketing site.",
    solution:
      "Developed a hybrid architecture using React for complex UI state alongside a custom WebGL data visualization layer. Implemented aggressive memoization and a custom indexing engine to keep the DOM light while processing thousands of data points.",
    link: "#",
  },
  {
    id: "nexus",
    title: "Nexus Studio",
    category: "Agency Portfolio",
    year: "2024",
    image: project2,
    color: "bg-indigo-500",
    role: "Creative Developer",
    tech: ["Next.js", "GSAP", "Lenis", "Prismic"],
    challenge:
      "Nexus is an award-winning creative agency. Their portfolio needed to be an award-winner itself—featuring deep scroll-jacking, complex typography reveals, and seamless page transitions.",
    solution:
      "Engineered a custom page transition router wrapping Framer Motion and standard routing. Built a library of reusable kinetic typography components to ensure content editors could create visually stunning case studies without writing code.",
    link: "#",
  },
  {
    id: "chroma",
    title: "Chroma E-Commerce",
    category: "E-Commerce",
    year: "2024",
    image: project3,
    color: "bg-rose-500",
    role: "Fullstack Developer",
    tech: ["React", "Shopify Storefront", "Tailwind"],
    challenge:
      "Modernize a legacy fashion e-commerce platform into a headless architecture while improving load times by 40% and increasing mobile conversion rates.",
    solution:
      "Rebuilt the front-end entirely using headless Shopify APIs. Implemented advanced image optimization, edge caching, and a highly tactile, app-like mobile drawer navigation system.",
    link: "#",
  },
  {
    id: "lumina",
    title: "Lumina Architecture",
    category: "Corporate Profile",
    year: "2023",
    image: project4,
    color: "bg-amber-500",
    role: "Solo Developer",
    tech: ["Vanilla JS", "Three.js", "CSS Modules"],
    challenge:
      "Create a digital presence for an architecture firm that relies heavily on 3D spatial awareness rather than traditional 2D scrolling.",
    solution:
      "Integrated a lightweight Three.js environment that reacts to user scroll, moving the camera through abstract architectural forms while overlaying rich text content.",
    link: "#",
  },
];
const EXPERIENCE = [
  {
    year: "2024 — Present",
    company: "WanTech",
    role: "Freelance - Software Engineer",
    description:
      "Leading the development of cutting-edge web applications for clients in the tech and finance sectors. Spearheaded the implementation of a custom design system that reduced development time by 30% and ensured pixel-perfect fidelity across projects.",
  },
  {
    year: "Mar-Sept2023",
    company: "Datategy",
    role: "Intern - Frontend Developer",
    description:
      " During my remote internship at Datategy, I worked as a Frontend Developer within a multidisciplinary team, collaborating closely with engineers and data scientists on a Deep Learning–driven application. This experience allowed me to contribute to the development of modern, scalable user interfaces designed to visualize and interact with machine learning outputs.",
  },
  // {
  //   year: "2019 — 2021",
  //   company: "Freelance",
  //   role: "Web Designer & Developer",
  //   description:
  //     "Designed and developed bespoke websites for boutique businesses. Handled end-to-end delivery from wireframes in Figma to deployment on Vercel.",
  // },
];

const ACHIEVEMENTS = {
  certificates: [
    {
      year: "2025",
      title: "Three.js Journey - Advanced WebGL",
      issuer: "Bruno Simon",
    },
    {
      year: "2024",
      title: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
    },
    {
      year: "2023",
      title: "Epic Web.dev Fullstack Mastery",
      issuer: "Kent C. Dodds",
    },
    {
      year: "2022",
      title: "Advanced React Patterns",
      issuer: "Frontend Masters",
    },
  ],
  hackathons: [
    {
      year: "2025",
      title: "ETHGlobal Tokyo - 1st Place",
      project: "DeFi Yield Aggregator Protocol",
    },
    {
      year: "2024",
      title: "Vercel AI Hackathon - Top 10",
      project: "Cognitive Canvas Generative UI",
    },
    {
      year: "2024",
      title: "Starknet Tokyo Hack",
      project: "Zero-Knowledge Proof Identity",
    },
    {
      year: "2023",
      title: "NASA Space Apps Challenge",
      project: "Global Nominee - Data Viz",
    },
  ],
};
export { ACHIEVEMENTS, BRAND, EXPERIENCE, PROJECTS, SERVICES };

const CursorContext = createContext();
export { CursorContext };

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("home");
  const [cursorType, setCursorType] = useState("default");
  // const [cursorType, setCursorType] = useState('default');
  // Prevent default scrollbar while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      <div className="min-h-screen bg-[#050505] cursor-none selection:bg-lime-400 selection:text-black">
        <CustomCursor />

        {/* <Projects /> */}

        {/* // <CursorContext.Provider value={{ cursorType, setCursorType }}> */}
        {/* //   <div className="bg-zinc-950 min-h-screen relative font-sans text-zinc-100 cursor-none selection:bg-lime-400 selection:text-black"> */}
        {/* <CustomCursor /> */}
        {/* <CustomCursor /> */}
        {/* <CustomCursorProject /> */}

        {/* Subtle Background Grain */}
        <div
          className="fixed inset-0 pointer-events-none z-[150] opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <AnimatePresence mode="wait">
          {isLoading && <Preloader key="preloader" setLoading={setIsLoading} />}
        </AnimatePresence>

        {!isLoading && (
          <>
            <Navigation view={view} setView={setView} />
            <main className="w-full relative z-10">
              <AnimatePresence mode="wait">
                {view === "home" && <Home key="home" setView={setView} />}
                {view === "about" && <About key="about" setView={setView} />}
                {view === "projects" && (
                  <Projects key="projects" setView={setView} />
                )}
              </AnimatePresence>
            </main>
          </>
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;700&display=swap');
          
          :root {
            --font-mono: "Space Mono", monospace;
            --font-sans: "Inter", sans-serif;
            --font-serif: "Cormorant Garamond", serif;
          }

          .font-mono { font-family: var(--font-mono); }
          .font-sans { font-family: var(--font-sans); }
          .font-serif { font-family: var(--font-serif); }

          body {
            margin: 0;
            overflow-x: hidden;
            background-color: #050505;
            cursor: none;
          }

          @media (pointer: coarse) {
            body { cursor: auto; }
          }
        `,
          }}
        />
      </div>
    </CursorContext.Provider>
  );
}
