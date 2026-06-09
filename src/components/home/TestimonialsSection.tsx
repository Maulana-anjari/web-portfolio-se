import { motion } from "motion/react";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

export default function TestimonialsSection() {
  const { setIsHoveringButton } = useCursor();

  return (
    <section
      id="testimonials"
      className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Testimonials"
          title="What Collaborators Say About My Work"
        />

        <div className="relative">
          <span
            className="absolute -top-12 left-0 z-0 select-none font-serif font-black leading-none text-[#00FF66]/10"
            style={{ fontSize: "20rem" }}
          >
            &ldquo;
          </span>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="md:ml-20 max-w-full md:max-w-[70%]">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-[32px] font-medium leading-[1.4] text-white"
              >
                "Working with Maulana was one of the best decisions we made
                for our web platform. He understood our vision, delivered
                clean & scalable back-end code, and communicated clearly
                throughout the project."
              </motion.p>

              <div className="mt-12 flex items-center gap-4">
                <motion.button
                  type="button"
                  aria-label="Previous testimonial"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#222222] transition-colors hover:bg-[#333333]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12H5M5 12L12 19M5 12L12 5"
                      stroke="#A0A0A0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Next testimonial"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#222222] transition-colors hover:bg-[#333333]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="#A0A0A0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
                <a
                  href="mailto:maulana17anjari@gmail.com?subject=Project%20Inquiry"
                  onMouseEnter={() => setIsHoveringButton(true)}
                  onMouseLeave={() => setIsHoveringButton(false)}
                  className="ml-2 rounded-full bg-[#00FF66] px-6 py-3 text-xs font-bold text-[#111111] transition-all hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] active:scale-95"
                >
                  Work Together
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 md:mb-4 w-full md:w-auto"
            >
              <img
                src="https://avatars.githubusercontent.com/u/52191436?v=4"
                alt="Giga Hidjrika"
                width="64"
                height="64"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                }}
                className="h-16 w-16 rounded-[8px] object-cover grayscale brightness-75"
              />
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold text-white">
                  Giga Hidjrika
                </span>
                <span className="text-sm text-[#A0A0A0]">
                  CEO, Sumbu Labs
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
