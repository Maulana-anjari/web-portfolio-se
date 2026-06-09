import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useCursor } from "../../context/CursorContext";

interface HeroSectionProps {
  onOpenResume: () => void;
}

export default function HeroSection({ onOpenResume }: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsHoveringButton } = useCursor();
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis for smooth scrolling
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        e.preventDefault();
        lenis.scrollTo(anchor.hash);
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  // Close menu when clicking outside
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
    <>
      {/* Floating Menu Button */}
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
                  {(
                    [
                      { name: "About", href: "/#about", isExternal: false },
                      { name: "Snapshot", href: "/#snapshot", isExternal: false },
                      { name: "Why I Build", href: "/#systems", isExternal: false },
                      { name: "Problems", href: "/#problems", isExternal: false },
                      { name: "Experience", href: "/#experience", isExternal: false },
                      { name: "Project", href: "/#work", isExternal: false },
                      { name: "Mission Map", href: "/#mission-map", isExternal: false },
                      { name: "Services", href: "/#services", isExternal: false },
                      { name: "Process", href: "/#process", isExternal: false },
                      { name: "Testimonials", href: "/#testimonials", isExternal: false },
                      { name: "Tech Stack", href: "/#tech-stack", isExternal: false },
                      { name: "Blog", href: "/blog", isExternal: true },
                      { name: "Projects", href: "/projects", isExternal: true },
                      { name: "Contact", href: "/#contact", isExternal: false },
                    ] as const
                  ).map((item, idx) => {
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

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative h-screen w-full overflow-hidden border-b border-white/5"
      >
        {/* 1. LAYER: GLOW EFFECT */}
        <div
          id="glow-bg"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(80, 200, 120, 0.45) 0%, transparent 70%)",
            filter: "blur(150px)",
            opacity: 0.6,
          }}
        />

        {/* 2. LAYER: NAV BAR */}
        <nav
          id="top-nav"
          className="absolute top-0 flex w-full items-center justify-between p-6 md:p-10 z-[100] bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block text-sm font-medium tracking-[0.2em] uppercase pointer-events-auto"
          >
            Portfolio
          </motion.div>
        </nav>

        {/* 3. LAYER: CENTER CONTENT (TYPOGRAPHY) */}
        <div className="absolute top-[8%] md:top-[18%] left-0 w-full z-40 px-6 md:px-10 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/20 to-transparent md:from-transparent md:via-transparent pt-8 md:pt-0 pointer-events-none">
          <div className="flex flex-col items-start text-left w-full max-w-full overflow-hidden pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-1 text-base md:text-xl font-medium text-white/90"
            >
              Backend Engineer & Startup Builder
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 85 }}
              className="font-[900] leading-[0.78] tracking-tighter text-neon-mint uppercase w-full"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 10rem)",
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 0 40px rgba(80, 200, 120, 0.15)",
              }}
            >
              BUILDING
              <br />
              PRODUCTION
              <br />
              BACKEND SYSTEMS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-1 text-base md:text-3xl font-bold text-white/70 tracking-tight"
            >
              Maulana Anjari Anggorokasih
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-3 max-w-[520px] text-sm md:text-lg leading-relaxed text-white/70 md:text-white/65"
            >
              I build scalable APIs, distributed systems, and backend infrastructure that power real products across enterprise, startup, and research environments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-4 flex flex-wrap items-center gap-3 pointer-events-auto"
            >
              <a
                href="mailto:maulana17anjari@gmail.com?subject=Backend%20Engineer%20Opportunity"
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                className="rounded-full bg-neon-mint px-5 py-3 text-xs md:px-6 md:text-sm font-bold text-[#111111] transition-all hover:shadow-[0_0_30px_rgba(0,255,102,0.35)]"
              >
                Let's Talk
              </a>
              <button
                type="button"
                onClick={onOpenResume}
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs md:px-6 md:text-sm font-bold text-white transition-all hover:border-neon-mint/50 hover:text-neon-mint"
              >
                View Resume
              </button>
              <a
                href="#work"
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                className="text-xs md:text-sm font-mono uppercase tracking-[0.16em] text-[#A0A0A0] transition-colors hover:text-neon-mint"
              >
                See Case Studies
              </a>
            </motion.div>
            {/* Mobile-only Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-4 flex flex-col gap-2 md:hidden"
            >
              <div className="flex gap-2 text-[10px] sm:text-xs">
                <span className="font-bold text-white tracking-widest">E</span>
                <a href="mailto:maulana17anjari@gmail.com" className="text-white/60 font-semibold tracking-wide">
                  maulana17anjari@gmail.com
                </a>
              </div>
              <div className="flex gap-2 text-[10px] sm:text-xs">
                <span className="font-bold text-white tracking-widest">T</span>
                <a href="https://wa.me/6289561386814" target="_blank" rel="noopener noreferrer" className="text-white/60 font-semibold tracking-wide">
                  +62 8956 1938 6814
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4. LAYER: PORTRAIT */}
        <motion.div
          id="portrait-container"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute bottom-0 right-0 z-20 flex items-end justify-end pointer-events-none"
        >
          <div className="relative">
            <picture className="block">
              <source srcSet="/portrait.webp" type="image/webp" />
              <img
                src="/portrait.png"
                alt="Maulana Anjari Anggorokasih Portrait"
                width="900"
                height="1200"
                referrerPolicy="no-referrer"
                className="mask-gradient-bottom h-auto max-h-[75vh] md:max-h-[85vh] w-auto origin-bottom object-cover grayscale-[0.3] transition-all duration-700 hover:grayscale-0"
              />
            </picture>
          </div>
        </motion.div>

        {/* 5. LAYER: UI DECORATIONS (BOTTOM LEFT) */}
        <div className="absolute bottom-0 left-0 z-40 hidden md:flex flex-col gap-10 md:gap-16 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[10px] md:text-xs font-medium text-[#8F8F8F]"
          >
            ©2026
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col gap-3 md:gap-4 text-[10px] md:text-xs tracking-tight"
          >
            <div className="flex gap-2 md:gap-3">
              <span className="font-bold opacity-100">E</span>
              <a onMouseEnter={() => setIsHoveringButton(true)} onMouseLeave={() => setIsHoveringButton(false)} href="mailto:maulana17anjari@gmail.com" className="opacity-70 hover:opacity-100 hover:text-neon-mint transition-all">
                maulana17anjari@gmail.com
              </a>
            </div>
            <div className="flex gap-2 md:gap-3">
              <span className="font-bold opacity-100">T</span>
              <a onMouseEnter={() => setIsHoveringButton(true)} onMouseLeave={() => setIsHoveringButton(false)} href="https://wa.me/62895619386814" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 hover:text-neon-mint transition-all">
                +62 8956 1938 6814
              </a>
            </div>
          </motion.div>
        </div>

        {/* 6. LAYER: UI DECORATIONS (BOTTOM RIGHT) */}
        <div className="absolute bottom-0 right-0 z-40 flex flex-col items-end gap-10 md:gap-16 p-8 pb-10 md:p-10 text-right">
          <div className="mr-4 md:mr-12 flex flex-col items-center gap-4 md:gap-6">
            <div className="relative h-12 md:h-16 w-[1px] bg-white/10 overflow-hidden">
              <motion.div
                animate={{ top: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-full bg-neon-mint shadow-[0_0_10px_#50C878]"
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="-rotate-90 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase opacity-60"
            >
              SCROLL
            </motion.span>
          </div>
          <div className="flex flex-col items-end gap-6 max-w-[280px] md:max-w-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-black/30 backdrop-blur-md p-4 rounded-lg md:bg-black/20 md:backdrop-blur-md md:p-3 text-right"
            >
              <p className="text-xs md:text-sm font-semibold leading-relaxed text-white/60 tracking-wide">
                Enterprise Systems
                <br />
                Startup Products
                <br />
                Research Platforms
              </p>
              <p className="mt-2 text-[10px] md:text-xs text-neon-mint font-mono uppercase tracking-[0.16em]">
                Building systems that ship.
              </p>
            </motion.div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              {[
                { name: "Twitter (X)", url: "https://x.com/maulana_anjari" },
                { name: "LinkedIn", url: "https://www.linkedin.com/in/maulana-anjari-anggorokasih" },
                { name: "GitHub", url: "https://github.com/Maulana-anjari" },
              ].map((social, sIdx) => (
                <div key={social.name} className="flex items-center gap-1">
                  <span className="text-neon-mint">/</span>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    className="relative flex overflow-hidden py-1"
                  >
                    <div className="flex">
                      {social.name.split("").map((char, cIdx) => (
                        <motion.span
                          key={cIdx}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.8 + sIdx * 0.1 + cIdx * 0.02, duration: 0.4, ease: [0.215, 0.61, 0.355, 1.0] }}
                          className="inline-block whitespace-pre"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. LAYER: SPARKLE ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-4 right-4 z-50 pointer-events-none"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="white" />
          </svg>
        </motion.div>
      </section>
    </>
  );
}
