import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

export default function ServicesSection() {
  const [openService, setOpenService] = useState<number>(1);
  const { setIsHoveringButton } = useCursor();

  return (
    <section
      id="services"
      className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Service"
          title="How I Can Help Your Team Ship"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
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
              width="1000"
              height="750"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
              }}
              className="h-full w-full object-cover grayscale transition-transform duration-[800ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-mint/10 to-transparent mix-blend-overlay" />
          </motion.div>

          <div className="flex flex-col w-full">
            {[
              {
                id: 1,
                title: "Ship reliable backend APIs",
                num: "(01)",
                desc: "Design and implement API layers, database workflows, and service boundaries that are maintainable beyond the first release.",
              },
              {
                id: 2,
                title: "Build LLM and RAG workflows",
                num: "(02)",
                desc: "Connect private data, vector search, orchestration, and evaluation loops into AI workflows that teams can use and improve.",
              },
              {
                id: 3,
                title: "Prototype trust and audit systems",
                num: "(03)",
                desc: "Use blockchain, append-only records, and control-aware architecture where traceability and multi-party trust matter.",
              },
              {
                id: 4,
                title: "Improve reliability and governance",
                num: "(04)",
                desc: "Strengthen access control, logging, observability, data flows, and operational handoff so systems are easier to audit and run.",
              },
            ].map((service) => (
              <div
                key={service.id}
                className="border-b border-[#333333] group"
              >
                <button
                  type="button"
                  aria-expanded={openService === service.id}
                  aria-controls={`service-panel-${service.id}`}
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
                  <span className="font-mono text-xs text-[#A0A0A0]">
                    {service.num}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openService === service.id && (
                    <motion.div
                      id={`service-panel-${service.id}`}
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
                          Let's Talk ↗
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
  );
}
