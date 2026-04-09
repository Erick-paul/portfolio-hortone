import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AnimatedText = ({ text, className = "", type = "word", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: type === "letter" ? 0.03 : 0.08,
        delayChildren: delay,
      },
    },
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

  if (type === "letter") {
    return (
      <motion.span
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`inline-block ${className}`}
      >
        {text.split("").map((char, index) => (
          <span key={index} className="inline-block overflow-hidden pb-1">
            <motion.span variants={childVariants} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-flex flex-wrap ${className}`}
    >
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden mr-[0.25em] pb-2"
        >
          <motion.span variants={childVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};
export default AnimatedText;
