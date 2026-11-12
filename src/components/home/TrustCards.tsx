import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskConical, HeartHandshake, PackageCheck } from "lucide-react";
import { MUTED, underlineLink } from "./Shared";

const CARDS = [
  {
    icon: FlaskConical,
    bg: "#E0F2FE",
    title: "Lab-tested, every batch",
    body: "Fat, SNF and quality checks happen before anything is packed.",
    cta: "See how we test",
    to: "#process",
  },
  {
    icon: HeartHandshake,
    bg: "#E6E9F9",
    title: "25+ years, one family",
    body: "We eat what we sell, so it has to be honest, every single day.",
    cta: "Read our story",
    to: "/about",
  },
  {
    icon: PackageCheck,
    bg: "#DDF1E8",
    title: "Buying in bulk?",
    body: "Shops, caterers and big families get steady supply at fair prices.",
    cta: "Contact us",
    to: "/contact-us",
  },
];

export default function TrustCards() {
  return (
    <section className="bg-white px-6 pb-8 pt-20 font-body md:pt-24">
      <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-14 md:grid-cols-3">
        {CARDS.map(({ icon: Icon, bg, title, body, cta, to }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[32px] px-8 pb-10 pt-14 text-center shadow-[0_26px_44px_-28px_rgba(47,111,163,0.45)]"
            style={{ background: bg }}
          >
            <span className="absolute -top-9 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_-12px_rgba(47,111,163,0.4)]">
              <Icon className="h-8 w-8 text-[#2F6FA3]" strokeWidth={1.5} />
            </span>
            <h3 className="font-display text-2xl tracking-[0.06em] text-[#1B2430]">{title}</h3>
            <p className="mx-auto mt-3 max-w-[16rem] text-[15px] leading-7" style={{ color: MUTED }}>
              {body}
            </p>
            {to.startsWith("#") ? (
              <a href={to} className={`mt-7 inline-block ${underlineLink}`}>{cta}</a>
            ) : (
              <Link to={to} className={`mt-7 inline-block ${underlineLink}`}>{cta}</Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}