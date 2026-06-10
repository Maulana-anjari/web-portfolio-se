import { motion } from "motion/react";

export default function SymmetricalDivider({
  accentColor = "var(--color-neon-mint)",
  className = "",
}: {
  accentColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 w-full overflow-hidden ${className}`}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="font-mono text-[10px] sm:text-xs"
        style={{ color: accentColor, opacity: 0.5 }}
      >
        &lt;/
      </motion.span>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          scaleX: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: 0.4 },
        }}
        className="flex-grow h-[1px] bg-[#555555] origin-center"
      />
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="font-mono text-[10px] sm:text-xs"
        style={{ color: accentColor, opacity: 0.5 }}
      >
        &gt;
      </motion.span>
    </div>
  );
}
