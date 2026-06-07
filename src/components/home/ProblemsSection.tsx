import { motion } from "motion/react";

export default function ProblemsSection() {
  return (
    <section className="relative w-full bg-[#121212] px-10 md:px-20 py-[100px] z-10 border-b border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
          <div>
            <span className="font-mono text-sm uppercase tracking-wider text-neon-mint underline decoration-neon-mint/30 underline-offset-8">
              //Problems I Solve
            </span>
            <h2 className="mt-10 max-w-xl text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter text-white uppercase">
              From technical build to governed execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Reliable backend APIs",
                copy: "Design and build production-ready APIs, database workflows, and service boundaries teams can operate with confidence.",
              },
              {
                title: "LLM and RAG infrastructure",
                copy: "Build retrieval pipelines, vector search, evaluation loops, and backend integrations for production-ready AI workflows.",
              },
              {
                title: "Blockchain-backed trust systems",
                copy: "Prototype and ship workflows where audit trails, multi-party trust, and verifiable records matter.",
              },
              {
                title: "Risk-aware digital infrastructure",
                copy: "Build systems with access control, traceability, reliability, and auditability considered from the start.",
              },
            ].map((problem, idx) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="border border-white/5 bg-[#171717] p-6 md:p-7 rounded-[8px] hover:border-neon-mint/30 transition-colors"
              >
                <div className="mb-5 flex items-center justify-between gap-5">
                  <h3 className="text-xl font-bold text-white">
                    {problem.title}
                  </h3>
                  <span className="font-mono text-[10px] text-neon-mint">
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#A0A0A0]">
                  {problem.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
