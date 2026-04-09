import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = ({ setLoading }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [setLoading]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-[200] bg-zinc-950 text-lime-400 flex flex-col justify-between p-8 md:p-16"
    >
      <div className="flex justify-between items-start text-zinc-500 uppercase tracking-widest text-xs font-bold">
        <span>William Hortone</span>
        <span>Portfolio © 2026</span>
      </div>

      <div className="flex justify-between items-end">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="text-[10vw] leading-none font-bold tracking-tighter"
          >
            INITIALIZING
          </motion.div>
        </div>
        <div className="text-[10vw] leading-none font-light tabular-nums">
          {Math.min(counter, 100)}%
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
