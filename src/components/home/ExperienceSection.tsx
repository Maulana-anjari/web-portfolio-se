import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Layers, Calendar } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

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

export default function ExperienceSection() {
  const [activeExp, setActiveExp] = useState(0);
  const { setIsHoveringProject } = useCursor();

  return (
    <section
      id="experience"
      className="relative w-full bg-[#111111] py-[100px] px-6 md:px-10 lg:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Experience"
          title="Where I Have Shipped"
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
                <span className="block text-[10px] text-[#8F8F8F] mt-1 uppercase tracking-tighter">
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-3 mb-10"
                  >
                    {[
                      {
                        label: EXPERIENCES[activeExp].category,
                        icon: <Building2 size={14} className="text-amber-400" />,
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
                        icon: <Calendar size={14} className="text-neon-mint" />,
                      },
                    ].map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-white text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                          tIdx === 0
                            ? 'border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10 hover:border-amber-400/30'
                            : 'border-neon-mint/20 bg-neon-mint/5 hover:bg-neon-mint/10 hover:border-neon-mint/30'
                        }`}
                      >
                        {tag.icon}
                        {tag.label}
                      </span>
                    ))}
                  </motion.div>

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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap gap-2 pt-8 border-t border-white/5"
                >
                  {EXPERIENCES[activeExp].tech.map((tool, toolIdx) => (
                    <span
                      key={toolIdx}
                      className="text-[10px] md:text-xs font-mono font-bold text-[#A0A0A0] uppercase tracking-[0.2em]"
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
  );
}
