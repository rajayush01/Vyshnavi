import { motion, useReducedMotion } from "framer-motion";
import { BirdsDoodle, SunDoodle, TearBadge } from "./Shared";

const STEPS = [
  { color: "#BFE0F2", text: "We're a family business, and for over 25 years we've made dairy that our own families can trust." },
  { color: "#E6E9F9", text: "Milk comes from verified procurement centres, is chilled quickly, then processed on automated, contactless machinery, so it's handled as little as possible." },
  { color: "#DDF1E8", text: "Every batch is lab-tested before it's packed. No palm oil, no vegetable oil, no vanaspati, no starch, no chemicals. Ever." },
  { color: "#CFE6F5", text: "One rule shapes everything: if it isn't good enough for our own family, it doesn't leave the plant. And it should stay affordable for every Indian home." },
];

const Character = () => (
  <svg viewBox="0 0 320 300" className="w-[min(78%,360px)]" aria-hidden>
    <path d="M40 170C20 90 100 20 180 20C250 20 300 90 295 170C290 245 220 285 150 285C90 285 55 240 40 170Z" fill="#8EC5E8" />
    <path d="M95 118q15 12 30 0M178 118q15 12 30 0M152 126q-9 24 6 34" stroke="#1B2430" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M108 178C108 142 150 132 186 152C216 170 216 216 182 240C150 262 105 246 100 206Z" fill="#D5EDE2" />
    <path d="M132 190q9 8 18 0M170 188q9 8 18 0M150 214q10 8 20 0" stroke="#1B2430" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

export default function OurStory() {
  const reduce = useReducedMotion();
  return (
    <section className="relative bg-white font-body">
      <div className="grid md:min-h-[780px] md:grid-cols-[46%_54%]">
        <div className="flex flex-col items-center justify-center bg-[#E0F2FE] py-16 md:rounded-r-[55%/50%]">
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex w-full justify-center"
          >
            <Character />
          </motion.div>
          <h2 className="mt-10 font-display text-5xl tracking-[0.08em] text-[#1B2430]">OUR STORY</h2>
        </div>

        <div className="relative px-6 py-16 md:px-14 lg:px-24">
          <SunDoodle className="absolute right-6 top-8 h-20 w-20 md:h-24 md:w-24" />
          <BirdsDoodle className="absolute bottom-10 left-6 h-10 w-24 md:left-10" />
          <ol className="space-y-14 pt-14">
            {STEPS.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`flex max-w-md flex-col gap-5 ${i % 2 ? "md:ml-24" : ""}`}
              >
                <TearBadge n={i + 1} color={s.color} />
                <p className="text-lg leading-8 text-[#1B2430]">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}