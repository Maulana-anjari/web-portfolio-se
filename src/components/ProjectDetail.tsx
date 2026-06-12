import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";
import LazySyntaxHighlighter from "./LazySyntaxHighlighter";
import { useCursor } from "../context/CursorContext";
import FloatingMenu from "./shared/FloatingMenu";
import {
  ArrowLeft,
  Copy,
  Check,
  List,
} from "lucide-react";

const SAFE_IMAGE_PLACEHOLDER = "https://placehold.co/800x400/1A1A1A/666666?text=Image+Not+Found&font=roboto";

function getSafeImageSrc(src: string | undefined) {
  if (!src) return SAFE_IMAGE_PLACEHOLDER;
  if (src.startsWith("/") || src.startsWith("https://")) return src;
  return SAFE_IMAGE_PLACEHOLDER;
}

interface ProjectData {
  slug: string;
  title: string;
  role: string;
  company: string;
  period: string;
  tags: string[];
  metric: string;
  status: string;
  content: string;
}

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

const MermaidCodeBlock = ({ code }: { code: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("mermaid")
      .then((mermaid) => {
        if (cancelled) return;
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "dark",
          fontSize: 16,
          themeVariables: {
            primaryColor: "#F59E0B",
            primaryTextColor: "#E0E0E0",
            primaryBorderColor: "#F59E0B",
            lineColor: "#F59E0B",
            secondaryColor: "#1A1A1A",
            tertiaryColor: "#0F0F0F",
            background: "#0F0F0F",
            mainBkg: "#1A1A1A",
            nodeBorder: "#F59E0B",
            clusterBkg: "#1A1A1A",
            clusterBorder: "#333333",
            titleColor: "#F59E0B",
            edgeLabelBackground: "#0F0F0F",
            nodeTextColor: "#E0E0E0",
            fontSize: "16px",
          },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;
        return mermaid.default.render(id, code);
      })
      .then((result) => {
        if (cancelled && result) return;
        if (result) setSvg(result.svg);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="my-10 rounded-xl overflow-hidden border border-red-400/20 shadow-2xl">
        <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between border-b border-[#333333]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-60" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-60" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-60" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#949494]">
            // DIAGRAM_PARSE_ERROR
          </span>
        </div>
        <pre className="bg-[#0F0F0F] p-10 font-mono text-xs leading-[1.6] overflow-x-auto text-[#949494]">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-xl overflow-hidden border border-amber-400/20 shadow-2xl group/code">
      <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between border-b border-[#333333]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-60" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-60" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-60" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#949494]">
          // SYSTEM_SCHEMA
        </span>
      </div>
      <div
        ref={containerRef}
        className="bg-[#0F0F0F] p-4 md:p-8 flex justify-center overflow-x-auto"
      >
        {svg ? (
          <div
            dangerouslySetInnerHTML={{ __html: svg }}
            className="w-full [&_svg]:w-full [&_svg]:h-auto [&_svg]:min-h-[200px]"
          />
        ) : (
          <div className="flex items-center gap-3 text-[#949494] font-mono text-xs py-8">
            <div className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            Rendering diagram...
          </div>
        )}
      </div>
    </div>
  );
};

const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2300}-\u{23FF}]/gu, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const getFlattenedText = (children: any): string => {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getFlattenedText).join("");
  if (typeof children === "object" && children.props) return getFlattenedText(children.props.children);
  return String(children);
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [toc, setToc] = useState<ToCItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const figCounter = useRef(0);
  const { setAccentColor } = useCursor();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setAccentColor("amber");
    return () => setAccentColor("neon-mint");
  }, [setAccentColor]);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(`/api/projects?slug=${slug}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);

        const headings: ToCItem[] = [];
        const content = data.content || '';
        const lines = content.split("\n");
        lines.forEach((line: string) => {
          const match = line.match(/^(#{2,3})\s+(.+?)\s*\r?$/);
          if (match) {
            const level = match[1].length;
            const rawText = match[2].trim();
            const id = generateId(rawText);
            headings.push({ id, text: rawText, level });
          }
        });
        setToc(headings);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        setLoading(false);
        setError(err.name === "AbortError" ? "Request timeout - please try again" : `Error loading project: ${err.message}`);
      })
      .finally(() => clearTimeout(timeoutId));
  }, [slug]);

  useEffect(() => {
    if (!project) return;

    let cleanupScroll: (() => void) | undefined;

    const timer = setTimeout(() => {
      const onScroll = () => {
        const headings = document.querySelectorAll<HTMLElement>(".project-body h2, .project-body h3");
        if (headings.length === 0) return;

        let active = headings[0].id;
        for (const h of headings) {
          const top = h.getBoundingClientRect().top;
          if (top <= 100) {
            active = h.id;
          } else {
            break;
          }
        }
        setActiveId(active);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupScroll = () => window.removeEventListener("scroll", onScroll);
    }, 200);

    return () => {
      clearTimeout(timer);
      cleanupScroll?.();
    };
  }, [project]);

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <button 
        type="button"
        aria-label="Copy code to clipboard"
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-[#949494] hover:text-amber-400 transition-colors px-2 py-1 rounded"
        title="Copy code"
      >
        <span className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${copied ? 'opacity-100 translate-x-0 text-amber-400' : 'opacity-0 translate-x-2'}`}>
          Copied!
        </span>
        {copied ? <Check size={14} className="text-amber-400" /> : <Copy size={14} />}
      </button>
    );
  };

  const siteUrl = 'https://maulana.sumbu.xyz';

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Link to="/projects" className="inline-flex items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-all mb-8 group relative py-1">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="font-mono text-sm uppercase tracking-widest">Back to Projects</span>
          </Link>
          <div className="text-red-400 font-mono text-sm mb-4 border border-red-400/30 rounded px-4 py-3 bg-red-400/5">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-amber-400 animate-pulse font-mono tracking-tighter text-xl">
          LOADING_PROJECT…
        </div>
      </div>
    );
  }

  if (!project) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link to="/projects" className="inline-flex items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-all mb-8 group relative py-1">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
          <span className="font-mono text-sm uppercase tracking-widest">Back to Projects</span>
        </Link>
        <div className="text-amber-400/60 font-mono text-sm">Project not found</div>
      </div>
    </div>
  );

  const projectUrl = `${siteUrl}/projects/${project.slug}`;

  return (
    <>
      <Helmet>
        <title>{project.title || "Project"} — Maulana Anjari</title>
        <meta name="description" content={`Case study: ${project.title || "Project"}. ${project.role || "Engineer"} at ${project.company || "Organization"}.`} />
        <meta name="keywords" content={(project.tags || []).join(', ')} />
        <link rel="canonical" href={projectUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:title" content={`${project.title || "Project"} — Maulana Anjari`} />
        <meta property="og:description" content={`Case study: ${project.role || "Engineer"} at ${project.company || "Organization"}.`} />
        <meta property="og:image" content="https://maulana.sumbu.xyz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} — Maulana Anjari`} />
        <meta name="twitter:description" content={`Case study: ${project.role} at ${project.company}.`} />
        <meta name="twitter:image" content="https://maulana.sumbu.xyz/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": project.title || "Project",
            "description": `${project.role} at ${project.company}.`,
            "author": { "@type": "Person", "name": "Maulana Anjari Anggorokasih", "url": siteUrl },
            "url": projectUrl,
            "mainEntityOfPage": { "@type": "WebPage", "@id": projectUrl }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
              { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${siteUrl}/projects` },
              { "@type": "ListItem", "position": 3, "name": project.title || "Project", "item": projectUrl }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] selection:bg-amber-400 selection:text-black scroll-smooth">
        <FloatingMenu items={[{ name: "All Projects", href: "/projects", isExternal: true }, { name: "Home", href: "/", isExternal: true }]} />
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-amber-400 z-[100] origin-left shadow-[0_0_10px_#F59E0B]"
          style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col md:flex-row gap-16">
          <div className="flex-1 max-w-[750px]">
            <Link to="/projects" className="inline-flex items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-colors mb-12 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-sm uppercase tracking-widest">All Projects</span>
            </Link>

            <header className="mb-20">
              {project.status === 'design' && (
                <div className="mb-8 p-4 border border-amber-400/20 rounded-xl bg-amber-400/5">
                  <p className="text-amber-300 text-sm font-mono uppercase tracking-widest mb-1">REQUEST FOR · {project.role}</p>
                  <p className="text-[#AAAAAA] text-sm leading-relaxed">
                    This case study documents design and architecture work completed during the pre-production phase. 
                    The system has been architected, specified, and validated through design reviews — but has not been built or shipped. 
                    It represents my approach to system design rather than production outcomes.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-4 mb-6 font-mono text-xs uppercase tracking-widest text-[#949494]">
                {project.status === 'design' ? (
                  <span className="text-amber-300 text-xs font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    REQUEST FOR · {project.metric}
                  </span>
                ) : (
                  <span className="text-amber-400 text-xs font-mono bg-amber-400/10 px-2 py-0.5 rounded">
                    {project.metric}
                  </span>
                )}
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>{project.period}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
                {project.title || ""}
              </h1>
              <p className="text-[#9CA3AF] text-lg mb-6">{project.role} · {project.company}</p>
              <div className="flex flex-wrap gap-2">
                {(project.tags || []).map((tag: string) => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 border border-amber-400/15 px-3 py-1 rounded-full bg-amber-400/5">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div ref={contentRef} className="project-body [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-b [&_h2]:border-neutral-800 [&_h2]:pb-2 [&_h2]:scroll-mt-32
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:scroll-mt-32
              [&_p]:leading-relaxed [&_p]:text-lg [&_p]:text-[#D1D5DB] [&_p]:font-sans [&_p]:mb-8
              [&_ul]:list-none [&_ul]:mb-10 [&_ul]:space-y-2
              [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-lg [&_li]:text-[#D1D5DB] [&_li]:font-sans
              [&_ol]:list-decimal [&_ol]:mb-10 [&_ol]:space-y-2 [&_ol]:ml-6
              [&_a]:text-amber-400 [&_a]:hover:text-amber-300 [&_a]:underline
              [&_strong]:text-amber-300 [&_strong]:font-bold
              [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-8 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-[#AAAAAA] [&_blockquote]:text-xl [&_blockquote]:bg-amber-400/5 [&_blockquote]:py-4 [&_blockquote]:rounded-r-xl
              [&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:my-12 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-white/5 [&_table]:bg-[#0C0C0C]
              [&_thead]:bg-[#111111]
              [&_th]:px-6 [&_th]:py-4 [&_th]:font-mono [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-[0.2em] [&_th]:text-amber-400 [&_th]:font-bold [&_th]:border-b [&_th]:border-amber-400/30
              [&_td]:px-6 [&_td]:py-4 [&_td]:text-sm [&_td]:text-[#AAAAAA] [&_td]:border-b [&_td]:border-white/[0.03] [&_td]:align-top
              [&_tr]:hover:bg-white/[0.02] [&_tr]:even:bg-white/[0.01]
              [&_hr]:border-neutral-800 [&_hr]:my-10
              [&_img]:rounded-2xl [&_img]:w-full [&_img]:border [&_img]:border-white/5 [&_img]:shadow-[0_0_40px_rgba(245,158,11,0.08)] [&_img]:transition-all [&_img:hover]:shadow-[0_0_60px_rgba(245,158,11,0.12)]
              [&_pre]:my-10 [&_pre]:rounded-xl [&_pre]:overflow-hidden
              [&_p_img]:inline-block
            ">
              {void (figCounter.current = 0)}
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = getFlattenedText(children);
                    const id = generateId(text);
                    return (
                      <h2 id={id} className="text-2xl font-bold text-white mt-12 mb-6 flex items-baseline group scroll-mt-32 border-b border-neutral-800 pb-2">
                        <span className="text-amber-400 mr-3">::</span> {children}
                        <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 ml-2 text-sm text-amber-400 transition-opacity">#</a>
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = getFlattenedText(children);
                    const id = generateId(text);
                    return (
                      <h3 id={id} className="text-xl font-bold text-white mt-10 mb-4 flex items-baseline group scroll-mt-32">
                        <span className="text-amber-400 mr-3">::</span> {children}
                        <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 ml-2 text-sm text-amber-400 transition-opacity">#</a>
                      </h3>
                    );
                  },
                  p: ({ children }) => <p className="leading-relaxed text-lg text-[#D1D5DB] font-sans mb-8 tracking-normal">{children}</p>,
                  ul: ({ children }) => <ul className="list-none mb-10 space-y-4">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-4">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      <span className="text-lg text-[#D1D5DB] font-sans">{children}</span>
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="my-12 overflow-x-auto rounded-xl border border-white/5 bg-[#0C0C0C]">
                      <table className="w-full text-left border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-[#111111]">{children}</thead>,
                  th: ({ children }) => (
                    <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold border-b border-amber-400/30">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-6 py-4 text-sm text-[#AAAAAA] border-b border-white/[0.03] align-top">
                      {children}
                    </td>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-white/[0.02] transition-colors even:bg-white/[0.01]">{children}</tr>
                  ),
                  code: (props: any) => {
                    const { children, className, inline } = props;
                    const lang = className?.replace("language-", "") || "plaintext";
                    const codeString = String(children).replace(/\n$/, "");
                    
                    const isInline = inline || !className;

                    if (isInline) {
                      return (
                        <code className="bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded-[4px] font-mono text-[0.9em] border border-amber-400/10">
                          {children}
                        </code>
                      );
                    }

                    if (lang === "mermaid") {
                      return <MermaidCodeBlock code={codeString} />;
                    }

                    const isAlgorithm = codeString.trim().startsWith("ALGORITHM");

                    return (
                      <div className={`my-10 rounded-xl overflow-hidden border ${isAlgorithm ? "border-amber-400/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]" : "border-[#333333] shadow-2xl"} group/code`}>
                        <div className={`${isAlgorithm ? "bg-amber-400/10" : "bg-[#1A1A1A]"} px-4 py-2 flex items-center justify-between border-b ${isAlgorithm ? "border-amber-400/20" : "border-[#333333]"}`}>
                          <div className="flex gap-2">
                            <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-amber-400" : "bg-[#FF5F56]"} opacity-60`} />
                            <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-amber-400" : "bg-[#FFBD2E]"} opacity-60`} />
                            <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-amber-400" : "bg-[#27C93F]"} opacity-60`} />
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-mono text-[10px] uppercase tracking-widest ${isAlgorithm ? "text-amber-400" : "text-[#949494]"}`}>
                              {isAlgorithm ? "Algorithm Protocol" : lang}
                            </span>
                            <CopyButton text={codeString} />
                          </div>
                        </div>
                        <div className="relative">
                          <LazySyntaxHighlighter
                          language={isAlgorithm ? "plaintext" : lang}
                          code={codeString}
                          isAlgorithm={isAlgorithm}
                        />
                          <div className={`absolute top-0 right-0 h-full w-[2px] ${isAlgorithm ? "bg-amber-400" : "bg-amber-400/20"} opacity-0 group-hover/code:opacity-100 transition-opacity`} />
                        </div>
                      </div>
                    );
                  },
                  img: ({ src, alt }) => {
                    const isShield = src?.includes('img.shields.io');
                    if (isShield) {
                      return (
                        <img
                          src={src}
                          alt={alt}
                          loading="lazy"
                          className="inline-block my-1"
                        style={{ height: 28, width: 'auto' }}
                        />
                      );
                    }
                    return (
                    <figure className="my-12">
                      <img
                        src={getSafeImageSrc(src)}
                        alt={alt}
                        width="800"
                        height="400"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== SAFE_IMAGE_PLACEHOLDER) {
                            target.src = SAFE_IMAGE_PLACEHOLDER;
                          }
                        }}
                        className="rounded-2xl w-full border border-white/5 shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all hover:shadow-[0_0_60px_rgba(245,158,11,0.12)]"
                      />
                      {alt && (
                        <figcaption className="text-center text-[9px] font-mono text-[#6B7280] mt-2 uppercase tracking-[0.25em]">
                          // fig. {String(++figCounter.current).padStart(2, '0')}: {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                strong: ({ children }) => <strong className="text-amber-300 font-bold">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-amber-400 pl-8 my-10 italic text-[#AAAAAA] text-xl bg-amber-400/5 py-4 rounded-r-xl">
                      {children}
                    </blockquote>
                  )
                }}
              >
                {project.content || ""}
              </ReactMarkdown>
            </div>
          </div>

          {toc.length > 0 && (
            <aside className="hidden lg:block w-72">
              <div className="sticky top-32">
                <div className="flex items-center gap-3 mb-8 text-[#888888] font-mono text-[10px] uppercase tracking-[0.2em] border-b border-[#333333] pb-4">
                  <List size={14} className="text-amber-400" />
                  Table of Contents
                </div>
                <nav className="space-y-4">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:text-amber-400 ${
                        activeId === item.id 
                          ? "text-amber-400 border-l-2 border-amber-400 pl-4" 
                          : `text-[#949494] border-l-2 border-transparent ${item.level === 3 ? "pl-8 opacity-70" : "pl-4"}`
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
