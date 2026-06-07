import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CursorProvider, useCursor } from "./context/CursorContext";
import GlobalCursor from "./components/shared/GlobalCursor";
import RouteLoader from "./components/shared/RouteLoader";
import { NotFound } from "./components/NotFound";

// Lazy-loaded sections
const HeroSection = lazy(() => import("./components/home/HeroSection"));
const ProofStrip = lazy(() => import("./components/home/ProofStrip"));
const ProblemsSection = lazy(() => import("./components/home/ProblemsSection"));
const SkillsSection = lazy(() => import("./components/home/SkillsSection"));
const ExperienceSection = lazy(() => import("./components/home/ExperienceSection"));
const ProjectsSection = lazy(() => import("./components/home/ProjectsSection"));
const ServicesSection = lazy(() => import("./components/home/ServicesSection"));
const ProcessSection = lazy(() => import("./components/home/ProcessSection"));
const TestimonialsSection = lazy(() => import("./components/home/TestimonialsSection"));
const TechStackSection = lazy(() => import("./components/home/TechStackSection"));
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const FooterSection = lazy(() => import("./components/home/FooterSection"));

// Route-level lazy loads
const BlogIndex = lazy(() =>
  import("./components/Blog").then((m) => ({ default: m.BlogIndex })),
);
const BlogPost = lazy(() =>
  import("./components/Blog").then((m) => ({ default: m.BlogPost })),
);

/** Height-preserving placeholder during section lazy-load */
function SectionFallback({ height = "400px" }: { height?: string }) {
  return (
    <div style={{ height }} className="bg-dark-charcoal" />
  );
}

function PortfolioHome() {
  const { isHoveringProject, isHoveringButton } = useCursor();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const openResume = () => {
    if (window.innerWidth < 768) {
      window.open("/resume.pdf", "_blank");
      return;
    }
    setIsPdfLoading(true);
    setTimeout(() => {
      setIsPdfLoading(false);
      setIsResumeModalOpen(true);
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Maulana Anjari | Backend & AI Engineer - Portfolio</title>
        <meta name="description" content="Backend & AI Engineer building reliable APIs, LLM workflows, blockchain-backed systems, and governed digital infrastructure. Experienced across Pertamina EP, Sumbu Labs, and UGM." />
        <meta name="keywords" content="Maulana Anjari, Backend AI Engineer, LLM Infrastructure Engineer, RAG Engineer, Blockchain Developer Indonesia, Digital Governance, IT Audit, Cardano, FastAPI, Go Developer, Sumbu Labs" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maulana.sumbu.xyz/" />
        <meta property="og:title" content="Maulana Anjari | Backend & AI Engineer" />
        <meta property="og:description" content="Reliable APIs, LLM workflows, blockchain-backed systems, and governed digital infrastructure." />
        <meta property="og:image" content="https://maulana.sumbu.xyz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://maulana.sumbu.xyz/" />
        <meta name="twitter:title" content="Maulana Anjari | Backend & AI Engineer" />
        <meta name="twitter:description" content="Backend systems, LLM workflows, blockchain infrastructure, and risk-aware digital governance." />
        <meta name="twitter:image" content="https://maulana.sumbu.xyz/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Maulana Anjari Anggorokasih",
            "alternateName": "Maul",
            "url": "https://maulana.sumbu.xyz",
            "jobTitle": "Backend & AI Engineer",
            "image": "https://maulana.sumbu.xyz/og-image.png",
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Universitas Gadjah Mada",
              "sameAs": "https://www.ugm.ac.id/",
            },
            "award": "Bachelor of Information Technology (GPA 3.40/4.00)",
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "degree",
              "educationalLevel": "Bachelor",
              "name": "Sarjana Teknik",
              "sameAs": "Bachelors of Engineering in Information Engineering",
            },
            "knowsAbout": [
              "Backend Development", "AI Engineering", "LLM Infrastructure",
              "Digital Governance", "Blockchain Development", "Cardano", "Go", "Python",
            ],
            "worksFor": [
              { "@type": "Organization", "name": "LKFT UGM x PT Pertamina EP" },
              { "@type": "Organization", "name": "Sumbu Labs" },
            ],
            "sameAs": [
              "https://linkedin.com/in/maulana-anjari-anggorokasih",
              "https://github.com/Maulana-anjari",
              "https://www.instagram.com/maulana_anjari",
              "https://www.instagram.com/maul_foto.rar",
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Maulana Anjari - Portfolio",
            "url": "https://maulana.sumbu.xyz",
            "description": "Backend & AI Engineer building reliable APIs, LLM workflows, blockchain-backed systems, and governed digital infrastructure",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://maulana.sumbu.xyz/blog?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Helmet>

      <main id="main-content" tabIndex={-1} className="w-full bg-dark-charcoal text-white selection:bg-neon-mint selection:text-black cursor-none">
        <GlobalCursor
          isHoveringProject={isHoveringProject}
          isHoveringButton={isHoveringButton}
        />

        <Suspense fallback={<SectionFallback height="100vh" />}>
          <HeroSection onOpenResume={openResume} />
        </Suspense>
        <Suspense fallback={<SectionFallback height="80px" />}>
          <ProofStrip />
        </Suspense>
        <Suspense fallback={<SectionFallback height="500px" />}>
          <ProblemsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="700px" />}>
          <SkillsSection isPdfLoading={isPdfLoading} onOpenResume={openResume} />
        </Suspense>
        <Suspense fallback={<SectionFallback height="800px" />}>
          <ExperienceSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="800px" />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="600px" />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="400px" />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="500px" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="400px" />}>
          <TechStackSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="600px" />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<SectionFallback height="800px" />}>
          <FooterSection
            isResumeModalOpen={isResumeModalOpen}
            onCloseResumeModal={() => setIsResumeModalOpen(false)}
          />
        </Suspense>
      </main>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <CursorProvider>
        <BrowserRouter>
          <ScrollToTop />
          <GlobalCursor isHoveringProject={false} isHoveringButton={false} />
          <Routes>
            <Route path="/" element={<PortfolioHome />} />
            <Route
              path="/blog"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <BlogIndex />
                </Suspense>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <BlogPost />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CursorProvider>
    </HelmetProvider>
  );
}
