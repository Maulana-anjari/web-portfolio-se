import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";
import { Activity, Layers, Building2, Target } from "lucide-react";

const ITEMS = [
  {
    icon: Activity,
    label: "Years Building",
    value: "3+",
    detail: "Delivering backend systems and production infrastructure across enterprise, startup, and research environments.",
  },
  {
    icon: Layers,
    label: "Core Domains",
    value: "Backend · Systems",
    detail: "API design, distributed systems, database architecture, and blockchain infrastructure.",
  },
  {
    icon: Building2,
    label: "Across Environments",
    value: "Enterprise · Gov · Startup",
    detail: "Pertamina EP, Kemdiktisaintek, Sumbu Labs. Systems built for reliability, compliance, and scale.",
  },
  {
    icon: Target,
    label: "Ideal Roles",
    value: "Backend · Platform · Founding",
    detail: "Building the foundation layer: APIs, data systems, and infrastructure that products depend on.",
  },
];

export default function ExecutiveSummarySection() {
  return (
    <section
      id="snapshot"
      className="relative w-full bg-[#121212] py-[100px] pb-[120px] px-10 md:px-20 z-10 border-t border-white/5"
      aria-label="Quick Snapshot"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Quick Snapshot"
          title="At a Glance"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-xl border border-white/5 bg-[#151515] p-6 hover:border-neon-mint/20 transition-colors duration-300"
            >
              <item.icon className={`h-5 w-5 mb-4 opacity-60 group-hover:opacity-100 transition-opacity ${idx < 2 ? 'text-neon-mint' : 'text-amber-400'}`} />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B7280] mb-2">
                {item.label}
              </p>
              <p className="text-lg font-bold text-white mb-2">{item.value}</p>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
