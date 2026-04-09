import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
        style={{ y }}
        src={src}
        alt={alt}
        className="absolute top-[-15%] left-0 w-full h-[130%] object-cover"
      />
    </div>
  );
};

export default ParallaxImage;
