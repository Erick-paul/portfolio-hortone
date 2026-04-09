import { motion } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { CursorContext } from "../App";

const MagneticButton = ({ children, className = "", onClick, href }) => {
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
        onClick={onClick}
        className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full overflow-hidden group bg-zinc-900 border border-zinc-800 text-zinc-100 font-medium tracking-wide transition-colors hover:border-lime-400 ${className}`}
      >
        <div className="absolute inset-0 bg-lime-400 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]" />
        <span className="relative z-10 group-hover:text-black transition-colors duration-500">
          {children}
        </span>
      </Element>
    </motion.div>
  );
};

export default MagneticButton;
