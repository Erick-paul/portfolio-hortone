import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { createContext, useContext, useRef, useState } from "react";
import { allProjects } from "../constants/data";

// --- CONTEXTS ---
const CursorContext = createContext({
  cursorType: "default",
  setCursorType: () => {},
});

// --- CUSTOM CURSOR ---
// const CustomCursor = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const { cursorType } = useContext(CursorContext);

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", updateMousePosition);
//     return () => window.removeEventListener("mousemove", updateMousePosition);
//   }, []);

//   const variants = {
//     default: { x: mousePosition.x - 16, y: mousePosition.y - 16, height: 32, width: 32, backgroundColor: "rgba(255,255,255,0.1)", mixBlendMode: "difference" },
//     hover: { x: mousePosition.x - 40, y: mousePosition.y - 40, height: 80, width: 80, backgroundColor: "#a3e635", mixBlendMode: "normal" },
//     project: { x: mousePosition.x - 50, y: mousePosition.y - 50, height: 100, width: 100, backgroundColor: "#fff", mixBlendMode: "difference" },
//   };

//   return (
//     <motion.div
//       variants={variants}
//       animate={cursorType}
//       transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
//       className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center"
//     >
//       {cursorType === "project" && (
//         <span className="text-black font-mono text-[10px] tracking-[0.3em] uppercase font-bold">View</span>
//       )}
//     </motion.div>
//   );
// };

// --- SHARED UI COMPONENTS ---
const AnimatedText = ({ text, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
  };

  const childVariants = {
    hidden: { y: "120%", opacity: 0, rotateZ: 5 },
    visible: {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-block ${className}`}
    >
      {text.split("").map((char, index) => (
        <span key={index} className="inline-block overflow-hidden pb-2">
          <motion.span variants={childVariants} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

const ParallaxImage = ({ src, alt, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden relative w-full h-full ${className}`}
    >
      <motion.img
        style={{ y, height: "130%", top: "-15%" }}
        src={src}
        alt={alt}
        className="absolute left-0 w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
      />
    </div>
  );
};

const MagneticButton = ({ children, className = "", href }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setCursorType } = useContext(CursorContext);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setCursorType("default");
  };

  const Element = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={() => setCursorType("hover")}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative inline-block"
    >
      <Element
        href={href}
        target="_blank"
        className={`relative inline-flex items-center justify-center px-10 py-5 rounded-full overflow-hidden group bg-white text-black font-mono text-[10px] tracking-widest uppercase font-bold transition-all hover:bg-lime-400 ${className}`}
      >
        <span className="relative z-10">{children}</span>
      </Element>
    </motion.div>
  );
};

// --- PORTFOLIO DATA ---
// const ALL_PROJECTS = [
//   {
//     title: "Aether Finance",
//     category: "DeFi / Web3",
//     year: "2025",
//     imgSrc:
//       "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop",
//     description:
//       "An immersive, cinematic dashboard for real-time blockchain analytics, built to handle thousands of data points at 60fps.",
//     link: "#",
//     tags: ["React", "WebGL", "Framer Motion"],
//   },
//   {
//     title: "Nexus Studio",
//     category: "Agency Site",
//     year: "2024",
//     imgSrc:
//       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
//     description:
//       "Award-winning portfolio featuring deep scroll-jacking, complex kinetic typography reveals, and seamless page transitions.",
//     link: "#",
//     tags: ["Next.js", "GSAP", "Prismic"],
//   },
//   {
//     title: "Chroma Core",
//     category: "E-Commerce",
//     year: "2024",
//     imgSrc:
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
//     description:
//       "A headless, high-performance fashion platform engineered to drastically improve mobile conversion rates and load times.",
//     link: "#",
//     tags: ["Shopify API", "Tailwind", "Zustand"],
//   },
//   {
//     title: "Lumina Arch",
//     category: "Spatial UI",
//     year: "2023",
//     imgSrc:
//       "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
//     description:
//       "An exploratory digital space for an architectural firm, utilizing Three.js to navigate 3D environments via scroll.",
//     link: "#",
//     tags: ["Three.js", "GLSL", "React Fiber"],
//   },
// ];

const Projects = ({ setView }) => {
  const { setCursorType } = useContext(CursorContext);

  return (
    <section className="bg-[#050505] text-white py-40 px-6 md:px-16 w-full overflow-hidden relative z-20">
      <div className="max-w-screen-2xl mx-auto mb-40 text-center md:text-left">
        <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-bold tracking-tighter uppercase mb-10 font-sans">
          <AnimatedText text="Selected" />
          <br />
          <span className="text-lime-400 font-serif italic font-light">
            <AnimatedText text="Archives" delay={0.2} />
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/50 max-w-2xl font-light font-sans"
        >
          A collection of digital experiences, platforms, and interactive
          campaigns engineered over the years.
        </motion.p>
      </div>

      <div className="flex flex-col gap-32 md:gap-40 max-w-screen-2xl mx-auto relative">
        <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/5 hidden lg:block" />

        {allProjects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24 items-center group relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] md:text-[20vw] font-serif italic text-white/[0.02] pointer-events-none z-0 selection:bg-transparent">
              0{i + 1}
            </div>

            <div
              className={`lg:col-span-7 relative z-10 ${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
            >
              <div
                className={`w-full overflow-hidden rounded-xl relative ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-video md:aspect-[16/10]"} bg-white/5`}
                onMouseEnter={() => setCursorType("project")}
                onMouseLeave={() => setCursorType("default")}
              >
                <ParallaxImage src={project.imgSrc} alt={project.title} />
                <div className="absolute inset-0 bg-lime-400 mix-blend-overlay opacity-10 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>

            <div
              className={`lg:col-span-5 flex flex-col gap-8 relative z-10 ${i % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
            >
              <div>
                <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-lime-400 mb-6">
                  {/* <span>{project.year}</span> */}
                  {/* <span className="w-1 h-1 rounded-full bg-white/20" /> */}
                  <span>{project.category}</span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-6 text-white group-hover:text-lime-400 transition-colors duration-500">
                  {project.title}
                </h2>

                <p className="text-white/60 text-base md:text-lg font-light font-sans leading-relaxed mb-8">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <MagneticButton href={project.link}>Live view </MagneticButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* <Footer setView={setView} /> */}
    </section>
  );
};

export default Projects;

/**
 * Main App Execution Wrapper
 */
