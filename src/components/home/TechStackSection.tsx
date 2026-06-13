import { Zap, Code2, Server, Database, Leaf, Gauge, Layers, Box, Hexagon } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

export default function TechStackSection() {
  const { setIsHoveringButton } = useCursor();

  return (
    <section
      id="tech-stack"
      className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Tech Stack"
          title="Core Technologies I Use For Complex Systems"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-[#333333]">
          {[
            { name: "Go (Golang)", icon: Zap, highlight: true },
            { name: "Python", icon: Code2 },
            { name: "TypeScript", icon: Server },
            { name: "PostgreSQL", icon: Database },
            { name: "SQL Server", icon: Database },
            { name: "MongoDB", icon: Leaf },
            { name: "Redis", icon: Gauge },
            { name: "Milvus", icon: Database },
            { name: "Cardano", icon: Zap },
            { name: "Hyperledger", icon: Layers },
            { name: "Docker", icon: Box },
            { name: "Kubernetes", icon: Hexagon },
          ].map((tech) => (
            <div
              key={tech.name}
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              className={`group relative flex h-[120px] items-center justify-center border-b border-r border-[#333333] transition-all duration-300 ${
                tech.highlight
                  ? "bg-neon-mint text-[#111111]"
                  : "bg-transparent text-[#888888] hover:bg-neon-mint hover:text-[#111111]"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center px-2">
                <tech.icon
                  className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-300 ${
                    tech.highlight
                      ? "text-[#111111]"
                      : "text-[#888888] group-hover:text-[#111111]"
                  }`}
                  strokeWidth={1.5}
                />
                <span className="text-[10px] md:text-sm font-semibold tracking-wide uppercase">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
