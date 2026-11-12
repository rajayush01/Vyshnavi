import { useState } from "react";
import { MUTED } from "./shared";

// TODO: replace these placeholders with real customer reviews (Google, LinkedIn, X...).
const REVIEWS = [
  { name: "Customer name", source: "@google reviews", text: "Paste a real customer review here. Long reviews are trimmed on the card and expand when the visitor taps Read more, so you can paste the full text." },
  { name: "Customer name", source: "@linkedin", text: "Paste a real customer review here. Long reviews are trimmed on the card and expand when the visitor taps Read more, so you can paste the full text." },
  { name: "Customer name", source: "@google reviews", text: "Paste a real customer review here. Long reviews are trimmed on the card and expand when the visitor taps Read more, so you can paste the full text." },
  { name: "Customer name", source: "@x", text: "Paste a real customer review here. Long reviews are trimmed on the card and expand when the visitor taps Read more, so you can paste the full text." },
];

const TILT = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];

function ReviewCard({ r, tilt }: { r: (typeof REVIEWS)[number]; tilt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`flex min-h-[320px] w-[300px] shrink-0 snap-center flex-col justify-between rounded-[28px] bg-white p-8 shadow-[0_24px_44px_-26px_rgba(47,111,163,0.5)] transition-transform duration-300 hover:rotate-0 ${tilt}`}
    >
      <div>
        <p className={`text-[15px] leading-7 text-[#1B2430] ${open ? "" : "line-clamp-5"}`}>{r.text}</p>
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 font-semibold text-[#1B2430] underline decoration-2 underline-offset-4 hover:text-[#2F6FA3]"
        >
          {open ? "Show less" : "Read More"}
        </button>
      </div>
      <footer className="mt-8">
        <p className="text-lg font-semibold text-[#1B2430]">{r.name}</p>
        <p style={{ color: MUTED }}>{r.source}</p>
      </footer>
    </article>
  );
}

export default function HappyFolks() {
  return (
    <section className="py-20 font-body">
      <h2 className="text-center font-display text-4xl tracking-[0.08em] text-[#1B2430]">HAPPY FOLKS!</h2>
      <div className="mt-12 flex snap-x gap-8 overflow-x-auto px-6 py-8 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} r={r} tilt={TILT[i % TILT.length]} />
        ))}
      </div>
    </section>
  );
}