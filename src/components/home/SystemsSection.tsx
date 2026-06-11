import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";
import { ArrowRight, ShieldCheck, Globe, Unlock } from "lucide-react";

const PRINCIPLES = [
  {
    icon: ArrowRight,
    title: "Reduce Friction",
    desc: "Automate away repetitive processes. Build APIs and workflows that remove operational bottlenecks so teams move faster with fewer errors.",
    projects: "Pertamina LLM, Technocorner, Find-IT",
  },
  {
    icon: ShieldCheck,
    title: "Improve Transparency",
    desc: "Design systems where trust is verifiable, not assumed. Audit trails, immutable records, and clear access boundaries make accountability the default.",
    projects: "CAR-dano, DChain",
  },
  {
    icon: Globe,
    title: "Expand Access",
    desc: "Build infrastructure that opens opportunities — whether financial rails for underserved markets or career platforms that connect talent to jobs.",
    projects: "SumbuPay, Aksara AI",
  },
  {
    icon: Unlock,
    title: "Optimize Resources",
    desc: "Create systems that make existing resources go further — reducing waste in supply chains, computing, and institutional workflows.",
    projects: "Fitted, Pawona, PharmaChain",
  },
];

export default function SystemsSection() {
  return (
    <section
      id="systems"
      className="relative w-full bg-dark-charcoal py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      aria-label="Why I Build"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Why I Build"
          title="Every project follows the same mission."
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#9CA3AF] text-lg max-w-2xl mb-16 leading-relaxed"
        >
          Technology is not the destination — it is the vehicle. Across different domains and stacks,
          every system I build is anchored in one of four principles. The tools change, but the mission
          does not.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRINCIPLES.map((principle, idx) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-xl border border-white/5 bg-[#151515] p-6 md:p-8 hover:border-neon-mint/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <principle.icon className="h-6 w-6 text-neon-mint flex-shrink-0" />
                <h3 className="text-xl font-bold text-white">{principle.title}</h3>
              </div>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
                {principle.desc}
              </p>
              <div className="pt-4 border-t border-white/5">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neon-mint/60">
                  Applied in: {principle.projects}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
