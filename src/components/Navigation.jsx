import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useContext, useState } from "react";
import { CursorContext } from "../App";

const Navigation = ({ view, setView }) => {
  const { setCursorType } = useContext(CursorContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Work", id: "projects" },
    { name: "About", id: "about" },
  ];

  const handleNavClick = (id) => {
    if (view !== id) {
      window.scrollTo(0, 0);
      setView(id);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white p-6 md:p-10 flex justify-between items-center pointer-events-none">
        <div
          className="font-bold tracking-tighter text-xl uppercase cursor-pointer pointer-events-auto"
          onClick={() => handleNavClick("home")}
          onMouseEnter={() => setCursorType("hover")}
          onMouseLeave={() => setCursorType("default")}
        >
          William Hortone
        </div>

        <button
          className="pointer-events-auto flex items-center gap-2 group"
          onClick={() => setMenuOpen(true)}
          onMouseEnter={() => setCursorType("hover")}
          onMouseLeave={() => setCursorType("default")}
        >
          <span className="uppercase text-xs font-bold tracking-widest hidden md:block">
            Menu
          </span>
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </header>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-lime-400 text-zinc-950 flex flex-col p-6 md:p-10"
          >
            <div className="flex justify-between items-center w-full">
              <div className="font-bold tracking-tighter text-xl uppercase">
                William Hortone
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 group"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <span className="uppercase text-xs font-bold tracking-widest hidden md:block">
                  Close
                </span>
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-8 md:gap-12">
              {navLinks.map((link, i) => (
                <div key={link.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.1,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <button
                      onClick={() => handleNavClick(link.id)}
                      onMouseEnter={() => setCursorType("text")}
                      onMouseLeave={() => setCursorType("default")}
                      className={`text-5xl md:text-8xl font-bold tracking-tighter uppercase relative group ${view === link.id ? "text-zinc-900" : "text-zinc-950/50 hover:text-zinc-950 transition-colors duration-300"}`}
                    >
                      {link.name}
                      <span className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                        <ArrowUpRight />
                      </span>
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end uppercase text-xs font-bold tracking-widest text-zinc-950/60">
              {/* <div className="flex gap-6">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="hover:text-zinc-950 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div> */}
              <div>willhortone@gmail.com</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
