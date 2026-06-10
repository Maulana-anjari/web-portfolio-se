import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="relative w-full bg-[#F5F5F5] py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-black/5"
      aria-label="Long-Term Vision"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          label="//Long-Term Vision"
          title="Beyond Software"
          accentColor="#1A1A1A"
          highlightTitle
        />

        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#2A2A2A] text-lg md:text-xl leading-relaxed font-medium"
          >
            I believe technology creates the most impact when it helps people access
            opportunities, information, and resources more fairly and efficiently.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#555555] text-lg leading-relaxed"
          >
            My long-term goal is not only to build software. It is to build systems,
            organizations, and products that create sustainable value — reaching people
            and communities that need them most.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#555555] text-lg leading-relaxed"
          >
            Software is a tool. Systems create leverage. Organizations sustain impact.
            When these three align, technology becomes a vehicle for real, lasting change.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
