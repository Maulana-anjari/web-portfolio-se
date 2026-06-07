import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative w-full bg-[#121212] py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Work Process"
          title="My Reliable Development Workflow"
        />

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
  );
}
