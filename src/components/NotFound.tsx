import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 | Maulana Anjari</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 relative overflow-hidden">
        {/* Glow effect behind 404 */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(80, 200, 120, 0.25) 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.5,
          }}
        />

        <div className="text-center max-w-lg relative z-10">
          {/* Terminal label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#666666] mb-8 block"
          >
            // PAGE_NOT_FOUND
          </motion.span>

          {/* 404 with bracket wrappers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 md:gap-4 mb-6"
          >
            <span className="font-mono text-sm md:text-xl text-neon-mint opacity-40 mt-4">
              &lt;
            </span>
            <h1
              className="font-[900] text-neon-mint leading-none tracking-tighter select-none"
              style={{
                fontSize: "clamp(6rem, 20vw, 18rem)",
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 0 80px rgba(80, 200, 120, 0.2)",
              }}
            >
              404
            </h1>
            <span className="font-mono text-sm md:text-xl text-neon-mint opacity-40 mt-4">
              /&gt;
            </span>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#A0A0A0] text-base md:text-lg leading-relaxed font-sans mb-12 max-w-sm mx-auto"
          >
            The route you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Symmetrical Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-between gap-4 w-full overflow-hidden my-12"
          >
            <span className="font-mono text-[10px] sm:text-xs text-neon-mint opacity-40">
              &lt;/
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className="flex-grow h-[1px] bg-[#333333] origin-center"
            />
            <span className="font-mono text-[10px] sm:text-xs text-neon-mint opacity-40">
              &gt;
            </span>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="rounded-full bg-neon-mint px-10 py-4 text-sm font-bold text-[#111111] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(80,200,120,0.4)] active:scale-95"
            >
              Back to Home
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-neon-mint/60 hover:text-neon-mint transition-all group py-2"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-2 transition-transform duration-300"
              />
              <span className="font-mono text-sm uppercase tracking-widest relative">
                Go to Blog
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-neon-mint group-hover:w-full transition-all duration-300" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
