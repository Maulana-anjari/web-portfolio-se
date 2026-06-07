import { useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function GlobalCursor({
  isHoveringProject,
  isHoveringButton,
}: {
  isHoveringProject: boolean;
  isHoveringButton: boolean;
}) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          cursorX.set(lastX);
          cursorY.set(lastY);
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        left: cursorX,
        top: cursorY,
        x: "-50%",
        y: "-50%",
        position: "fixed",
      }}
      animate={{
        width: isHoveringProject ? 80 : isHoveringButton ? 8 : 12,
        height: isHoveringProject ? 80 : isHoveringButton ? 8 : 12,
        backgroundColor: isHoveringProject
          ? "rgba(20, 20, 20, 0.9)"
          : isHoveringButton
            ? "#111111"
            : "#50C878",
        border: isHoveringProject
          ? "1px solid rgba(80, 200, 120, 0.2)"
          : "0px solid transparent",
      }}
      transition={{
        width: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        backgroundColor: { duration: 0.2, ease: "easeOut" },
      }}
      className="pointer-events-none z-[9999] flex items-center justify-center rounded-full backdrop-blur-[2px] shadow-2xl"
    >
      <AnimatePresence>
        {isHoveringProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArrowUpRight
              className="h-14 w-14 text-neon-mint"
              strokeWidth={2.5}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
