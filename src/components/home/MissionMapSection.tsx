import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";
import { ArrowRight, Globe, Unlock, ShieldCheck } from "lucide-react";

const MISSIONS = [
  {
    icon: ArrowRight,
    label: "Reduce Friction",
    projects: [
      { name: "Pertamina LLM Platform", desc: "Centralized insight access for engineers and geologists" },
      { name: "Technocorner", desc: "Automated registration for 200+ competition teams" },
      { name: "Aksara AI", desc: "Reduced regulatory and administrative overhead" },
    ],
  },
  {
    icon: ShieldCheck,
    label: "Improve Transparency",
    projects: [
      { name: "CAR-dano", desc: "Verifiable vehicle inspection records on Cardano" },
      { name: "DChain", desc: "National blockchain infrastructure for academic certificate integrity" },
    ],
  },
  {
    icon: Globe,
    label: "Expand Access",
    projects: [
      { name: "SumbuPay", desc: "QRIS + Web3 rails for underserved markets" },
      { name: "Aksara AI", desc: "Legal compliance co-pilot for Indonesian MSMEs" },
    ],
  },
  {
    icon: Unlock,
    label: "Optimize Resources",
    projects: [
      { name: "Fitted", desc: "Reduced clothing waste through smarter matching" },
      { name: "Pawona", desc: "Food waste reduction through inventory optimization" },
      { name: "PharmaChain", desc: "Efficient healthcare data exchange between organizations" },
    ],
  },
];

export default function MissionMapSection() {
  return (
    <section
      id="mission-map"
      className="relative w-full bg-[#121212] py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      aria-label="Mission in Practice"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Mission in Practice"
          title="How the Mission Becomes Products"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#9CA3AF] text-lg max-w-2xl mb-16 leading-relaxed"
        >
          Different industries, different technologies. But every product is driven by
          the same mission applied to different problems.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MISSIONS.map((mission, idx) => (
            <motion.div
              key={mission.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-xl border border-white/5 bg-[#151515] p-6 hover:border-neon-mint/30 transition-all duration-300"
            >
              <mission.icon className="h-6 w-6 text-neon-mint mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-lg font-bold text-white mb-4">{mission.label}</h3>
              <div className="space-y-3">
                {mission.projects.map((project) => (
                  <div key={project.name} className="border-l-2 border-neon-mint/20 pl-3 group-hover:border-neon-mint/40 transition-colors">
                    <p className="text-white text-sm font-medium">{project.name}</p>
                    <p className="text-[#6B7280] text-xs mt-0.5">{project.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
