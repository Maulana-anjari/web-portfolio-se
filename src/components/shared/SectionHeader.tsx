import { motion } from "motion/react";
import SymmetricalDivider from "./SymmetricalDivider";

export default function SectionHeader({
  label,
  title,
  accentColor = "var(--color-neon-mint)",
  titleColor,
}: {
  label: string;
  title: string;
  accentColor?: string;
  titleColor?: string;
}) {
  return (
    <div className="w-full mb-12">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 mb-4">
        <motion.span
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-sm uppercase tracking-wider whitespace-nowrap"
          style={{
            color: accentColor,
            textShadow: label.toLowerCase().includes("testimonials")
              ? "0 0 10px rgba(0, 255, 102, 0.4)"
              : "none",
          }}
        >
          {label}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold max-w-xl leading-tight md:text-right"
          style={{ color: titleColor || accentColor }}
        >
          {title}
        </motion.h2>
      </div>
      <SymmetricalDivider
        accentColor={accentColor}
        className="mt-2 mb-[60px]"
      />
    </div>
  );
}
