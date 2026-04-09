import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CursorContext, EXPERIENCE } from "../App";
import AnimatedText from "../components/AnimatedText";
import Footer from "../components/Footer";
import ParallaxImage from "../components/ParallaxImage";
import images from "../constants/images";

import { AnimatePresence } from "framer-motion";

const PROJECTS_DATA = [
  {
    id: 1,
    artist: "Hackathon",
    album: "Neza Technology",
    category: "Web & Mobile Challenges",
    // label: "BLOCKCHAIN",
    year: "2023",
    image: images.neza,
  },
  {
    id: 3,
    artist: "Certificate",
    album: "Neza Technology",
    category: "2e Place Winner",
    // label: "SYSTEMS",
    year: "2023",
    image: images.certificate,
  },
  {
    id: 2,
    artist: "Hackathon",
    album: "Junction China",
    category: "Web3 / AI Challenges",
    // label: "CREATIVE",
    year: "2023",
    image: images.junction3,
  },

  {
    id: 4,
    artist: "Certificate",
    album: "Junction China",
    category: "Top 5 Finalist",
    // label: "VISUALS",
    year: "2023",
    image: images.junctionCertificate,
  },
];

// --- COMPONENTS ---

const TimeDisplay = ({ CONFIG = {} }) => {
  const [time, setTime] = useState({ hours: "", minutes: "", dayPeriod: "" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: CONFIG.timeZone || "Asia/Tokyo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(now);

      setTime({
        hours: parts.find((part) => part.type === "hour")?.value || "",
        minutes: parts.find((part) => part.type === "minute")?.value || "",
        dayPeriod: parts.find((part) => part.type === "dayPeriod")?.value || "",
      });
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.timeUpdateInterval || 1000);
    return () => clearInterval(interval);
  }, [CONFIG.timeZone, CONFIG.timeUpdateInterval]);

  return (
    <time className="font-mono text-[10px] tracking-widest uppercase">
      {time.hours}
      <span className="animate-pulse">:</span>
      {time.minutes} {time.dayPeriod}
    </time>
  );
};

const ProjectItem = React.forwardRef(
  ({ project, index, onMouseEnter, onMouseLeave, isActive, isIdle }, ref) => {
    // ✅ Wrap in useRef so the object is stable across renders
    const textRefs = useRef({
      artist: React.createRef(),
      album: React.createRef(),
      category: React.createRef(),
      label: React.createRef(),
      year: React.createRef(),
    });

    useEffect(() => {
      const refs = textRefs.current; // stable reference, no lint warning
      if (isActive && window.gsap) {
        Object.entries(refs).forEach(([key, textRef]) => {
          if (textRef.current) {
            window.gsap.killTweensOf(textRef.current);
            window.gsap.to(textRef.current, {
              duration: 0.6,
              scrambleText: {
                text: project[key],
                chars: "01X-/_",
                revealDelay: 0.1,
                speed: 0.5,
              },
            });
          }
        });
      } else {
        Object.entries(refs).forEach(([key, textRef]) => {
          if (textRef.current) {
            if (window.gsap) window.gsap.killTweensOf(textRef.current);
            textRef.current.textContent = project[key];
          }
        });
      }
    }, [isActive, project]); // ✅ no warning — refs from useRef are intentionally excluded

    return (
      <li
        ref={ref}
        className={`grid grid-cols-5 md:grid-cols-12 gap-4 py-6 border-b border-zinc-900 cursor-pointer transition-opacity duration-500 ${
          isActive ? "text-lime-400" : "text-zinc-500"
        }`}
        onMouseEnter={() => onMouseEnter(index, project.image)}
        onMouseLeave={onMouseLeave}
      >
        <span
          ref={textRefs.current.artist}
          className="col-span-2 md:col-span-3 font-bold uppercase truncate"
        >
          {project.artist}
        </span>
        <span
          ref={textRefs.current.album}
          className="hidden md:block md:col-span-3 truncate uppercase opacity-60"
        >
          {project.album}
        </span>
        <span
          ref={textRefs.current.category}
          className="col-span-1 md:col-span-2 text-[10px] self-center tracking-widest"
        >
          {project.category}
        </span>
        <span
          ref={textRefs.current.label}
          className="hidden md:block md:col-span-3 text-[10px] self-center tracking-widest opacity-40"
        >
          {project.label}
        </span>
        <span
          ref={textRefs.current.year}
          className="col-span-2 md:col-span-1 text-right font-mono text-[10px] self-center"
        >
          {project.year}
        </span>
      </li>
    );
  },
);
const MusicPortfolio = ({ PROJECTS_DATA = [], CONFIG = {} }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const backgroundRef = useRef(null);
  const idleTimerRef = useRef(null);
  const idleAnimationRef = useRef(null);
  const projectItemsRef = useRef([]);

  // Load GSAP via CDN for single-file preview environment
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
      ),
      loadScript("https://assets.codepen.io/16327/ScrambleTextPlugin3.min.js"),
    ]).then(() => {
      if (window.gsap) {
        window.gsap.registerPlugin(window.ScrambleTextPlugin);
        setScriptsLoaded(true);
      }
    });
  }, []);

  const startIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current || !window.gsap) return;
    const timeline = window.gsap.timeline({ repeat: -1, repeatDelay: 1 });
    projectItemsRef.current.forEach((item, index) => {
      if (!item) return;
      timeline
        .to(
          item,
          { opacity: 0.2, duration: 0.2, ease: "power2.inOut" },
          index * 0.05,
        )
        .to(
          item,
          { opacity: 1, duration: 0.2, ease: "power2.inOut" },
          PROJECTS_DATA.length * 0.05 + index * 0.05,
        );
    });
    idleAnimationRef.current = timeline;
  }, [PROJECTS_DATA.length]);

  const stopIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) {
      idleAnimationRef.current.kill();
      idleAnimationRef.current = null;
      projectItemsRef.current.forEach(
        (item) => item && window.gsap.set(item, { opacity: 1 }),
      );
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) {
        setIsIdle(true);
        startIdleAnimation();
      }
    }, CONFIG.idleDelay || 4000);
  }, [activeIndex, startIdleAnimation, CONFIG.idleDelay]);

  const handleProjectMouseEnter = useCallback(
    (index, imageUrl) => {
      stopIdleAnimation();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      setActiveIndex(index);

      if (imageUrl && backgroundRef.current) {
        const bg = backgroundRef.current;
        bg.style.backgroundImage = `url(${imageUrl})`;
        bg.style.opacity = "0.4";
        bg.style.transform = "scale(1.05)";
      }
    },
    [stopIdleAnimation],
  );

  const handleContainerMouseLeave = useCallback(() => {
    setActiveIndex(-1);
    if (backgroundRef.current) {
      backgroundRef.current.style.opacity = "0";
      backgroundRef.current.style.transform = "scale(1)";
    }
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    if (scriptsLoaded) startIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleAnimation, scriptsLoaded]);

  return (
    <div className="relative w-full min-h-screen bg-zinc-950 flex flex-col pt-32 pb-20 px-6 md:px-10 overflow-hidden">
      <div
        ref={backgroundRef}
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 ease-out opacity-0 z-0 scale-100 pointer-events-none grayscale brightness-50"
      />

      <main
        className="relative z-10 w-full max-w-screen-2xl mx-auto flex-1 flex flex-col"
        onMouseLeave={handleContainerMouseLeave}
      >
        <div className="mb-12 flex justify-between items-end border-b border-zinc-800 pb-4">
          <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-500">
            Project Archives // 00{PROJECTS_DATA.length}
          </h1>
          <div className="flex gap-8 items-center text-[10px] font-mono text-zinc-500 uppercase">
            <span>43.9250° N, 19.5530° E</span>
            <TimeDisplay CONFIG={CONFIG} />
          </div>
        </div>

        <ul className="flex-1 flex flex-col">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              index={index}
              onMouseEnter={handleProjectMouseEnter}
              onMouseLeave={() => {}}
              isActive={activeIndex === index}
              isIdle={isIdle}
              ref={(el) => (projectItemsRef.current[index] = el)}
            />
          ))}
        </ul>
      </main>

      <div className="fixed inset-0 pointer-events-none border-[1px] border-zinc-900/30 m-6 md:m-10 z-50">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400/20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime-400/20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lime-400/20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lime-400/20" />
      </div>
    </div>
  );
};
const About = ({ setView }) => {
  const { setCursorType } = useContext(CursorContext);

  const [view] = useState("projects");

  const config = {
    timeZone: "Asia/Tokyo",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-lime-400 selection:text-zinc-950 pt-32 pb-10 px-6 md:px-10"
    >
      <div className="max-w-full mx-auto">
        <h1 className="text-[12vw] leading-[0.85] font-bold tracking-tighter uppercase mb-20">
          <AnimatedText text="The Mind" type="letter" />
          <br />
          <span className="text-lime-400">
            <AnimatedText text="Behind" type="letter" delay={0.2} />
          </span>
          <br />
          <AnimatedText text="The Code" type="letter" delay={0.4} />
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
              <ParallaxImage src={images.wh} />
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-12 text-lg text-zinc-400 leading-relaxed font-light">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 mb-6">
                Philosophy
              </h2>
              <p className="mb-6">
                I believe the web is an endless canvas. Code is merely the
                brush, and performance is the paint. A great digital experience
                doesn't just present information; it commands attention, evokes
                emotion, and remains lodged in the user's memory long after the
                tab is closed.
              </p>
              <p>
                My approach is rooted in the intersection of strict engineering
                principles and boundless creative exploration. I don't just
                build websites; I engineer interactive dimensions that brands
                can inhabit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 mb-6">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  "HTML5",
                  "CSS3",
                  "JavaScript",
                  "TypeScript",
                  "React.js",
                  "React Native",
                  "Angular",
                  "WordPress",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "PostgreSQL",
                  "Firebase",
                  "Figma",
                  "Tailwind CSS",
                  "Bootstrap",
                  "Framer Motion",
                  "GSAP",
                  "Git & GitHub",
                  "Jira",
                  "Redux",
                  "RESTful API",
                  "Python",
                  "Machine Learning",
                  "Deep Learning",
                  "TensorFlow",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 border border-zinc-800 rounded-full text-sm font-medium tracking-wide text-zinc-300 hover:border-lime-400 hover:text-lime-400 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="mt-40">
          <h2 className="text-6xl font-bold tracking-tighter uppercase mb-16 border-b border-zinc-800 pb-10">
            Experience
          </h2>
          <div className="flex flex-col">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors px-6 -mx-6 rounded-xl"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <div className="col-span-1 text-sm font-bold tracking-widest uppercase text-lime-400">
                  {exp.year}
                </div>
                <div className="col-span-1 text-2xl font-bold tracking-tight text-zinc-100">
                  {exp.company}
                </div>
                <div className="col-span-2">
                  <div className="text-xl font-medium mb-4 text-zinc-300">
                    {exp.role}
                  </div>
                  <p className="text-zinc-500 text-md leading-relaxed max-w-lg">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Hackathons & Certificates ──────────────────────────── */}
        <section className="py-32   border-t border-zinc-900 relative overflow-hidden">
          <div className="max-w-screen mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 pb-6 border-b border-zinc-900">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-xs tracking-[5px] uppercase text-lime-400 mb-4"
                >
                  Recognition
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-[11vw] md:text-[7vw] leading-[0.85] font-bold tracking-tighter uppercase"
                >
                  Hackathons
                  <br />
                  <span className="text-lime-400">&amp; Certs</span>
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-sm text-zinc-500 text-md leading-relaxed font-light lg:text-right pb-2"
              >
                I am a passionate Software Engineer driven by curiosity and the
                desire to build solutions that make a real difference. I thrive
                on working with exciting, large-scale projects that have the
                potential to create meaningful impact. Always motivated to push
                boundaries, I continually sharpen my skills and take on
                challenges that fuel both personal and professional growth.
              </motion.p>
            </div>

            {/* Hackathon rows */}
          </div>
        </section>

        <section className="bg-zinc-950 min-h-screen font-sans selection:bg-lime-400 selection:text-black">
          {/* <Navigation setView={setView} /> */}

          <AnimatePresence mode="wait">
            {view === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MusicPortfolio PROJECTS_DATA={PROJECTS_DATA} CONFIG={config} />
              </motion.div>
            )}

            {view === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-screen text-center px-10"
              >
                <div className="max-w-4xl">
                  <h1 className="text-[12vw] font-bold uppercase tracking-tighter leading-none mb-8">
                    Engineering
                    <br />
                    <span className="text-lime-400">Dimensions</span>
                  </h1>
                  <button
                    onClick={() => setView("projects")}
                    className="px-10 py-4 bg-lime-400 text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
                  >
                    Enter Archive
                  </button>
                </div>
              </motion.div>
            )}

            {view === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-40 px-10 max-w-4xl mx-auto"
              >
                <h2 className="text-6xl font-bold uppercase tracking-tighter mb-12">
                  The Human Side
                </h2>
                <p className="text-2xl text-zinc-400 font-light leading-relaxed mb-12">
                  Based in Tokyo, I draw inspiration from the city's neon-lit
                  streets and quiet shrines. I believe that street photography
                  and analog synthesis are essential counterparts to clean,
                  efficient code.
                </p>
                <div className="grid grid-cols-2 gap-10 py-10 border-t border-zinc-900">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-lime-400 mb-4 tracking-widest">
                      Certifications
                    </h3>
                    <ul className="space-y-2 text-sm text-zinc-500">
                      <li>Three.js Journey - Advanced WebGL</li>
                      <li>AWS Certified Developer Associate</li>
                      <li>Epic Web.dev Fullstack Mastery</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-lime-400 mb-4 tracking-widest">
                      Hackathons
                    </h3>
                    <ul className="space-y-2 text-sm text-zinc-500">
                      <li>ETHGlobal Tokyo - 1st Place</li>
                      <li>Vercel AI Hackathon - Top 10</li>
                      <li>Starknet Tokyo Hack</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <style
            dangerouslySetInnerHTML={{
              __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=Space+Mono&display=swap');
        
        :root {
          --color-accent: #a3e635; /* lime-400 */
        }

        body {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          background-color: #09090b;
        }

        .font-mono {
          font-family: 'Space Mono', monospace;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #09090b;
        }
        ::-webkit-scrollbar-thumb {
          background: #18181b;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a3e635;
        }
      `,
            }}
          />
        </section>
      </div>
      <Footer setView={setView} />
    </motion.div>
  );
};

export default About;
