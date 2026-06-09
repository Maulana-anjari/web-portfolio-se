import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useCursor } from "../../context/CursorContext";

export interface MenuItem {
  name: string;
  href: string;
  isExternal: boolean;
}

interface FloatingMenuProps {
  items: MenuItem[];
}

export default function FloatingMenu({ items }: FloatingMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsHoveringButton } = useCursor();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      className="fixed top-6 right-6 md:top-10 md:right-10 z-[1000]"
      ref={menuRef}
    >
      <motion.button
        id="menu-button"
        type="button"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHoveringButton(true)}
        onMouseLeave={() => setIsHoveringButton(false)}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group flex items-center gap-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-500 active:scale-95 relative overflow-hidden"
        style={{
          background: "rgba(10, 10, 10, 0.45)",
          backdropFilter: "blur(25px) saturate(150%)",
          WebkitBackdropFilter: "blur(25px) saturate(150%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(0, 255, 102, 0.2)",
          borderRight: "1px solid rgba(0, 255, 102, 0.2)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <span className="group-hover:animate-pulse relative z-10 transition-colors group-hover:text-[#00FF66]">
          Menu
        </span>
        <div className="flex items-center text-xs relative z-10">
          <span className="font-mono text-[#00FF66] tracking-tighter">
            &lt;&nbsp;&gt;
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="navigation-menu"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-0 top-full mt-4 w-64 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] z-[110] origin-top-right overflow-hidden"
            style={{
              background: "rgba(10, 10, 10, 0.45)",
              backdropFilter: "blur(25px) saturate(150%)",
              WebkitBackdropFilter: "blur(25px) saturate(150%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
              borderBottom: "1px solid rgba(0, 255, 102, 0.2)",
              borderRight: "1px solid rgba(0, 255, 102, 0.2)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="p-6 flex flex-col gap-2 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Terminal size={12} className="text-[#00FF66]" />
                  Menu
                </span>
                <div className="h-1 w-1 rounded-full bg-[#00FF66] animate-pulse" />
              </div>
              <div className="space-y-1">
                {items.map((item, idx) => {
                  const isActive =
                    window.location.pathname + window.location.hash === item.href ||
                    (item.href === "/blog" && window.location.pathname.startsWith("/blog")) ||
                    (item.href === "/projects" && window.location.pathname.startsWith("/projects"));
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {item.isExternal ? (
                        <Link
                          to={item.href}
                          className={`group/item flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 relative tracking-[0.02em]
                            ${isActive ? "text-[#00FF66] bg-[#00FF66]/10" : "text-white hover:text-[#00FF66] hover:bg-[#00FF66]/5"}`}
                          style={{
                            textShadow: isActive ? "0 0 8px rgba(0, 255, 102, 0.4)" : "none",
                          }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="w-0 opacity-0 group-hover/item:w-2 group-hover/item:opacity-100 transition-all duration-300 text-[#00FF66] font-mono">&gt;</span>
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={`group/item flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 relative tracking-[0.02em]
                            ${isActive ? "text-[#00FF66] bg-[#00FF66]/10" : "text-white hover:text-[#00FF66] hover:bg-[#00FF66]/5"}`}
                          style={{
                            textShadow: isActive ? "0 0 8px rgba(0, 255, 102, 0.4)" : "none",
                          }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="w-0 opacity-0 group-hover/item:w-2 group-hover/item:opacity-100 transition-all duration-300 text-[#00FF66] font-mono">&gt;</span>
                          {item.name}
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
