import { motion } from "motion/react";

export default function RollingNumber({
  value,
  isInView,
}: {
  value: string;
  isInView: boolean;
}) {
  const isNumber = /^\d+$/.test(value.replace("+", ""));
  if (!isNumber) return <span>{value}</span>;

  const numStr = value.replace("+", "");
  const hasPlus = value.includes("+");

  return (
    <span className="inline-flex overflow-hidden">
      {numStr.split("").map((digit, i) => (
        <span key={i} className="relative h-[1em] w-[0.6em] md:w-[0.7em]">
          <motion.div
            initial={{ y: 0 }}
            animate={isInView ? { y: `-${parseInt(digit) * 10}%` } : { y: 0 }}
            transition={{
              duration: 2 + i * 0.2,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className="flex flex-col"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n} className="flex h-full items-center justify-center">
                {n}
              </span>
            ))}
          </motion.div>
        </span>
      ))}
      {hasPlus && (
        <span className="ml-1 tracking-tighter text-neon-mint transition-transform group-hover:scale-125 duration-300">
          +
        </span>
      )}
    </span>
  );
}
