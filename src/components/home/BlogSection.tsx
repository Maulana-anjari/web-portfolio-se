import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../shared/SectionHeader";
import { useCursor } from "../../context/CursorContext";

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogError, setBlogError] = useState(false);
  const { setIsHoveringProject, setIsHoveringButton } = useCursor();

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setBlogPosts(data.slice(0, 3)))
      .catch(() => setBlogError(true));
  }, []);

  return (
    <section
      id="blog"
      className="relative w-full bg-dark-charcoal py-[120px] px-10 md:px-20 z-10 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="//Blogs"
          title="Back-End Insights & Architectural Ideas"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.length > 0
            ? blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  onMouseEnter={() => setIsHoveringProject(true)}
                  onMouseLeave={() => setIsHoveringProject(false)}
                  className="group flex flex-col gap-4"
                >
                  <div className="relative aspect-video overflow-hidden rounded-[12px] bg-[#1A1A1A]">
                    <img
                      src={
                        post.img ||
                        "https://placehold.co/600x400/1A1A1A/666666?text=No+Image&font=roboto"
                      }
                      alt={post.title}
                      width="600"
                      height="338"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== "https://placehold.co/600x400/1A1A1A/666666?text=No+Image&font=roboto") {
                          target.src = "https://placehold.co/600x400/1A1A1A/666666?text=No+Image&font=roboto";
                        }
                      }}
                      className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00FF66]">
                      {post.tags?.[0] || "//POST"}
                    </span>
                    <span className="text-[#949494]">|</span>
                    <span className="text-xs text-[#A0A0A0]">
                      {new Date(post.date).toISOString().slice(0, 10)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-[#00FF66] line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[#888888] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              ))
            : blogError
              ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-sm text-[#A0A0A0] mb-4 font-mono">
                    // Failed to load posts
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBlogError(false);
                      fetch("/api/posts")
                        .then((res) => res.json())
                        .then((data) => setBlogPosts(data.slice(0, 3)))
                        .catch(() => setBlogError(true));
                    }}
                    className="text-xs font-mono text-neon-mint hover:underline uppercase tracking-widest"
                  >
                    Retry
                  </button>
                </div>
              )
              : [1, 2, 3].map((_, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="aspect-video bg-[#1A1A1A] rounded-[12px] animate-pulse" />
                  <div className="flex items-center gap-3 mt-2">
                    <div className="h-5 w-16 bg-[#1A1A1A] rounded-full animate-pulse" />
                    <div className="h-3 w-3 bg-[#1A1A1A] rounded-full animate-pulse" />
                    <div className="h-3 w-20 bg-[#1A1A1A] rounded animate-pulse" />
                  </div>
                  <div className="h-7 w-full bg-[#1A1A1A] rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#1A1A1A] rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-[#1A1A1A] rounded animate-pulse" />
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-[60px] flex justify-center">
          <Link
            to="/blog"
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className="rounded-full bg-[#00FF66] px-10 py-5 text-sm font-bold text-[#111111] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,102,0.45)]"
          >
            Explore Full Archive
          </Link>
        </div>
      </div>
    </section>
  );
}
