import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { CursorContext } from "../App";



// --- UTILITY HOOKS ---
// const useMousePosition = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", updateMousePosition);
//     return () => window.removeEventListener("mousemove", updateMousePosition);
//   }, []);

//   return mousePosition;
// };

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { cursorType } = useContext(CursorContext);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255,255,255,0.1)",
      mixBlendMode: "difference",
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "#a3e635",
      mixBlendMode: "normal",
    },
    project: {
      x: mousePosition.x - 50,
      y: mousePosition.y - 50,
      height: 100,
      width: 100,
      backgroundColor: "#fff",
      mixBlendMode: "difference",
    },
  };

  return (
    <motion.div
      variants={variants}
      animate={cursorType}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center"
    >
      {cursorType === "project" && (
        <span className="text-black font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
          View
        </span>
      )}
    </motion.div>
  );
};

export default CustomCursor;
