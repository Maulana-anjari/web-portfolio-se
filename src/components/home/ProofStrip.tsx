export default function ProofStrip() {
  return (
    <section className="relative w-full bg-[#0F0F0F] px-6 md:px-10 lg:px-20 py-8 z-10 border-b border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_2fr] md:items-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-neon-mint">
            // Proof of Work
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs md:text-sm font-semibold text-[#D1D5DB]">
            {[
              "Pertamina EP",
              "Kemdiktisaintek",
              "Sumbu Labs",
              "51.9% faster issue-to-merge",
              "50% faster inspection turnaround",
              "100% uptime on inspection platform",
              "B.Eng. Information Engineering · UGM",
            ].map((proof) => (
              <span key={proof} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-mint shadow-[0_0_8px_rgba(0,255,102,0.6)]" />
                {proof}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
