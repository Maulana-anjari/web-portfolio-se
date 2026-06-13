import { motion } from "motion/react";
import SymmetricalDivider from "../shared/SymmetricalDivider";
import { useCursor } from "../../context/CursorContext";

export default function FooterSection() {
  const { setIsHoveringButton } = useCursor();

  return (
    <footer
        id="contact"
        className="relative w-full bg-[#121212] overflow-hidden"
      >
        {/* Massive Background Repeating Text */}
        <div className="absolute bottom-[2%] md:bottom-[-5%] left-0 w-full z-[20] pointer-events-none select-none overflow-hidden">
          <div
            aria-hidden="true"
            className="h-[clamp(4rem,14.4vw,16rem)] bg-center bg-no-repeat opacity-[0.08]"
            style={{
              backgroundSize: "auto 100%",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 260'%3E%3Ctext x='50%25' y='82%25' text-anchor='middle' font-family='Arial,sans-serif' font-size='260' font-weight='900' letter-spacing='-14' fill='%23FFFFFF'%3EBACKEND%3C/text%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-10 md:px-20 relative z-10 pt-[150px] pb-20">
          {/* Main CTA Area */}
          <div className="flex flex-col items-center justify-center text-center mb-[100px] w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-0"
            >
              <h2
                className="font-black text-white leading-[0.9] tracking-tighter uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
              >
                Ready to Build Reliable
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 my-1 md:my-2">
                <div className="flex flex-col items-center md:items-end leading-[0.9]">
                  <span
                    className="font-black text-white uppercase tracking-tighter"
                    style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
                  >
                    Your
                  </span>
                  <span
                    className="font-black text-neon-mint uppercase tracking-tighter"
                    style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
                  >
                    Back-end
                  </span>
                </div>

                {/* Desktop Button */}
                <div className="relative flex-shrink-0 hidden md:block">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                    style={{
                      width: "600px",
                      height: "600px",
                      background:
                        "radial-gradient(circle, rgba(0, 255, 102, 0.2) 0%, transparent 65%)",
                      filter: "blur(60px)",
                    }}
                  />
                  <motion.button
                    type="button"
                    aria-label="Start a project by email"
                    onClick={() => {
                      window.location.href = "mailto:maulana17anjari@gmail.com?subject=Project%20Inquiry";
                    }}
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 40px rgba(0, 255, 102, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="group relative z-10 flex h-[130px] w-[130px] items-center justify-center rounded-full bg-neon-mint shadow-[0_0_20px_rgba(0,255,102,0.3)]"
                  >
                    <span className="text-center text-sm font-bold text-black/90 px-4">
                      Let's Collaborate
                    </span>
                    <div className="absolute inset-0 rounded-full border border-black/5 scale-110 group-hover:scale-125 transition-transform duration-500" />
                  </motion.button>
                </div>
              </div>

              <h2
                className="font-black text-white leading-[0.9] tracking-tighter uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(32px, 8vw, 80px)" }}
              >
                Infrastructure?
              </h2>

              {/* Mobile Button */}
              <div className="relative flex-shrink-0 md:hidden mt-10">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                  style={{
                    width: "400px",
                    height: "400px",
                    background:
                      "radial-gradient(circle, rgba(0, 255, 102, 0.2) 0%, transparent 65%)",
                    filter: "blur(40px)",
                  }}
                />
                <motion.button
                  type="button"
                  aria-label="Start a project by email"
                  onClick={() => {
                    window.location.href = "mailto:maulana17anjari@gmail.com?subject=Project%20Inquiry";
                  }}
                  onMouseEnter={() => setIsHoveringButton(true)}
                  onMouseLeave={() => setIsHoveringButton(false)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="group relative z-10 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-neon-mint shadow-[0_0_20px_rgba(0,255,102,0.3)]"
                >
                    <span className="text-center text-sm font-bold text-black/90 px-4">
                      Let's Collaborate
                    </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <SymmetricalDivider className="my-20 px-1" />

          {/* Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-20">
            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8F8F8F] font-bold">
                    Quick links
                  </span>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "HOME", href: "#hero" },
                      { name: "ABOUT", href: "#about" },
                      { name: "WORKS", href: "#work" },
                      { name: "BLOGS", href: "#blog" },
                      { name: "CONTACT", href: "#contact" },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-xs font-semibold text-white/70 hover:text-neon-mint transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8F8F8F] font-bold">
                    Portfolio
                  </span>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://github.com/Maulana-anjari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white/70 hover:text-neon-mint transition-colors"
                    >
                      GITHUB
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8F8F8F] font-bold">
                    Social Link
                  </span>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "GITHUB", url: "https://github.com/Maulana-anjari" },
                      { name: "LINKEDIN", url: "https://www.linkedin.com/in/maulana-anjari-anggorokasih" },
                      { name: "TWITTER (X)", url: "https://x.com/maulana_anjari" },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-white/70 hover:text-neon-mint transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-20 space-y-4">
                <a
                  href="mailto:maulana17anjari@gmail.com"
                  className="block text-[clamp(14px,4.5vw,24px)] md:text-3xl font-bold text-white hover:text-neon-mint transition-colors whitespace-nowrap"
                >
                  maulana17anjari@gmail.com
                </a>
                <a
                  href="https://wa.me/62895619386814"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[clamp(16px,5vw,20px)] md:text-2xl font-bold text-white hover:text-neon-mint transition-colors"
                >
                  +62 8956 1938 6814
                </a>
              </div>

              <div className="mt-20 pt-8 border-t border-[#333333]">
                <p className="text-[10px] tracking-[0.1em] text-[#A0A0A0]">
                  &copy; {new Date().getFullYear()} Maulana Anjari Anggorokasih
                </p>
              </div>
            </div>

            {/* Right Side: Portrait */}
            <div className="relative flex items-end min-h-[400px] justify-center lg:justify-end">
              <picture className="flex h-full">
                <source srcSet="/portrait.webp" type="image/webp" />
                <motion.img
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 0.7, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  src="/portrait.png"
                  alt="Maulana Anjari Footer"
                  width="900"
                  height="1200"
                  loading="lazy"
                  className="h-full w-auto object-cover grayscale brightness-75"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </picture>
            </div>
          </div>
        </div>
      </footer>
  );
}
