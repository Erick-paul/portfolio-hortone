import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { CursorContext } from "../App";
import AnimatedText from "../components/AnimatedText";
import Footer from "../components/Footer";
import MagneticButton from "../components/MagneticButton";
import ParallaxImage from "../components/ParallaxImage";
import { allProjects } from "../constants/data";
// import { motion } from 'framer-motion';

import React, { useCallback } from "react";
import Introduction from "../components/Introduction";
import images from "../constants/images";

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
  ({ project, index, onMouseEnter, onMouseLeave, isActive }, ref) => {
    // ✅ Stable object across renders
    const textRefs = useRef({
      artist: React.createRef(),
      album: React.createRef(),
      category: React.createRef(),
      label: React.createRef(),
      year: React.createRef(),
    });

    useEffect(() => {
      const refs = textRefs.current; // ✅ read inside effect, no lint warning
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
    }, [isActive, project]); // ✅ textRefs.current is intentionally excluded — refs are stable

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

// ─── About images ──────────────────────────────────────────────────────────────
// const ABOUT_IMAGES = [
//   {
//     src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
//     alt: "Coding setup",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80",
//     alt: "AI visualization",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
//     alt: "Matrix code",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
//     alt: "Workspace",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
//     alt: "Tech work",
//   },
// ];

// import { useEffect, useRef } from "react";

// 'use client';

// import React from 'react';
const AdvancedTextSection = () => {
  const textToAnimate =
    "Passionate about web and mobile development, I specialize in front-end engineering while maintaining strong back-end expertise. With a growing focus on Artificial Intelligence and Machine Learning, I build intelligent, scalable, and user-centered applications. Driven by curiosity and continuous learning, I strive to take on challenging projects and contribute to innovative, high-impact digital solutions";
  const words =
    textToAnimate.match(/[\p{L}\p{N}]+[^\s\p{L}\p{N}]?|[^\s]/gu) || [];
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.04 * i,
      },
    }),
  };
  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  };
  return (
    <div className="flex items-center justify-center font-sans p-4">
      <motion.div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold text-center mask-r-from-0.5 max-w-5xl leading-relaxed"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              marginRight: "12px",
              marginTop: "10px",
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

// export default AdvancedTextSection;
// ─── Home ──────────────────────────────────────────────────────────────────────
const Home = ({ setView }) => {
  const { setCursorType } = useContext(CursorContext);

  const [hoveredProject, setHoveredProject] = useState(null);

  const sectionRef = useRef(null);
  // const aboutRef = useRef(null);

  // Shared spring mouse for floating previews
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 120, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 120, damping: 20 });

  // ✅ Add rawX and rawY to the dependency array
  useEffect(() => {
    const move = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]); // ✅ motion values are stable refs, this is safe
  // About section parallax
  // const { scrollYProgress: aboutScroll } = useScroll({
  //   target: aboutRef,
  //   offset: ["start end", "end start"],
  // });
  // const aboutImgY = useTransform(aboutScroll, [0, 1], ["-8%", "8%"]);

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
      className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-lime-400 selection:text-zinc-950"
    >
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-end p-6 md:p-10 pb-20 relative">
        <div className="max-w-full mx-auto w-full">
          <div className="mb-10 max-w-xl">
            <AnimatedText
              text="Software Engineer based in China, crafting immersive digital experiences that blur the line between design and engineering."
              className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed"
            />
          </div>

          <h1
            className="text-[14vw] md:text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase mb-6"
            onMouseEnter={() => setCursorType("text")}
            onMouseLeave={() => setCursorType("default")}
          >
            <AnimatedText text="William" type="letter" />
            <br />
            <span className="text-lime-400 flex items-center gap-4">
              <AnimatedText text="Hortone" type="letter" delay={0.2} />
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, duration: 1, type: "spring" }}
                className="hidden md:flex w-24 h-24 md:w-32 md:h-32 bg-lime-400 rounded-full text-zinc-950 items-center justify-center"
              >
                <ArrowUpRight className="w-12 h-12" />
              </motion.div>
            </span>
          </h1>
        </div>
      </section>

      {/* <section> */}
      <Introduction />
      {/* </section> */}

      {/* ─── Services / Expertise ───────────────────────────────── */}
      <section className="relative py-40 px-6 md:px-12 border-t border-zinc-900 bg-zinc-950 overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-12 gap-16">
          {/* LEFT COLUMN */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-zinc-500">
                About Me
              </h2>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-8">
            <div className="relative">
              {/* glow */}
              <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-40 pointer-events-none" />

              <div className="relative">
                <AdvancedTextSection />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── Selected Work ──────────────────────────────────────── */}
      <section
        className="py-32 px-6 md:px-10 relative overflow-hidden border-t border-zinc-900"
        ref={sectionRef}
      >
        {/* Header */}
        <div className="max-w-screen mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-zinc-900">
          <h2 className="text-[11vw] md:text-[7vw] leading-[0.85] font-bold tracking-tighter uppercase">
            Selected
            <br />
            <span className="text-lime-400">Work</span>
          </h2>
          <div className="flex flex-col items-start sm:items-end gap-3">
            <span className="text-xs text-zinc-600 tracking-[4px] uppercase font-mono">
              {String(allProjects.slice(0, 4).length).padStart(2, "0")} Projects
            </span>
            <button
              onClick={() => setView("projects")}
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("default")}
              className="text-xs text-lime-400 tracking-[3px] uppercase border-b border-lime-400 pb-0.5 hover:opacity-50 transition-opacity duration-200"
            >
              View All Archives ↗
            </button>
          </div>
        </div>

        {/* Indexed List */}
        <div className="max-w-screen mx-auto">
          {allProjects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group grid grid-cols-[40px_1fr_auto] md:grid-cols-[64px_1fr_auto_auto] items-center gap-4 md:gap-6 py-5 md:py-7 border-b border-zinc-900 hover:border-lime-400 transition-colors duration-300 cursor-none"
              onMouseEnter={() => {
                setCursorType("project");
                setHoveredProject(i);
              }}
              onMouseLeave={() => {
                setCursorType("default");
                setHoveredProject(null);
              }}
              onClick={() => setView("projects")}
            >
              <span className="text-xs tracking-[3px] text-zinc-700 group-hover:text-lime-400 transition-colors duration-300 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-4xl md:text-6xl lg:text-[5.5vw] font-bold tracking-tighter uppercase leading-none group-hover:tracking-wide transition-all duration-500 ease-out">
                {project.title}
              </h3>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase text-zinc-600 border border-zinc-800 px-3 py-1.5 rounded-full group-hover:border-zinc-600 transition-colors duration-300">
                  {project.category}
                </span>
                <span className="text-xs text-zinc-700 tracking-widest font-mono">
                  {project.year}
                </span>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-zinc-800 flex items-center justify-center text-sm group-hover:bg-lime-400 group-hover:border-lime-400 group-hover:text-zinc-950 transition-all duration-300">
                ↗
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating preview — Projects */}
        <AnimatePresence>
          {hoveredProject !== null && (
            <motion.div
              className="fixed pointer-events-none z-50 w-64 h-44 md:w-80 md:h-52 rounded overflow-hidden shadow-2xl"
              style={{
                left: mouseX,
                top: mouseY,
                translateX: 28,
                translateY: 28,
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.18 }}
            >
              <img
                src={allProjects[hoveredProject].imgSrc}
                alt={allProjects[hoveredProject].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-lime-400/10 mix-blend-overlay" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured bottom card */}
        <motion.div
          className="max-w-screen mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 rounded overflow-hidden cursor-none"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.8 }}
          onClick={() => setView("projects")}
          onMouseEnter={() => setCursorType("project")}
          onMouseLeave={() => setCursorType("default")}
        >
          <div className="aspect-video md:aspect-auto overflow-hidden relative group min-h-[260px]">
            <ParallaxImage
              src={allProjects[0].imgSrc}
              alt={allProjects[0].title}
            />
            <div className="absolute inset-0 bg-zinc-950/30 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="bg-zinc-950 p-8 md:p-12 flex flex-col justify-between min-h-[280px]">
            <div className="flex flex-col gap-6">
              <p className="text-xs tracking-[4px] uppercase text-lime-400">
                Featured Project · {allProjects[0].year}
              </p>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.85]">
                {allProjects[0].title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                {allProjects[0].description}
              </p>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-zinc-900 mt-6">
              <MagneticButton
                href={allProjects[0].link}
                className="!px-5 !py-2.5 !text-xs"
              >
                Visit Live Site
              </MagneticButton>
              <span className="text-xs text-zinc-700 tracking-[3px] uppercase">
                {allProjects[0].category}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Marquee Divider ────────────────────────────────────── */}
      <section className="py-20 overflow-hidden bg-lime-400 text-zinc-950 whitespace-nowrap flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          className="text-[8vw] font-bold tracking-tighter uppercase flex gap-10"
        >
          <span>Software Engineer</span>
          <span>•</span>
          <span>Web & mobile developmente</span>
          <span>•</span>
          <span>Software Engineer</span>
          <span>•</span>
          <span>Web & mobile developmente</span>
          <span>•</span>
          <span>Software Engineer</span>
        </motion.div>
      </section>

      {/* ─── Hackathons & Certificates ──────────────────────────── */}
      <section className="py-32 px-6 md:px-10 border-t border-zinc-900 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
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
              desire to build solutions that make a real difference. I thrive on
              working with exciting, large-scale projects that have the
              potential to create meaningful impact. Always motivated to push
              boundaries, I continually sharpen my skills and take on challenges
              that fuel both personal and professional growth.
            </motion.p>
          </div>

       
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
                  <span className="text-lime-400">Hortone</span>
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
              {/* <h2 className="text-6xl font-bold uppercase tracking-tighter mb-12">
                The Human Side
              </h2>
              <p className="text-2xl text-zinc-400 font-light leading-relaxed mb-12">
                Based in Tokyo, I draw inspiration from the city's neon-lit
                streets and quiet shrines. I believe that street photography and
                analog synthesis are essential counterparts to clean, efficient
                code.
              </p> */}
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

      <Footer setView={setView} />
    </motion.div>
  );
};

export default Home;
