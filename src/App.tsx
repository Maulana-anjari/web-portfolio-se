/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronsUpDown,
  ArrowUpRight,
  Zap,
  Code2,
  Server,
  Database,
  Cloud,
  Box,
  Hexagon,
  Network,
  Share2,
  Terminal,
  Gauge,
  Leaf,
  Building2,
  Layers,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  X,
  Download,
} from "lucide-react";

import { BlogIndex, BlogPost } from "./components/Blog";

/**
 * Global Custom Cursor with Dynamic Transformations
 */
function GlobalCursor({
  isHoveringProject,
  isHoveringButton,
}: {
  isHoveringProject: boolean;
  isHoveringButton: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappy spring config for base state
  const springBase = { damping: 30, stiffness: 400 };
  // Heavier spring config for project hover
  const springHover = { damping: 20, stiffness: 100 };

  const cursorX = useSpring(
    mouseX,
    isHoveringProject ? springHover : springBase,
  );
  const cursorY = useSpring(
    mouseY,
    isHoveringProject ? springHover : springBase,
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        left: cursorX,
        top: cursorY,
        x: "-50%",
        y: "-50%",
        position: "fixed",
      }}
      animate={{
        width: isHoveringProject ? 80 : isHoveringButton ? 8 : 12,
        height: isHoveringProject ? 80 : isHoveringButton ? 8 : 12,
        backgroundColor: isHoveringProject
          ? "rgba(20, 20, 20, 0.9)"
          : isHoveringButton
            ? "#111111"
            : "#50C878",
        border: isHoveringProject
          ? "1px solid rgba(80, 200, 120, 0.2)"
          : "0px solid transparent",
      }}
      transition={{
        width: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        backgroundColor: { duration: 0.2, ease: "easeOut" },
      }}
      className="pointer-events-none z-[9999] flex items-center justify-center rounded-full backdrop-blur-[2px] shadow-2xl"
    >
      <AnimatePresence>
        {isHoveringProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArrowUpRight
              className="h-14 w-14 text-neon-mint"
              strokeWidth={2.5}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const EXPERIENCES = [
  {
    company: "PT Pertamina EP",
    role: "Backend Engineer",
    category: "Corporate",
    industry: "Oil & Gas",
    date: "Oct 2025 - Present • Remote",
    description:
      "Built and fixed backend features for an LLM insight platform. Successfully reduced median issue-to-merge lead time by 51.9% (from 8.09 to 3.89 days).",
    tech: ["Python", "FastAPI", "Milvus", "SQL Server"],
  },
  {
    company: "Sumbu Labs",
    role: "Backend Engineer & Co-Founder",
    category: "Startup",
    industry: "Web3 / Fintech",
    date: "Feb 2025 - Present • Hybrid",
    description:
      "Built backend foundations for SumbuPay's Web3 payment infrastructure (QRIS, MPC wallets). Engineered CAR-dano, a blockchain-backed platform that reduced vehicle-inspection turnaround by 50% while maintaining 100% uptime.",
    tech: ["Node.js", "TypeScript", "PostgreSQL", "Blockchain"],
  },
  {
    company: "Kemdiktisaintek",
    role: "Blockchain Developer Intern",
    category: "Government",
    industry: "Education / Blockchain",
    date: "Sep 2024 - Dec 2024 • Jakarta",
    description:
      "Built a blockchain-based accreditation certificate management system handling NFT minting and massive bulk data integration.",
    tech: ["Next.js", "TypeScript", "ethers.js"],
  },
  {
    company: "Pharma Chain (UGM)",
    role: "Blockchain Researcher",
    category: "Research",
    industry: "Healthcare / Supply Chain",
    date: "Oct 2023 - Jan 2024 • Hybrid",
    description:
      "Built a Hyperledger Fabric prototype with 2 independent networks, 6 organizations, and 30+ Docker containers featuring cross-chain identity sharing.",
    tech: ["Hyperledger Fabric", "Docker", "IPFS"],
  },
  {
    company: "Technocorner (UGM)",
    role: "Backend Developer",
    category: "Event",
    industry: "Tech Competition",
    date: "Nov 2022 - May 2023 • Remote",
    description:
      "Built the entire backend REST API from scratch for a national competition platform supporting 5 tracks. Implemented role-based access and Google ecosystem integrations.",
    tech: ["Python", "MongoDB", "REST API"],
  },
  {
    company: "Find-It (UGM)",
    role: "Backend Developer",
    category: "Event",
    industry: "Tech Competition",
    date: "Jan 2022 - Mar 2022 • Remote",
    description:
      "Engineered the backend REST API for a national registration platform covering 6 event categories. Handled JWT auth, team workflows, and admin verification flows.",
    tech: ["Python", "MongoDB", "JWT"],
  },
];

/**
 * Rolling Number Component for Stats
 */
function RollingNumber({
  value,
  isInView,
}: {
  value: string;
  isInView: boolean;
}) {
  const isNumber = /^\d+$/.test(value.replace("+", ""));
  if (!isNumber) return <span>{value}</span>;

  const numStr = value.replace("+", "");
  const hasPlus = value.includes("+");

  return (
    <span className="inline-flex overflow-hidden">
      {numStr.split("").map((digit, i) => (
        <span key={i} className="relative h-[1em] w-[0.6em] md:w-[0.7em]">
          <motion.div
            initial={{ y: 0 }}
            animate={isInView ? { y: `-${parseInt(digit) * 10}%` } : { y: 0 }}
            transition={{
              duration: 2 + i * 0.2, // Staggered duration
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className="flex flex-col"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n} className="flex h-full items-center justify-center">
                {n}
              </span>
            ))}
          </motion.div>
        </span>
      ))}
      {hasPlus && (
        <span className="ml-1 tracking-tighter text-neon-mint transition-transform group-hover:scale-125 duration-300">
          +
        </span>
      )}
    </span>
  );
}

function SymmetricalDivider({
  accentColor = "#00FF66",
  className = "",
}: {
  accentColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 w-full overflow-hidden ${className}`}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="font-mono text-[10px] sm:text-xs"
        style={{ color: accentColor, opacity: 0.5 }}
      >
        &lt;/
      </motion.span>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          scaleX: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: 0.4 },
        }}
        className="flex-grow h-[1px] bg-[#333333] origin-center"
      />
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="font-mono text-[10px] sm:text-xs"
        style={{ color: accentColor, opacity: 0.5 }}
      >
        &gt;
      </motion.span>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  accentColor = "#00FF66",
}: {
  label: string;
  title: string;
  accentColor?: string;
}) {
  return (
    <div className="w-full mb-12">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 mb-4">
        <motion.span
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-sm uppercase tracking-wider whitespace-nowrap"
          style={{
            color: accentColor,
            textShadow: label.toLowerCase().includes("testimonials")
              ? "0 0 10px rgba(0, 255, 102, 0.4)"
              : "none",
          }}
        >
          {label}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold max-w-xl text-white leading-tight md:text-right"
        >
          {title}
        </motion.h2>
      </div>
      <SymmetricalDivider
        accentColor={accentColor}
        className="mt-2 mb-[60px]"
      />
    </div>
  );
}

function PortfolioHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("backend");
  const [openService, setOpenService] = useState<number>(1);
  const [activeExp, setActiveExp] = useState(0);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Initialize Lenis for smooth scrolling
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

    // Fetch latest blog posts
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setBlogPosts(data.slice(0, 3)))
      .catch((err) => console.error("Error fetching blog posts:", err));

    // Optional: Sync with native锚点 links
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
    <main className="w-full bg-dark-charcoal text-white selection:bg-neon-mint selection:text-black cursor-none">
      {/* Global Custom Cursor */}
      <GlobalCursor
        isHoveringProject={isHoveringProject}
        isHoveringButton={isHoveringButton}
      />

      {/* Floating Menu Button */}
      <div
        className="fixed top-6 right-6 md:top-10 md:right-10 z-[1000]"
        ref={menuRef}
      >
        <motion.button
          id="menu-button"
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
          {/* Noise Texture Overlay */}
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
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
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
              {/* Noise Texture Overlay */}
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
                      {
                        name: "Experience",
                        href: "/#experience",
                        isExternal: false,
                      },
                      { name: "Project", href: "/#work", isExternal: false },
                      {
                        name: "Services",
                        href: "/#services",
                        isExternal: false,
                      },
                      { name: "Process", href: "/#process", isExternal: false },
                      {
                        name: "Testimonials",
                        href: "/#testimonials",
                        isExternal: false,
                      },
                      {
                        name: "Tech Stack",
                        href: "/#tech-stack",
                        isExternal: false,
                      },
                      { name: "Blog", href: "/blog", isExternal: true },
                      { name: "Contact", href: "/#contact", isExternal: false },
                    ] as const
                  ).map((item, idx) => {
                    const isActive =
                      window.location.pathname + window.location.hash ===
                        item.href ||
                      (item.href === "/blog" &&
                        window.location.pathname.startsWith("/blog"));

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
                              textShadow: isActive
                                ? "0 0 8px rgba(0, 255, 102, 0.4)"
                                : "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.textShadow =
                                "0 0 8px rgba(0, 255, 102, 0.8)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.textShadow = isActive
                                ? "0 0 8px rgba(0, 255, 102, 0.4)"
                                : "none")
                            }
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="w-0 opacity-0 group-hover/item:w-2 group-hover/item:opacity-100 transition-all duration-300 text-[#00FF66] font-mono">
                              &gt;
                            </span>
                            {item.name}
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            className={`group/item flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 relative tracking-[0.02em]
                              ${isActive ? "text-[#00FF66] bg-[#00FF66]/10" : "text-white hover:text-[#00FF66] hover:bg-[#00FF66]/5"}`}
                            style={{
                              textShadow: isActive
                                ? "0 0 8px rgba(0, 255, 102, 0.4)"
                                : "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.textShadow =
                                "0 0 8px rgba(0, 255, 102, 0.8)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.textShadow = isActive
                                ? "0 0 8px rgba(0, 255, 102, 0.4)"
                                : "none")
                            }
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="w-0 opacity-0 group-hover/item:w-2 group-hover/item:opacity-100 transition-all duration-300 text-[#00FF66] font-mono">
                              &gt;
                            </span>
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
            background:
              "radial-gradient(circle, rgba(80, 200, 120, 0.45) 0%, transparent 70%)",
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
            className="hidden md:block text-sm font-medium tracking-[0.2em] uppercase align-left pointer-events-auto"
          >
            MAULANA ANJARI ANGGOROKASIH
          </motion.div>
        </nav>

        {/* 3. LAYER: CENTER CONTENT (TYPOGRAPHY) */}
        <div className="absolute top-[12%] md:top-[20%] left-0 w-full z-40 px-6 md:px-10 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/20 to-transparent md:from-transparent md:via-transparent pt-12 md:pt-0 pointer-events-none">
          <div className="flex flex-col items-start text-left w-full max-w-full overflow-hidden pointer-events-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-base md:text-xl font-medium text-white/90"
            >
              Hey 👋, I'm a Back End Developer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="font-[900] leading-none tracking-tighter text-neon-mint uppercase whitespace-nowrap w-full"
              style={{
                fontSize: "clamp(1.8rem, 9vw, 15.5rem)",
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 0 40px rgba(80, 200, 120, 0.1)",
              }}
            >
              MAULANA ANJARI
            </motion.h1>

            {/* Mobile-only Contact Info under Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-4 flex flex-col gap-2 md:hidden"
            >
              <div className="flex gap-2 text-[10px] sm:text-xs">
                <span className="font-bold text-white tracking-widest">E</span>
                <a
                  href="mailto:maulana17anjari@gmail.com"
                  className="text-white/60 font-semibold tracking-wide"
                >
                  maulana17anjari@gmail.com
                </a>
              </div>
              <div className="flex gap-2 text-[10px] sm:text-xs">
                <span className="font-bold text-white tracking-widest">T</span>
                <a
                  href="https://wa.me/6289561386814"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 font-semibold tracking-wide"
                >
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
          className="absolute bottom-0 left-1/2 z-30 flex w-full max-w-4xl -translate-x-1/2 items-end justify-center pointer-events-none"
        >
          <div className="relative">
            <img
              src="/input_file_0.png"
              alt="Maulana Anjari Anggorokasih Portrait"
              referrerPolicy="no-referrer"
              className="mask-gradient-bottom h-auto max-h-[70vh] md:max-h-[75vh] w-auto origin-bottom object-cover grayscale-[0.3] transition-all duration-700 hover:grayscale-0"
            />
          </div>
        </motion.div>

        {/* 5. LAYER: UI DECORATIONS (BOTTOM LEFT) */}
        <div className="absolute bottom-0 left-0 z-40 hidden md:flex flex-col gap-10 md:gap-16 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="text-[10px] md:text-xs font-medium"
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
              <a
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                href="mailto:maulana17anjari@gmail.com"
                className="opacity-70 hover:opacity-100 hover:text-neon-mint transition-all"
              >
                maulana17anjari@gmail.com
              </a>
            </div>
            <div className="flex gap-2 md:gap-3">
              <span className="font-bold opacity-100">T</span>
              <a
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                href="https://wa.me/62895619386814"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 hover:text-neon-mint transition-all"
              >
                +62 8956 1938 6814
              </a>
            </div>
          </motion.div>
        </div>

        {/* 6. LAYER: UI DECORATIONS (BOTTOM RIGHT) */}
        <div className="absolute bottom-0 right-0 z-40 flex flex-col items-end gap-10 md:gap-16 p-8 pb-10 md:p-10 text-right">
          {/* Scroll Indicator */}
          <div className="mr-4 md:mr-12 flex flex-col items-center gap-4 md:gap-6">
            <div className="relative h-12 md:h-16 w-[1px] bg-white/10 overflow-hidden">
              <motion.div
                animate={{
                  top: ["100%", "-100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
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

          {/* Bio & Socials */}
          <div className="flex flex-col items-end gap-6 max-w-[280px] md:max-w-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-black/30 backdrop-blur-md p-4 rounded-lg md:bg-transparent md:backdrop-blur-none md:p-0"
            >
              <p className="text-xs md:text-sm leading-relaxed text-white/70 md:text-white/50">
                I build robust, scalable, and high-performance server-side
                applications. Main tools of choice are Python (FastAPI), Go, and
                Node.js on the backend.
              </p>
            </motion.div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              {[
                { name: "Twitter (X)", url: "https://x.com/maulana_anjari" },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/in/maulana-anjari-anggorokasih",
                },
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
                          transition={{
                            delay: 1.8 + sIdx * 0.1 + cIdx * 0.02,
                            duration: 0.4,
                            ease: [0.215, 0.61, 0.355, 1.0],
                          }}
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="white"
            />
          </svg>
        </motion.div>
      </section>

      {/* SKILLS & STATS SECTION */}
      <section
        id="about"
        className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10"
      >
        <div className="mx-auto max-w-7xl">
          {/* Top Block: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Left Column: Accordion */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-sm uppercase tracking-wider text-neon-mint underline decoration-neon-mint/30 underline-offset-8">
                //Skills
              </span>

              <div className="mt-12 flex flex-col">
                {[
                  {
                    id: "backend",
                    title: "Backend",
                    content:
                      "Go (Golang), Python (FastAPI), TypeScript (Node.js, NestJS)",
                  },
                  {
                    id: "cloud",
                    title: "Database & Cloud",
                    content:
                      "PostgreSQL, SQL Server, MongoDB, Redis, Milvus, Docker, Kubernetes",
                  },
                  {
                    id: "api",
                    title: "API & Architecture",
                    content:
                      "RESTful APIs, GraphQL, Microservices, RabbitMQ, Kafka",
                  },
                  {
                    id: "blockchain",
                    title: "Blockchain",
                    content:
                      "Cardano (Blockfrost, Mesh JS), Hyperledger Fabric, and expertise in PoA/PoS consensus mechanisms",
                  },
                ].map((item) => (
                  <div key={item.id} className="border-b border-[#333333]">
                    <button
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === item.id ? null : item.id,
                        )
                      }
                      className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
                    >
                      <span className="text-xl font-medium transition-colors group-hover:text-neon-mint">
                        {item.title}
                      </span>
                      <span className="text-2xl font-light text-neon-mint">
                        {openAccordion === item.id ? "—" : "+"}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openAccordion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 text-sm leading-relaxed text-[#A0A0A0]">
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Bio & Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start"
            >
              <p className="max-w-[450px] text-lg leading-relaxed text-[#A0A0A0]">
                I thrive on designing efficient systems, optimizing database
                queries, and creating secure API endpoints. When I'm not coding,
                I'm analyzing system design patterns, diving into cloud-native
                technologies, or ensuring server-side performance.
              </p>
              <motion.button
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(80, 200, 120, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    window.open("/resume.pdf", "_blank");
                  } else {
                    setIsPdfLoading(true);
                    setTimeout(() => {
                      setIsPdfLoading(false);
                      setIsResumeModalOpen(true);
                    }, 800);
                  }
                }}
                className="mt-10 rounded-full bg-neon-mint px-10 py-4 text-sm font-bold text-[#111111] transition-all relative overflow-hidden"
              >
                {isPdfLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-neon-mint flex items-center justify-center"
                  >
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
                My Resume
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom Block: Stats Grid */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {[
              { num: "3+", label: "Years of Back-End Exp." },
              { num: "15+", label: "High-Load Systems Built" },
              { num: "97+", label: "API Endpoints Optimized" },
            ].map((stat, idx) => (
              <div key={idx} className="group flex flex-col">
                <span className="text-6xl md:text-7xl font-bold h-[1.2em] flex items-center">
                  <RollingNumber value={stat.num} isInView={isStatsInView} />
                </span>
                <span className="mt-4 text-sm font-medium tracking-wide text-neon-mint uppercase">
                  {stat.label}
                </span>
                <div className="mt-8 h-[1px] w-full bg-[#333333] transition-colors group-hover:bg-neon-mint duration-500" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WORK EXPERIENCE SECTION */}
      <section
        id="experience"
        className="relative w-full bg-[#111111] py-[100px] px-6 md:px-10 lg:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="//Experience"
            title="My Professional Journey & Impact"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,25%)_1fr] gap-10 lg:gap-12 min-h-[600px]">
            {/* LEFT COLUMN: THE MENU */}
            <div
              data-lenis-prevent
              onWheel={(e) => {
                if (window.innerWidth < 1024) {
                  const container = e.currentTarget;
                  const containerScrollPosition = container.scrollLeft;
                  container.scrollTo({
                    top: 0,
                    left: containerScrollPosition + e.deltaY,
                  });
                }
              }}
              className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-6 pr-4 scroll-smooth custom-scrollbar"
            >
              {EXPERIENCES.map((exp, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveExp(idx)}
                  className={`flex-shrink-0 lg:flex-shrink-1 text-left p-6 rounded-xl border transition-all duration-300 w-[240px] lg:w-full group ${
                    activeExp === idx
                      ? "bg-[#1A1A1A] border-neon-mint shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                      : "bg-transparent border-[#333333] hover:bg-white/[0.03] hover:border-neon-mint/30"
                  }`}
                >
                  <span
                    className={`block text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${
                      activeExp === idx
                        ? "text-neon-mint"
                        : "text-[#888888] group-hover:text-white"
                    }`}
                  >
                    {exp.company}
                  </span>
                  <span className="block text-[10px] text-[#555555] mt-1 uppercase tracking-tighter">
                    {exp.role}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* RIGHT COLUMN: THE DETAIL VIEW */}
            <div
              className="relative min-w-0 min-h-[600px] lg:min-h-0 cursor-none group/exp-card"
              onMouseEnter={() => setIsHoveringProject(true)}
              onMouseLeave={() => setIsHoveringProject(false)}
              onClick={() => window.open("#", "_blank")}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExp}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full min-h-[600px] bg-[#1A1A1A] rounded-2xl p-8 md:p-12 border border-[#333333] flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Top Area: Massive Typography */}
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[1.1] tracking-normal mb-6 break-words"
                      style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
                    >
                      {EXPERIENCES[activeExp].company.replace(
                        "UGM",
                        "Universitas Gadjah Mada",
                      )}
                    </motion.h3>

                    {/* Subtitle */}
                    <motion.h4
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl md:text-2xl font-bold text-neon-mint mb-8"
                    >
                      {EXPERIENCES[activeExp].role.replace(
                        "UGM",
                        "Universitas Gadjah Mada",
                      )}
                    </motion.h4>

                    {/* Metadata Row */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="flex flex-wrap gap-3 mb-10"
                    >
                      {[
                        {
                          label: EXPERIENCES[activeExp].category,
                          icon: (
                            <Building2 size={14} className="text-neon-mint" />
                          ),
                        },
                        {
                          label: EXPERIENCES[activeExp].industry,
                          icon: <Layers size={14} className="text-neon-mint" />,
                        },
                        {
                          label: EXPERIENCES[activeExp].date.replace(
                            "UGM",
                            "Universitas Gadjah Mada",
                          ),
                          icon: (
                            <Calendar size={14} className="text-neon-mint" />
                          ),
                        },
                      ].map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neon-mint/20 bg-neon-mint/5 text-white text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-neon-mint/10 hover:border-neon-mint/30"
                        >
                          {tag.icon}
                          {tag.label}
                        </span>
                      ))}
                    </motion.div>

                    {/* Main Content */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-base md:text-lg text-[#CCCCCC] leading-relaxed max-w-3xl mb-12"
                    >
                      {EXPERIENCES[activeExp].description.replace(
                        "UGM",
                        "Universitas Gadjah Mada",
                      )}
                    </motion.p>
                  </div>

                  {/* Bottom Area: Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap gap-2 pt-8 border-t border-white/5"
                  >
                    {EXPERIENCES[activeExp].tech.map((tool, toolIdx) => (
                      <span
                        key={toolIdx}
                        className="text-[10px] md:text-xs font-mono font-bold text-white/40 uppercase tracking-[0.2em]"
                      >
                        {tool}
                        {toolIdx < EXPERIENCES[activeExp].tech.length - 1
                          ? " • "
                          : ""}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE WORK SECTION */}
      <section
        id="work"
        className="relative w-full bg-[#121212] py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Explore Work"
            title="A Showcase of My Latest Complex Systems"
          />

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            {[
              {
                title: "Enterprise LLM Insight Engine",
                desc: "Architected a high-performance backend utilizing Retrieval-Augmented Generation (RAG) and vector databases to process enterprise data, reducing issue-to-merge lead time by 51%.",
                tags: ["Python", "FastAPI", "Milvus", "SQL Server"],
                img: "/images/llm-pertamina-project.png",
              },
              {
                title: "SumbuPay Web3 Gateway",
                desc: "Built the core backend infrastructure for a Web3 payment gateway, integrating complex MPC wallet workflows and QRIS to bridge fiat and decentralized ecosystems securely.",
                tags: ["Node.js", "TypeScript", "Web3", "PostgreSQL"],
                img: "/images/SumbuPay-project.png",
              },
              {
                title: "PharmaChain Distributed Network",
                desc: "Engineered a highly complex Hyperledger Fabric prototype consisting of 2 independent networks, 6 organizations, and 30+ Docker containers with cross-chain identity sharing.",
                tags: ["Hyperledger", "Docker", "IPFS", "Go"],
                img: "/images/pharmachain-project.png",
              },
              {
                title: "CAR-dano Inspection Engine",
                desc: "Engineered a highly optimized backend for a blockchain-backed vehicle inspection platform. Halved operational turnaround times while maintaining 100% uptime and 2x faster response speeds for concurrent users.",
                tags: ["Node.js", "Cardano", "PostgreSQL", "Prisma"],
                img: "/images/CAR-dano-project.png",
              },
            ].map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onMouseEnter={() => setIsHoveringProject(true)}
                onMouseLeave={() => setIsHoveringProject(false)}
                className="group flex flex-col gap-6 cursor-none"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-[#1A1A1A]">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="h-full w-full object-cover grayscale-[0.5] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-neon-mint">
                    {project.title}
                  </h3>
                  <p className="text-[#A0A0A0] leading-relaxed line-clamp-2">
                    {project.desc}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neon-mint/20 bg-neon-mint/5 px-4 py-1.5 text-[12px] font-medium text-neon-mint transition-all hover:bg-neon-mint/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-[60px] flex justify-center"
          >
            <motion.button
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(80, 200, 120, 0.45)",
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-neon-mint px-10 py-5 text-sm font-bold text-[#111111] transition-all"
            >
              View More Projects
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Service"
            title="End-to-End Back-End Engineering Services"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
            {/* Left Column: Image Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[#1A1A1A] group"
            >
              <img
                src="https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1000&auto=format&fit=crop"
                alt="Cloud Architecture Visualization"
                className="h-full w-full object-cover grayscale transition-transform duration-[800ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-mint/10 to-transparent mix-blend-overlay" />
            </motion.div>

            {/* Right Column: Service Accordion List */}
            <div className="flex flex-col w-full">
              {[
                {
                  id: 1,
                  title: "Custom Back End Development",
                  num: "(01)",
                  desc: "Build secure & maintainable server-side logic using modern patterns and rock-solid architectural foundations.",
                },
                {
                  id: 2,
                  title: "API Design & Development",
                  num: "(02)",
                  desc: "High-performance RESTful & gRPC APIs designed for maximum throughput, low latency, and developer-friendly documentation.",
                },
                {
                  id: 3,
                  title: "Database Architecture & Optimization",
                  num: "(03)",
                  desc: "Expert-level schema design, indexing strategies, and performance tuning for PostgreSQL, MongoDB, and Redis.",
                },
                {
                  id: 4,
                  title: "Microservices & Cloud Deployment",
                  num: "(04)",
                  desc: "Transitioning monoliths to scalable microservices with Docker, Kubernetes, and automated CI/CD pipelines.",
                },
              ].map((service) => (
                <div
                  key={service.id}
                  className="border-b border-[#333333] group"
                >
                  <button
                    onClick={() => setOpenService(service.id)}
                    className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
                  >
                    <span
                      className={`text-xl font-semibold transition-all duration-300 ${
                        openService === service.id
                          ? "text-white"
                          : "text-[#A0A0A0] group-hover:text-white"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span className="font-mono text-xs text-[#A0A0A0] opacity-60">
                      {service.num}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openService === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 space-y-4">
                          <p className="text-[#A0A0A0] text-[15px] leading-relaxed max-w-md">
                            {service.desc}
                          </p>
                          <a
                            href="#contact"
                            onMouseEnter={() => setIsHoveringButton(true)}
                            onMouseLeave={() => setIsHoveringButton(false)}
                            className="inline-block text-neon-mint text-sm font-semibold tracking-wide hover:underline underline-offset-4"
                          >
                            Hire Me ↗
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK PROCESS SECTION */}
      <section
        id="process"
        className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Work Process"
            title="My Reliable Development Workflow"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Plan & Architect",
                desc: "Dive deep into technical constraints, design database schemas, and define API contracts.",
              },
              {
                num: "02",
                title: "Develop & Test",
                desc: "Implement core logic, write robust unit & integration tests, and ensure maximum code coverage.",
              },
              {
                num: "03",
                title: "Deploy & Monitor",
                desc: "Set up CI/CD pipelines, containerize with Docker, and configure cloud monitoring tools.",
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`group flex flex-col items-start p-10 md:p-12 ${
                  idx < 2
                    ? "md:border-r border-[#333333] border-b md:border-b-0"
                    : "border-b md:border-b-0"
                } border-[#333333]`}
              >
                {/* Cropped Number Container */}
                <div className="w-full overflow-hidden">
                  <h3
                    className="mb-2 font-[800] leading-none text-neon-mint select-none -translate-x-[25px] md:-translate-x-[45px]"
                    style={{
                      fontSize: "clamp(6rem, 10vw, 9rem)",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {step.num}
                  </h3>
                </div>

                <h4 className="text-2xl font-bold text-white mb-4 relative z-10">
                  {step.title}
                </h4>
                <p className="text-[#A0A0A0] text-[15px] leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Testimonials"
            title="What Clients Say About My Technical Expertise"
          />

          {/* Main Testimonial Layout */}
          <div className="relative">
            {/* Giant Quotation Mark */}
            <span
              className="absolute -top-12 left-0 z-0 select-none font-serif font-black leading-none text-[#00FF66]/10"
              style={{ fontSize: "20rem" }}
            >
              “
            </span>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              {/* Quote Text */}
              <div className="md:ml-20 max-w-full md:max-w-[70%]">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-lg md:text-[32px] font-medium leading-[1.4] text-white"
                >
                  "Working with Maulana was one of the best decisions we made
                  for our web platform. He understood our vision, delivered
                  clean & scalable back-end code, and communicated clearly
                  throughout the project."
                </motion.p>

                {/* Navigation Buttons */}
                <div className="mt-12 flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#222222] transition-colors hover:bg-[#333333]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 12H5M5 12L12 19M5 12L12 5"
                        stroke="#A0A0A0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(0, 255, 102, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Client Info Block */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 md:mb-4 w-full md:w-auto"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/52191436?v=4"
                  alt="Giga Hidjrika"
                  className="h-16 w-16 rounded-[8px] object-cover grayscale brightness-75"
                />
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold text-white">
                    Giga Hidjrika
                  </span>
                  <span className="text-sm text-[#A0A0A0]">
                    CEO, Sumbu Labs
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section
        id="tech-stack"
        className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Tech Stack"
            title="Core Technologies I Use For Complex Systems"
          />

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-[#333333]">
            {[
              { name: "Go (Golang)", icon: Zap, highlight: true },
              { name: "Python", icon: Code2 },
              { name: "TypeScript", icon: Server },
              { name: "PostgreSQL", icon: Database },
              { name: "SQL Server", icon: Database },
              { name: "MongoDB", icon: Leaf },
              { name: "Redis", icon: Gauge },
              { name: "Milvus", icon: Database },
              { name: "Cardano", icon: Zap },
              { name: "Hyperledger", icon: Layers },
              { name: "Docker", icon: Box },
              { name: "Kubernetes", icon: Hexagon },
            ].map((tech, idx) => (
              <div
                key={tech.name}
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                className={`group relative flex h-[120px] items-center justify-center border-b border-r border-[#333333] transition-all duration-300 ${
                  tech.highlight
                    ? "bg-[#00FF66] text-[#111111]"
                    : "bg-transparent text-[#888888] hover:bg-[#00FF66] hover:text-[#111111]"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center px-2">
                  <tech.icon
                    className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-300 ${
                      tech.highlight
                        ? "text-[#111111]"
                        : "text-[#888888] group-hover:text-[#111111]"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] md:text-sm font-semibold tracking-wide uppercase">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS SECTION */}
      <section
        id="blog"
        className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <SectionHeader
            label="//Blogs"
            title="Back-End Insights & Architectural Ideas"
          />

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.length > 0
              ? blogPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    onMouseEnter={() => setIsHoveringProject(true)}
                    onMouseLeave={() => setIsHoveringProject(false)}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-[12px] bg-[#1A1A1A]">
                      <img
                        src={
                          post.img ||
                          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
                        }
                        alt={post.title}
                        className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00FF66]">
                        {post.tags?.[0] || "//POST"}
                      </span>
                      <span className="text-[#666666]">|</span>
                      <span className="text-xs text-[#A0A0A0]">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-[#00FF66] line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-[#888888] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </Link>
                ))
              : [1, 2, 3].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 animate-pulse opacity-20"
                  >
                    <div className="aspect-video bg-white/5 rounded-[12px]" />
                    <div className="h-4 w-1/2 bg-white/5 rounded" />
                    <div className="h-6 w-full bg-white/5 rounded" />
                  </div>
                ))}
          </div>

          {/* Bottom CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-[60px] flex justify-center"
          >
            <Link
              to="/blog"
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              className="rounded-full bg-[#00FF66] px-10 py-5 text-sm font-bold text-[#111111] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,102,0.45)]"
            >
              Explore Full Archive
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER & FINAL CTA SECTION */}
      <footer
        id="contact"
        className="relative w-full bg-[#121212] overflow-hidden"
      >
        {/* Massive Background Repeating Text */}
        <div className="absolute bottom-[2%] md:bottom-[-5%] left-0 w-full z-[20] pointer-events-none select-none overflow-hidden">
          <h2
            className="whitespace-nowrap font-black uppercase text-center opacity-[0.05] md:opacity-[0.03]"
            style={{
              fontSize: "clamp(5rem, 18vw, 20rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.8,
            }}
          >
            BACKEND
          </h2>
        </div>

        <div className="mx-auto max-w-7xl px-10 md:px-20 relative z-10 pt-[150px] pb-20">
          {/* Main CTA Area - Typographic Lockup */}
          <div className="flex flex-col items-center justify-center text-center mb-[100px] w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-0"
            >
              {/* Top Block */}
              <h2
                className="font-black text-white leading-[0.9] tracking-tighter uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
              >
                Ready to Elevate
              </h2>

              {/* Middle Block: Text + Button (Button hidden on mobile here) */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 my-1 md:my-2">
                <div className="flex flex-col items-center md:items-end leading-[0.9]">
                  <span
                    className="font-black text-white uppercase tracking-tighter"
                    style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
                  >
                    Your
                  </span>
                  <span
                    className="font-black text-neon-mint uppercase tracking-tighter"
                    style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
                  >
                    Back-end
                  </span>
                </div>

                {/* Desktop Button */}
                <div className="relative flex-shrink-0 hidden md:block">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                    style={{
                      width: "600px",
                      height: "600px",
                      background:
                        "radial-gradient(circle, rgba(0, 255, 102, 0.2) 0%, transparent 65%)",
                      filter: "blur(60px)",
                    }}
                  />

                  <motion.button
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 40px rgba(0, 255, 102, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="group relative z-10 flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.3)]"
                  >
                    <span className="text-center text-sm font-bold text-black/90 px-4">
                      Start Project
                    </span>
                    <div className="absolute inset-0 rounded-full border border-black/5 scale-110 group-hover:scale-125 transition-transform duration-500" />
                  </motion.button>
                </div>
              </div>

              {/* Bottom Block */}
              <h2
                className="font-black text-white leading-[0.9] tracking-tighter uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
              >
                Infrastructure?
              </h2>

              {/* Mobile Button - Repositioned below text */}
              <div className="relative flex-shrink-0 md:hidden mt-10">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                  style={{
                    width: "400px",
                    height: "400px",
                    background:
                      "radial-gradient(circle, rgba(0, 255, 102, 0.2) 0%, transparent 65%)",
                    filter: "blur(40px)",
                  }}
                />

                <motion.button
                  onMouseEnter={() => setIsHoveringButton(true)}
                  onMouseLeave={() => setIsHoveringButton(false)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="group relative z-10 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.3)]"
                >
                  <span className="text-center text-sm font-bold text-black/90 px-4">
                    Start Project
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Section Divider with accents */}
          <SymmetricalDivider className="my-20 px-1" />

          {/* Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-20">
            {/* Left Side: Links & Contact */}
            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555] font-bold">
                    Quick links
                  </span>
                  <div className="flex flex-col gap-3">
                    {["HOME", "ABOUT", "WORKS", "BLOGS", "CONTACT"].map(
                      (link) => (
                        <a
                          key={link}
                          href={`#${link.toLowerCase()}`}
                          className="text-xs font-semibold text-white/70 hover:text-[#00FF66] transition-colors"
                        >
                          {link}
                        </a>
                      ),
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555] font-bold">
                    Portfolio
                  </span>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        name: "GITHUB",
                        url: "https://github.com/Maulana-anjari",
                      },
                      { name: "GITLAB", url: "#" },
                      { name: "LEETCODE", url: "#" },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-white/70 hover:text-[#00FF66] transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#555555] font-bold">
                    Social Link
                  </span>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        name: "GITHUB",
                        url: "https://github.com/Maulana-anjari",
                      },
                      {
                        name: "LINKEDIN",
                        url: "https://www.linkedin.com/in/maulana-anjari-anggorokasih",
                      },
                      {
                        name: "TWITTER (X)",
                        url: "https://x.com/maulana_anjari",
                      },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-white/70 hover:text-[#00FF66] transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-20 space-y-4">
                <a
                  href="mailto:maulana17anjari@gmail.com"
                  className="block text-[clamp(14px,4.5vw,24px)] md:text-3xl font-bold text-white hover:text-[#00FF66] transition-colors whitespace-nowrap"
                >
                  maulana17anjari@gmail.com
                </a>
                <a
                  href="https://wa.me/62895619386814"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[clamp(16px,5vw,20px)] md:text-2xl font-bold text-white hover:text-[#00FF66] transition-colors"
                >
                  +62 8956 1938 6814
                </a>
              </div>

              {/* Legal Bar */}
              <div className="mt-20 pt-8 border-t border-[#333333] flex flex-wrap gap-x-8 gap-y-4 justify-between md:justify-start">
                {["404", "PRIVACY POLICY", "TERM & CONDITION"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[10px] tracking-[0.1em] text-[#A0A0A0] hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side: Portrait */}
            <div className="relative flex items-end min-h-[400px] justify-center lg:justify-end">
              <motion.img
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 0.7, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                src="/input_file_0.png"
                alt="Maulana Anjari Footer"
                className="h-full w-auto object-cover grayscale brightness-75"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {isResumeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsResumeModalOpen(false)}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10"
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[90vh] bg-[#0A0A0A] rounded-xl border border-[#00FF66]/20 flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Top Bar */}
              <div className="h-12 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00FF66] font-bold">
                  // RESUME_VIEWER_V1.0
                </span>
                <div className="flex items-center gap-6">
                  <a
                    href="/resume.pdf"
                    download
                    className="text-white hover:text-[#00FF66] transition-colors"
                    title="Download Resume"
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="text-white hover:text-[#00FF66] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Content */}
              <div className="flex-grow bg-[#111111] relative z-10 flex flex-col">
                <object
                  data="/resume.pdf"
                  type="application/pdf"
                  className="w-full h-full flex-grow"
                >
                  <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#00FF66]/10 flex items-center justify-center">
                      <Download size={32} className="text-[#00FF66]" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium">
                        Unable to display PDF directly
                      </p>
                      <p className="text-gray-400 text-sm mt-1 max-w-sm">
                        It seems your browser or an extension (like an
                        ad-blocker) is blocking the PDF viewer.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        className="px-8 py-3 bg-[#00FF66] text-black font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
                      >
                        Open PDF in New Tab
                      </a>
                      <a
                        href="/resume.pdf"
                        download
                        className="px-8 py-3 border border-[#00FF66]/30 text-white font-bold rounded-full transition-transform hover:bg-white/5 active:scale-95"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                </object>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  return (
    <BrowserRouter>
      <GlobalCursor
        isHoveringProject={isHoveringProject}
        isHoveringButton={isHoveringButton}
      />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
