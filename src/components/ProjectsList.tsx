import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useCursor } from "../context/CursorContext";
import FloatingMenu from "./shared/FloatingMenu";

const PROJECTS_MENU = [
  { name: "Home", href: "/", isExternal: true },
  { name: "Blog", href: "/blog", isExternal: true },
  { name: "Projects", href: "/projects", isExternal: true },
  { name: "Contact", href: "mailto:maulana17anjari@gmail.com", isExternal: true },
];

interface ProjectMeta {
  slug: string;
  title: string;
  role: string;
  company: string;
  period: string;
  tags: string[];
  image: string;
  metric: string;
  order: number;
  excerpt: string;
  status?: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setIsHoveringProject, setIsHoveringButton, setAccentColor } = useCursor();

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    fetch("/api/projects")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { setProjects(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => {
    setAccentColor("amber");
    return () => setAccentColor("neon-mint");
  }, [setAccentColor]);

  useEffect(() => { fetchProjects(); }, []);

  return (
    <>
      <Helmet>
        <title>Projects — Maulana Anjari</title>
        <meta name="description" content="Evidence-backed backend engineering case studies, from enterprise LLM platforms to Web3 payment infrastructure." />
        <link rel="canonical" href="https://maulana.sumbu.xyz/projects" />
        <meta property="og:url" content="https://maulana.sumbu.xyz/projects" />
        <meta property="og:title" content="Projects — Maulana Anjari" />
        <meta property="og:description" content="Evidence-backed backend engineering case studies." />
        <meta property="og:image" content="https://maulana.sumbu.xyz/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://maulana.sumbu.xyz" },
              { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://maulana.sumbu.xyz/projects" }
            ]
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 md:px-20">
        <FloatingMenu items={PROJECTS_MENU} />
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-400/60 hover:text-amber-400 transition-all mb-16 group relative py-1">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="font-mono text-sm uppercase tracking-widest relative">
              Back to Portfolio
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6">
            Projects
          </h1>
          <p className="font-mono text-[#9CA3AF] text-sm md:text-base max-w-2xl mb-16 leading-relaxed">
            Evidence-backed case studies, from enterprise LLM platforms to Web3 payment infrastructure. Each project includes verified metrics and production outcomes.
          </p>

          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#111111] rounded-2xl h-48" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center max-w-md mx-auto">
              <div className="text-red-400 font-mono text-sm mb-4 border border-red-400/30 rounded px-4 py-3 bg-red-400/5">
                {error}
              </div>
              <button
                type="button"
                onClick={fetchProjects}
                className="px-6 py-2 border border-amber-400 text-amber-400 font-mono text-sm uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map(project => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  onMouseEnter={() => setIsHoveringProject(true)}
                  onMouseLeave={() => setIsHoveringProject(false)}
                  className="group block bg-[#111111] border border-amber-400/10 rounded-2xl p-6 md:p-8
                           hover:border-amber-400/40 hover:bg-[#111111]/80 transition-all duration-300 cursor-none"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {project.image && (
                      <div className="md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
                        <img src={project.image} alt={project.title}
                             width="192" height="128" loading="lazy"
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                          project.status === 'design' ? 'border border-amber-400/30 text-amber-300' : 'text-amber-400 bg-amber-400/10'
                        }`}>
                          {project.status === 'design' ? 'REQUEST FOR · ' : ''}{project.metric}
                        </span>
                        <span className="text-xs text-[#6B7280]">{project.period}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">
                        {project.title}
                      </h2>
                      <p className="text-[#9CA3AF] text-sm mb-3">
                        {project.role} · {project.company}
                      </p>
                      <p className="text-[#6B7280] text-sm line-clamp-2">{project.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-xs text-amber-400/70 bg-amber-400/5 border border-amber-400/10 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-xs text-[#6B7280]">+{project.tags.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B7280] group-hover:text-amber-400 transition-colors"
                  >
                    View Case Study <span aria-hidden="true">↗</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
