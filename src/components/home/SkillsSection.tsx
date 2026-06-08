import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import RollingNumber from "../shared/RollingNumber";
import { useCursor } from "../../context/CursorContext";

interface SkillsSectionProps {
  onOpenResume: () => void;
}

export default function SkillsSection({ onOpenResume }: SkillsSectionProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>("backend");
  const { setIsHoveringButton } = useCursor();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10"
    >
      <div className="mx-auto max-w-7xl">
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
                  title: "Backend & APIs",
                  content:
                    "Go, Python (FastAPI), TypeScript (Node.js, NestJS), RESTful APIs, service boundaries, and production integration",
                },
                {
                  id: "ai",
                  title: "AI Infrastructure",
                  content:
                    "LLM workflows, RAG pipelines, vector databases, Milvus, evaluation loops, and AI backend orchestration",
                },
                {
                  id: "systems",
                  title: "Data, Cloud & Architecture",
                  content:
                    "PostgreSQL, SQL Server, MongoDB, Redis, Docker, Kubernetes, microservices, RabbitMQ, and Kafka",
                },
                {
                  id: "blockchain",
                  title: "Blockchain & Governance",
                  content:
                    "Cardano, Hyperledger Fabric, PoA/PoS consensus, audit trails, access control, and risk-aware digital governance",
                },
              ].map((item) => (
                <div key={item.id} className="border-b border-[#333333]">
                  <button
                    type="button"
                    aria-expanded={openAccordion === item.id}
                    aria-controls={`about-accordion-${item.id}`}
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
                        id={`about-accordion-${item.id}`}
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
              I design and ship backend systems that teams can run with confidence
              — APIs built for scale, AI integrations with evaluation guardrails,
              and distributed infrastructure where traceability, access control,
              and operational clarity come standard.
            </p>
            <motion.button
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(80, 200, 120, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenResume}
              className="mt-10 rounded-full bg-neon-mint px-10 py-4 text-sm font-bold text-[#111111] transition-all relative overflow-hidden"
            >
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
  );
}
