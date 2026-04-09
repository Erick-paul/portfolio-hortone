import { useContext } from "react";
import { BRAND, CursorContext } from "../App";
import MagneticButton from "./MagneticButton";

const Footer = ({ setView }) => {
  const { setCursorType } = useContext(CursorContext);

  return (
    <footer className="bg-lime-400 text-zinc-950 pt-32 pb-10 px-6 md:px-10 rounded-t-[3rem] mt-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-[12vw] leading-none font-bold tracking-tighter uppercase mb-12">
          Let's Talk
        </h2>

        <div
          className="mb-24"
          onMouseEnter={() => setCursorType("hover")}
          onMouseLeave={() => setCursorType("default")}
        >
          <MagneticButton
            href={`mailto:willhortone@gmail.com`}
            className="!bg-zinc-950 !text-lime-400 !border-none hover:!text-black"
          >
            willhortone@gmail.com
          </MagneticButton>
        </div>

        <div className="w-full border-t border-zinc-950/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium tracking-wide uppercase">
          {/* Socials — uncomment when ready
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              
                key={s.name}
                href={s.url}
                className="hover:opacity-50 transition-opacity"
              >
                {s.name}
              </a>
            ))}
          </div>
          */}
          <div>
            © {new Date().getFullYear()} {BRAND.name}
          </div>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setView("home");
            }}
            className="hover:opacity-50 transition-opacity"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
