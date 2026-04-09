import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-20 px-4 sm:px-6 lg:px-12">
      {/* Background Glowing Orbs */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/4 left-1/4 w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#FF6F61]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] bg-[#FF6F61]/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="px-4 sm:px-6 lg:px-12 mx-auto relative z-10 w-full">
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-start w-full"
        >
          {/* TITLES */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-[12vw] sm:text-[14vw] md:text-[12vw] leading-[0.9] font-syne font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-black to-black/40 dark:from-white dark:to-white/50"
            >
              AGENCE
            </motion.h1>
          </div>

          <div className="overflow-hidden flex items-center">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "8vw", opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="h-[2px] bg-[#FF6F61] mr-4 hidden md:block"
            />
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="text-[9vw] sm:text-[10vw] md:text-[8vw] leading-[0.9] font-syne font-black tracking-tighter text-black dark:text-white"
            >
              SOLUTIONS
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="text-[10vw] sm:text-[12vw] md:text-[10vw] leading-[0.9] font-syne font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F61] to-[#ff9e95]"
            >
              DIGITALES.
            </motion.h1>
          </div>

          {/* TEXT + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-10 md:mt-12 flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-6"
          >
            <p className="text-base sm:text-lg md:text-xl text-black/60 dark:text-white/60 maxs-ws-md md:masx-w-lg font-space font-light tracking-wide">
              Nous transformons vos idées en solutions digitales innovantes chez
              WANTECH, qui se démarquent dans un monde numérique en constante
              évolution.
            </p>

            <MagneticButton className="px-6 py-3 md:px-8 md:py-4 bg-black dark:bg-white text-white dark:text-black font-semibold font-syne rounded-full group hover:bg-transparent dark:hover:bg-transparent hover:text-black dark:hover:text-white border border-transparent hover:border-black dark:hover:border-white transition-all duration-300 w-full sm:w-auto text-center">
              <span className="flex items-center justify-center space-x-2">
                <span>Start a Project</span>
                <ArrowUpRight className="group-hover:rotate-45 transition-transform" />
              </span>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 text-black/30 dark:text-white/30 font-space uppercase tracking-[0.4em] text-xs flex-col items-center"
      >
        <span className="mb-2">Scroll pour explorer</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-12 bg-gradient-to-b from-black/50 dark:from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
