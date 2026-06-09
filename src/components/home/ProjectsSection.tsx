import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

export default function ProjectsSection() {
  const { setIsHoveringProject, setIsHoveringButton } = useCursor();

  return (
    <section
      id="work"
      className="relative w-full bg-[#121212] py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Explore Work"
          title="Case Studies Built Around Business Impact"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          {[
            {
              title: "Enterprise Operational Insight Platform",
              slug: "pertamina-llm",
              role: "Backend Engineer",
              problem: "Enterprise insight workflows were slowed by fragmented issue context and manual technical handoffs.",
              built: "Backend features, RAG workflow integration, vector search, and issue-resolution flows for an enterprise operational insight platform.",
              impact: "Reduced median issue-to-merge lead time by 51.9%.",
              metric: "51.9% faster",
              tags: ["Python", "FastAPI", "Milvus", "SQL Server"],
              img: "/images/llm-pertamina-project.webp",
            },
            {
              title: "Vehicle Inspection Operations Platform",
              slug: "car-dano",
              role: "Backend Engineer",
              problem: "Vehicle inspection workflows needed faster operations and verifiable records without sacrificing reliability.",
              built: "A vehicle inspection backend with Cardano anchoring, operational APIs, and data workflows.",
              impact: "Cut inspection turnaround by 50% while maintaining 100% uptime.",
              metric: "50% faster",
              tags: ["Node.js", "Cardano", "PostgreSQL", "Prisma"],
              img: "/images/CAR-dano-project.webp",
            },
            {
              title: "SumbuPay Web3 Gateway",
              slug: "sumbupay",
              role: "Backend Engineer & Co-Founder",
              problem: "A Web3 payment product needed backend foundations that could connect fiat payment flows with wallet infrastructure.",
              built: "Core backend foundations for Web3 payment flows, QRIS integration, and MPC wallet infrastructure.",
              impact: "Created the technical base for a fiat-to-Web3 payment product roadmap.",
              metric: "Core platform",
              tags: ["Node.js", "TypeScript", "Web3", "PostgreSQL"],
              img: "/images/SumbuPay-project.webp",
            },
            {
              title: "Healthcare Data Interoperability Platform",
              slug: "pharmachain",
              role: "Backend Engineer & Researcher",
              problem: "Healthcare data exchange needed a prototype for multi-organization trust, identity sharing, and audit-friendly interoperability.",
              built: "A Hyperledger Fabric prototype with 2 networks, 6 organizations, and 30+ containers for interoperable healthcare data exchange.",
              impact: "Validated cross-network identity sharing and audit-friendly data flow patterns.",
              metric: "30+ containers",
              tags: ["Hyperledger", "Docker", "IPFS", "Go"],
              img: "/images/pharmachain-project.webp",
            },
          ].map((project, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onMouseEnter={() => setIsHoveringProject(true)}
              onMouseLeave={() => setIsHoveringProject(false)}
              className="group flex flex-col gap-6 cursor-none rounded-[12px] border border-white/5 bg-[#151515] p-4 md:p-5 transition-colors hover:border-neon-mint/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-[#1A1A1A]">
                <img
                  src={project.img}
                  alt={project.title}
                  width="960"
                  height="600"
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[0.5] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute left-4 top-4 rounded-full border border-neon-mint/25 bg-black/45 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neon-mint backdrop-blur-md">
                  {project.metric}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">
                  <span>{project.role}</span>
                  <span className="text-neon-mint">/</span>
                  <span>{project.tags[0]}</span>
                </div>
              </div>

              <div className="flex flex-col gap-5 px-1 pb-1">
                <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-neon-mint">
                  {project.title}
                </h3>
                <div className="grid grid-cols-1 gap-4 text-sm leading-relaxed text-[#A0A0A0]">
                  <p>
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                      Problem
                    </span>
                    {project.problem}
                  </p>
                  <p>
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                      Built:
                    </span>{" "}
                    {project.built}
                  </p>
                  <p className="rounded-[8px] border border-neon-mint/15 bg-neon-mint/[0.04] p-4 text-white">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-neon-mint">
                      Impact:
                    </span>{" "}
                    {project.impact}
                  </p>
                </div>

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

                <Link
                  to={`/projects/${project.slug}`}
                  onMouseEnter={() => setIsHoveringButton(true)}
                  onMouseLeave={() => setIsHoveringButton(false)}
                  className="mt-2 inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] transition-colors hover:text-neon-mint cursor-none"
                >
                  View Case Study
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-[60px] flex flex-col items-center gap-8"
        >
          <Link
            to="/projects"
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className="font-mono text-xs uppercase tracking-[0.2em] text-neon-mint/70 hover:text-neon-mint transition-colors cursor-none"
          >
            View all projects →
          </Link>
          <motion.a
            href="https://github.com/Maulana-anjari"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(80, 200, 120, 0.45)",
            }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-neon-mint px-10 py-5 text-sm font-bold text-[#111111] transition-all"
          >
            View GitHub Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
