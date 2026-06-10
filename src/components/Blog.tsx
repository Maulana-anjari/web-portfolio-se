import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet-async";
import LazySyntaxHighlighter from "./LazySyntaxHighlighter";
import FloatingMenu from "./shared/FloatingMenu";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Tag,
  Copy,
  Check,
  List,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";

const SAFE_IMAGE_PLACEHOLDER = "https://placehold.co/800x400/1A1A1A/666666?text=Image+Not+Found&font=roboto";

function getSafeImageSrc(src: string | undefined) {
  if (!src) return SAFE_IMAGE_PLACEHOLDER;
  if (src.startsWith("/") || src.startsWith("https://")) return src;
  return SAFE_IMAGE_PLACEHOLDER;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
}

interface PostDetail extends Post {
  content: string;
  frontmatter: any;
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
            primaryColor: "#00FF66",
            primaryTextColor: "#E0E0E0",
            primaryBorderColor: "#00FF66",
            lineColor: "#00FF66",
            secondaryColor: "#1A1A1A",
            tertiaryColor: "#0F0F0F",
            background: "#0F0F0F",
            mainBkg: "#1A1A1A",
            nodeBorder: "#00FF66",
            clusterBkg: "#1A1A1A",
            clusterBorder: "#333333",
            titleColor: "#00FF66",
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
    <div className="my-10 rounded-xl overflow-hidden border border-[#00FF66]/20 shadow-2xl group/code">
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
            <div className="h-3 w-3 rounded-full bg-neon-mint animate-pulse" />
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

export function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounce search input
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  // Reset page when category or sort changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortOrder]);

  const categories = ["All", "Backend", "Blockchain", "AI", "Architecture", "Others"];

  const CATEGORY_MAP: Record<string, string[]> = {
    AI: ["llm", "rag", "langgraph", "agents", "milvus", "machine learning", "neural", "vector db"],
    Blockchain: ["cardano", "hyperledger fabric", "ethereum", "web3", "smart contract", "aiken", "poa", "pos", "dchain"],
    Backend: ["go", "golang", "python", "fastapi", "node.js", "nestjs", "postgresql", "sql server", "redis", "docker", "rest api", "jwt"],
    Architecture: ["distributed systems", "scalability", "system design", "design patterns", "infrastructure"]
  };

  const fetchPosts = () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    fetch("/api/posts", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        setLoading(false);
        setError(err.name === "AbortError" ? "Request timeout - please try again" : `Error loading posts: ${err.message}`);
      })
      .finally(() => clearTimeout(timeoutId));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(post => {
      // 1. Category Filtering
      const postTags = post.tags.map(t => t.toLowerCase());
      let categoryMatch = false;

      if (activeCategory === "All") {
        categoryMatch = true;
      } else if (activeCategory === "Others") {
        const allMappedTags = Object.values(CATEGORY_MAP).flat();
        categoryMatch = !postTags.some(tag => allMappedTags.includes(tag));
      } else {
        const mappedTags = CATEGORY_MAP[activeCategory] || [];
        categoryMatch = postTags.some(tag => mappedTags.includes(tag));
      }

      if (!categoryMatch) return false;

      // 2. Search Query Filtering
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = post.excerpt.toLowerCase().includes(query);
      const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));

      return titleMatch || excerptMatch || tagsMatch;
    })
    .sort((a, b) => {
      // 3. Sorting by Date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * postsPerPage,
    safePage * postsPerPage,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-48 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-16 w-64 bg-[#1A1A1A] rounded animate-pulse mb-24" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 md:row-span-2 bg-[#111111] rounded-3xl aspect-[16/14] animate-pulse" />
            <div className="md:col-span-4 bg-[#111111] rounded-3xl aspect-[16/10] animate-pulse" />
            <div className="md:col-span-4 md:row-span-2 bg-[#111111] rounded-3xl aspect-[16/14] animate-pulse" />
            <div className="md:col-span-4 bg-[#111111] rounded-3xl aspect-[16/10] animate-pulse" />
            <div className="md:col-span-4 bg-[#111111] rounded-3xl aspect-[16/10] animate-pulse" />
            <div className="md:col-span-4 md:row-span-2 bg-[#111111] rounded-3xl aspect-[16/14] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-red-400 font-mono text-sm mb-4 border border-red-400/30 rounded px-4 py-3 bg-red-400/5">
            {error}
          </div>
          <button
            type="button"
            onClick={fetchPosts}
            className="px-6 py-2 border border-neon-mint text-neon-mint font-mono text-sm uppercase tracking-widest hover:bg-neon-mint hover:text-black transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Maulana Anjari - Backend Engineer</title>
        <meta name="description" content="Technical blog about backend architectures, blockchain protocols, and agentic workflows by Maulana Anjari. Insights on Go, Python, Cardano, and scalable systems." />
        <meta name="keywords" content="Backend, Blockchain, Cardano, Go, Python, Distributed Systems, Microservices, Web3" />
        <link rel="canonical" href="https://maulana.sumbu.xyz/blog" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maulana.sumbu.xyz/blog" />
        <meta property="og:title" content="Blog | Maulana Anjari - Backend Engineer" />
        <meta property="og:description" content="Technical blog about backend architectures, blockchain protocols, and agentic workflows." />
        <meta property="og:image" content="https://maulana.sumbu.xyz/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://maulana.sumbu.xyz/blog" />
        <meta name="twitter:title" content="Blog | Maulana Anjari - Backend Engineer" />
        <meta name="twitter:description" content="Technical blog about backend architectures, blockchain protocols, and agentic workflows." />
        <meta name="twitter:image" content="https://maulana.sumbu.xyz/og-image.png" />
      </Helmet>
      <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-48 px-6 md:px-20">
        <FloatingMenu items={[{ name: "Home", href: "/", isExternal: true }, { name: "Projects", href: "/projects", isExternal: true }]} />
        <div className="max-w-7xl mx-auto">
          <header className="mb-32">
          <Link to="/" className="inline-flex items-center gap-2 text-neon-mint/60 hover:text-neon-mint transition-all mb-16 group relative py-1">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="font-mono text-sm uppercase tracking-widest relative">
              Back to Portfolio
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-neon-mint group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          
          <div className="max-w-5xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-sans font-black text-white leading-[1.1] tracking-tighter mb-8"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
            >
              Documenting the logic behind <span className="text-[#00FF66] selection:text-black">complex systems</span> and <span className="text-[#00FF66] selection:text-black">scalable infrastructure</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[#9CA3AF] text-sm md:text-base max-w-2xl mb-16 leading-relaxed"
            >
              // A technical log of backend architectures, blockchain protocols, and agentic workflows by UL.
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8 mb-20">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative text-xs md:text-sm font-mono uppercase tracking-[0.15em] transition-all duration-300 group
                    ${activeCategory === category ? 'text-[#00FF66]' : 'text-[#949494] hover:text-[#00FF66]'}`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div 
                      layoutId="activeCategory"
                      className="absolute -bottom-[33px] left-0 right-0 h-[2px] bg-[#00FF66] shadow-[0_0_10px_#00FF66]"
                    />
                  )}
                  {activeCategory === category && (
                    <div className="absolute -right-2 top-0 w-1 h-1 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 self-end md:self-auto">
              <div className="relative group/search">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#00FF66]/40 group-focus-within/search:text-[#00FF66] transition-colors uppercase tracking-widest">
                  // SEARCH_
                </span>
                <input 
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-transparent border-b border-[#00FF66]/10 focus:border-[#00FF66]/60 focus:ring-0 focus:outline-none pl-20 pr-4 py-1 text-white font-mono text-xs w-48 md:w-64 transition-all duration-300 focus:shadow-[0_4px_10px_-5px_rgba(0,255,102,0.2)]"
                  spellCheck="false"
                />
              </div>

              <button
                type="button"
                aria-label={`Sort posts ${sortOrder === "DESC" ? "oldest first" : "newest first"}`}
                onClick={() => setSortOrder(prev => prev === "DESC" ? "ASC" : "DESC")}
                className="font-mono text-[10px] tracking-widest text-[#949494] hover:text-[#00FF66] transition-colors border border-white/10 rounded px-3 py-1 bg-white/5 active:scale-95"
              >
                [{sortOrder}]
              </button>
            </div>
          </div>
        </header>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(320px,auto)]"
        >
          <AnimatePresence mode="popLayout">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post, idx) => {
                // asymmetric bento grid logic
                // The "Tashawwur" card or the first card should be the feature
                const isFeature = post.slug.includes("tashawwur") || idx === 0;
                // 1-2 other cards span 2 rows (vertical tall)
                const isTall = idx === 2 || idx === 5;
                
                const gridClass = isFeature 
                  ? "md:col-span-8 md:row-span-2" 
                  : isTall
                    ? "md:col-span-4 md:row-span-2"
                    : "md:col-span-4 md:row-span-1";

                const visibleTags = post.tags.slice(0, 3);
                const remainingTags = post.tags.length - 3;

                return (
                  <motion.div
                    layout
                    key={post.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`${gridClass} group relative bg-[#111111] border border-[#00FF66]/10 rounded-3xl overflow-hidden hover:border-[#00FF66]/80 transition-all duration-500 flex flex-col h-full min-h-max`}
                    whileHover={{ 
                      backgroundColor: "rgba(17, 17, 17, 0.8)",
                      boxShadow: "0 0 15px rgba(0, 255, 102, 0.2), inset 0 0 20px rgba(0, 255, 102, 0.05)"
                    }}
                  >
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className={`relative z-10 ${isFeature ? 'p-8 md:p-10' : 'p-6 md:p-8'} flex flex-col h-full flex-grow`}
                    >
                      <div className="flex-grow shrink-0">
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                          {visibleTags.map(tag => (
                            <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-[#00FF66] border border-[#00FF66]/15 px-3 py-1 rounded-full bg-[#00FF66]/[0.03] backdrop-blur-sm">
                              {tag}
                            </span>
                          ))}
                          {remainingTags > 0 && (
                            <span className="text-[10px] font-mono text-[#949494] tracking-tighter">
                              +{remainingTags}
                            </span>
                          )}
                        </div>
                        <h2 className={`${isFeature ? 'text-3xl md:text-5xl line-clamp-3' : 'text-xl md:text-2xl line-clamp-2'} font-bold text-white leading-[1.3] mb-4 group-hover:text-neon-mint transition-colors`}>
                          {post.title}
                        </h2>
                        <p className={`text-[#A0A0A0] text-sm md:text-base ${isFeature ? 'line-clamp-4' : 'line-clamp-3'} leading-[1.6]`}>
                          {post.excerpt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 shrink-0">
                        <div className="flex items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.05em] text-[#6B7280] group-hover:text-neon-mint transition-colors">
                          <span className="flex items-center gap-2"><Calendar size={14} strokeWidth={1.5} className="mt-[-1px]" /> {new Date(post.date).toISOString().slice(0, 10)}</span>
                          <span className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="mt-[-1px]" /> {post.readingTime}</span>
                        </div>
                        <ChevronRight size={20} className="text-neon-mint flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-12 py-32 text-center"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#949494] mb-4">
                  // 0 PROTOCOLS MATCH YOUR QUERY.
                </p>
                <button
                  onClick={() => { setSearchInput(""); setSearchQuery(""); setActiveCategory("All"); }}
                  className="text-[10px] font-mono text-neon-mint hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#949494] hover:text-neon-mint disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10 rounded-full"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-xs font-mono rounded-full transition-all ${
                  safePage === n
                    ? "bg-neon-mint text-[#111111] font-bold"
                    : "text-[#949494] hover:text-white hover:bg-white/5"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#949494] hover:text-neon-mint disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10 rounded-full"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [toc, setToc] = useState<ToCItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(`/api/posts?slug=${slug}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);

        // Generate ToC
        const headings: ToCItem[] = [];
        const content = data.content || '';
        const lines = content.split("\n");
        lines.forEach((line: string) => {
          // Robust regex for headings, handling potential carriage returns
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
        setError(err.name === "AbortError" ? "Request timeout - please try again" : `Error loading post: ${err.message}`);
      })
      .finally(() => clearTimeout(timeoutId));
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    let cleanupScroll: (() => void) | undefined;

    const timer = setTimeout(() => {
      const onScroll = () => {
        const headings = document.querySelectorAll<HTMLElement>(".markdown-body h2, .markdown-body h3");
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
  }, [post]);

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
        className="flex items-center gap-1.5 text-[#949494] hover:text-neon-mint transition-colors px-2 py-1 rounded"
        title="Copy code"
      >
        <span className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${copied ? 'opacity-100 translate-x-0 text-neon-mint' : 'opacity-0 translate-x-2'}`}>
          Copied!
        </span>
        {copied ? <Check size={14} className="text-neon-mint" /> : <Copy size={14} />}
      </button>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Link to="/blog" className="inline-flex items-center gap-2 text-neon-mint/60 hover:text-neon-mint transition-all mb-8 group relative py-1">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="font-mono text-sm uppercase tracking-widest">Back to Blog</span>
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
        <div className="text-neon-mint animate-pulse font-mono tracking-tighter text-xl">
          LOADING_POST...
        </div>
      </div>
    );
  }
  if (!post) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link to="/blog" className="inline-flex items-center gap-2 text-neon-mint/60 hover:text-neon-mint transition-all mb-8 group relative py-1">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
          <span className="font-mono text-sm uppercase tracking-widest">Back to Blog</span>
        </Link>
        <div className="text-neon-mint/60 font-mono text-sm">Post not found</div>
      </div>
    </div>
  );

  const siteUrl = 'https://maulana.sumbu.xyz';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = (() => {
    const img = post.frontmatter.img;
    if (!img) return `${siteUrl}/og-image.png`;
    // Relative path: prepend site URL (always HTTPS)
    if (img.startsWith('/')) return `${siteUrl}${img}`;
    // Already HTTPS: use as-is
    if (img.startsWith('https://')) return img;
    // HTTP or other scheme: fall back to OG image to avoid mixed content
    return `${siteUrl}/og-image.png`;
  })();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.frontmatter.title,
    "image": imageUrl,
    "datePublished": post.frontmatter.date,
    "dateModified": post.frontmatter.modified || post.frontmatter.date,
    "author": {
      "@type": "Person",
      "name": "Maulana Anjari Anggorokasih",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maulana Anjari",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.png`
      }
    },
    "description": post.frontmatter.excerpt,
    "url": postUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.frontmatter.title,
        "item": postUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{post.frontmatter.title || "Post"} | Maulana Anjari</title>
        <meta name="description" content={post.frontmatter.excerpt} />
        <meta name="keywords" content={(post.frontmatter.tags || []).join(', ')} />
        <link rel="canonical" href={postUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:description" content={post.frontmatter.excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="article:published_time" content={post.frontmatter.date} />
        <meta property="article:modified_time" content={post.frontmatter.modified || post.frontmatter.date} />
        <meta property="article:author" content="Maulana Anjari Anggorokasih" />
        <meta property="article:section" content="Technology" />
        {(post.frontmatter.tags || []).map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={postUrl} />
        <meta name="twitter:title" content={post.frontmatter.title} />
        <meta name="twitter:description" content={post.frontmatter.excerpt} />
        <meta name="twitter:image" content={imageUrl} />

        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] selection:bg-neon-mint selection:text-black scroll-smooth">
        <FloatingMenu items={[{ name: "All Posts", href: "/blog", isExternal: true }, { name: "Home", href: "/", isExternal: true }]} />
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-neon-mint z-[100] origin-left shadow-[0_0_10px_#00FF66]"
          style={{ scaleX }}
        />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col md:flex-row gap-16">
        {/* Main Content */}
        <div className="flex-1 max-w-[750px]">
          <Link to="/blog" className="inline-flex items-center gap-2 text-neon-mint/60 hover:text-neon-mint transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm uppercase tracking-widest">Back to Library</span>
          </Link>

          <header className="mb-20">
            <div className="flex items-center gap-4 mb-6 font-mono text-xs uppercase tracking-widest text-[#949494]">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-neon-mint/40" /> {post.frontmatter.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-neon-mint/40" /> {post.frontmatter.readingTime}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-10 tracking-tighter">
              {post.frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {(post.frontmatter.tags || []).map((tag: string) => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-[#888888] border border-white/5 px-3 py-1 rounded-full bg-white/5 flex items-center gap-2">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          </header>

          <div ref={contentRef} className="markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-16 mb-8 flex items-baseline">
                    <span className="text-neon-mint mr-3">::</span> {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  const text = getFlattenedText(children);
                  const id = generateId(text);
                  return (
                    <h2 id={id} className="text-2xl font-bold text-white mt-12 mb-6 flex items-baseline group scroll-mt-32">
                      <span className="text-neon-mint mr-3">::</span> {children}
                      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 ml-2 text-sm text-neon-mint transition-opacity">#</a>
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = getFlattenedText(children);
                  const id = generateId(text);
                  return (
                    <h3 id={id} className="text-xl font-bold text-white mt-10 mb-4 flex items-baseline group scroll-mt-32">
                      <span className="text-neon-mint mr-3">::</span> {children}
                      <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 ml-2 text-sm text-neon-mint transition-opacity">#</a>
                    </h3>
                  );
                },
                p: ({ children }) => <p className="leading-relaxed text-lg text-[#D1D5DB] font-sans mb-8 tracking-normal">{children}</p>,
                ul: ({ children }) => <ul className="list-none mb-10 space-y-4">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start gap-4">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-neon-mint flex-shrink-0 shadow-[0_0_8px_rgba(0,255,102,0.5)]" />
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
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-neon-mint font-bold border-b border-neon-mint/30">
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
                  
                  // Robust inline detection: if no language class is provided or it's explicitly inline
                  const isInline = inline || !className;

                  if (isInline) {
                    return (
                      <code className="bg-[#00FF66]/[0.1] text-[#00FF66] px-1.5 py-0.5 rounded-[4px] font-mono text-[0.9em] border border-[#00FF66]/10">
                        {children}
                      </code>
                    );
                  }

                  if (lang === "mermaid") {
                    return <MermaidCodeBlock code={codeString} />;
                  }

                  // Special handling for Algorithm blocks
                  const isAlgorithm = codeString.trim().startsWith("ALGORITHM");

                  return (
                    <div className={`my-10 rounded-xl overflow-hidden border ${isAlgorithm ? "border-neon-mint/30 shadow-[0_0_30px_rgba(0,255,102,0.1)]" : "border-[#333333] shadow-2xl"} group/code`}>
                      <div className={`${isAlgorithm ? "bg-neon-mint/10" : "bg-[#1A1A1A]"} px-4 py-2 flex items-center justify-between border-b ${isAlgorithm ? "border-neon-mint/20" : "border-[#333333]"}`}>
                        <div className="flex gap-2">
                          <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-neon-mint" : "bg-[#FF5F56]"} opacity-60`} />
                          <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-neon-mint" : "bg-[#FFBD2E]"} opacity-60`} />
                          <div className={`w-3 h-3 rounded-full ${isAlgorithm ? "bg-neon-mint" : "bg-[#27C93F]"} opacity-60`} />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-[10px] uppercase tracking-widest ${isAlgorithm ? "text-neon-mint" : "text-[#949494]"}`}>
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
                        {/* Subtle green glow on the code block edge */}
                        <div className={`absolute top-0 right-0 h-full w-[2px] ${isAlgorithm ? "bg-neon-mint" : "bg-neon-mint/20"} opacity-0 group-hover/code:opacity-100 transition-opacity`} />
                      </div>
                    </div>
                  );
                },
                img: ({ src, alt }) => {
                  const isShield = src?.includes('img.shields.io');
                  if (isShield) {
                    return (
                      <img
                        src={getSafeImageSrc(src)}
                        alt={alt}
                        loading="lazy"
                        className="inline-block h-7 w-auto my-1"
                      />
                    );
                  }
                  return (
                  <div className="my-12">
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
                      className="rounded-2xl w-full border border-white/5 shadow-[0_0_40px_rgba(0,255,102,0.1)] transition-all hover:shadow-[0_0_60px_rgba(0,255,102,0.15)]"
                    />
                    {alt && (
                      <p className="text-center text-[10px] font-mono text-[#949494] mt-6 uppercase tracking-[0.3em]">
                        // fig. 01: {alt} ARCHITECTURE
                      </p>
                    )}
                    </div>
                  );
                },
                strong: ({ children }) => <strong className="text-neon-mint font-bold">{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-neon-mint pl-8 my-10 italic text-[#AAAAAA] text-xl bg-neon-mint/5 py-4 rounded-r-xl">
                    {children}
                  </blockquote>
                )
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar / ToC */}
        <aside className="hidden lg:block w-72">
          <div className="sticky top-32">
            <div className="flex items-center gap-3 mb-8 text-[#888888] font-mono text-[10px] uppercase tracking-[0.2em] border-b border-[#333333] pb-4">
              <List size={14} className="text-neon-mint" />
              Table of Contents
            </div>
            <nav className="space-y-4">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:text-neon-mint ${
                    activeId === item.id 
                      ? "text-neon-mint border-l-2 border-neon-mint pl-4" 
                      : `text-[#949494] border-l-2 border-transparent ${item.level === 3 ? "pl-8 opacity-70" : "pl-4"}`
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>

            <div className="mt-20 pt-10 border-t border-[#333333]">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888] mb-6">Share to social media</p>
              <div className="flex flex-col gap-3">
                {[
                  { id: 'twitter', name: 'Twitter', icon: Twitter },
                  { id: 'linkedin', name: 'Linkedin', icon: Linkedin },
                  { id: 'github', name: 'Github', icon: Github }
                ].map(social => (
                  <button 
                    key={social.id} 
                    className="flex items-center gap-3 w-fit text-[10px] font-mono uppercase tracking-[0.2em] text-[#949494] border border-white/5 bg-white/5 py-2 px-4 rounded-full hover:text-neon-mint hover:border-neon-mint/30 hover:bg-neon-mint/5 transition-all text-left group"
                  >
                    <social.icon size={14} className="group-hover:scale-110 transition-transform" />
                    {social.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
