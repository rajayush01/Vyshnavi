import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import logo from "../../assets/logo.png";
import cow from "../../assets/cow.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import FreshnessJourney from "./FreshnessJourney";

const categoryPath = (key: string) =>
  key === "ghee" ? "/ghee" : `/category/${key}`;

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const productLinks = [
  { label: "Milk Variants", key: "milk" },
  { label: "Cow & Buffalo Ghee", key: "ghee" },
  { label: "Curd", key: "curd" },
  { label: "Malai Paneer", key: "paneer" },
  { label: "Butter", key: "butter" },
  { label: "Badam Milk", key: "beverages" },
  { label: "Lassi & Buttermilk", key: "beverages" },
  { label: "Khova", key: "khova" },
  { label: "Sweet Boxes", key: "sweets" },
];

const quickLinks = [
  "Our 25+ Year Family Story",
  "Our Lab & Machinery",
  "Know Your Dairy (Blog)",
  "Bulk / Festive Orders",
  "Distributor & Retail Enquiry",
  "Privacy & Quality Policy",
];

const addresses = [
  {
    title: "Corporate Office & Plant",
    text: "Sy. 254/A, Gundrathimadugu (V), Konijerla (M), Wyra, Khammam – 507165, Telangana",
    map: mapsUrl(
      "Sy. 254/A, Gundrathimadugu, Konijerla, Wyra, Khammam, Telangana 507165"
    ),
  },
  {
    title: "Hyderabad Office",
    text: "Laxmi Nagar Colony, Hyderabad – 500074",
    map: mapsUrl("Laxmi Nagar Colony, Hyderabad, Telangana 500074"),
  },
];

const phones = ["+91 8977748444", "+91 8465869663", "+91 8749293399"];
const emails = ["svfwyra@gmail.com", "hello@vyshnavi.in"];

const socials = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "X", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

const linkCls =
  "text-sky-100/75 hover:text-cyan-300 hover:translate-x-0.5 inline-block transition-all duration-200";
const contactLinkCls = "text-sky-100/80 hover:text-cyan-300 transition-colors";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-white font-bold text-xs tracking-[0.22em] uppercase">
        {children}
      </h3>
      <span className="block w-8 h-0.5 bg-cyan-400 mt-2.5 rounded-full" />
    </div>
  );
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-cyan-300 flex items-center justify-center flex-shrink-0">
      {children}
    </span>
  );
}

/* ---------- Pasture scene built around the cow line-art ---------- */

function Grass() {
  // deterministic blades so SSR / re-renders never differ
  const blades = Array.from({ length: 240 }, (_, i) => {
    const x = i * 6 + ((i * 7) % 5);
    const h = 5 + ((i * 13) % 12);
    const lean = ((i * 11) % 7) - 3;
    return `M${x} 24 Q${x + lean / 2} ${24 - h / 2} ${x + lean} ${24 - h}`;
  });

  return (
    <svg
      viewBox="0 0 1440 24"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-[62px] md:bottom-[58px] w-full h-6 text-sky-300"
      aria-hidden="true"
    >
      <path
        d={blades.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.28"
      />
    </svg>
  );
}

function PastureScene() {
  const glow = "drop-shadow(0 0 10px rgba(56,189,248,0.35))";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft moon-like glow behind the herd */}
      <div className="ff-glow absolute right-[6%] bottom-[40px] w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),transparent_65%)]" />
      <div className="absolute left-[4%] bottom-[30px] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28),transparent_65%)]" />

      {/* Rolling hills */}
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-full"
      >
        <path
          d="M0 150 C220 110 420 170 700 140 C960 112 1180 160 1440 128 L1440 240 L0 240 Z"
          fill="#0f3a63"
          opacity="0.35"
        />
        <path
          d="M0 182 C260 150 520 196 780 172 C1040 148 1250 186 1440 164 L1440 240 L0 240 Z"
          fill="#0d3256"
          opacity="0.55"
        />
      </svg>

      {/* Far cow (hidden on small screens) */}
      <img
        src={cow}
        alt=""
        draggable={false}
        className="hidden lg:block absolute left-[44%] bottom-[66px] w-[150px] select-none"
        style={{ opacity: 0.18, filter: glow }}
      />

      {/* Mid cow, facing right */}
      <img
        src={cow}
        alt=""
        draggable={false}
        className="hidden sm:block absolute left-[5%] bottom-[62px] w-[220px] md:w-[300px] select-none"
        style={{ opacity: 0.38, transform: "scaleX(-1)", filter: glow }}
      />

      {/* Hero cow */}
      <img
        src={cow}
        alt=""
        draggable={false}
        className="absolute right-[3%] sm:right-[7%] bottom-[60px] md:bottom-[56px] w-[250px] md:w-[430px] select-none"
        style={{ opacity: 0.6, filter: glow }}
      />

      <Grass />

      {/* Horizon line */}
      <div className="absolute inset-x-0 bottom-[62px] md:bottom-[58px] h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

      {/* Ground band — keeps the legal row readable */}
      <div className="absolute inset-x-0 bottom-0 h-[64px] md:h-[58px] bg-gradient-to-b from-[#0a2744]/80 to-[#071b33]" />
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative bg-[#0b2a4a] text-sky-100 overflow-hidden">
      {/* Wave transition from the section above */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-12 block -mb-px relative z-10"
        aria-hidden="true"
      >
        <path d="M0,32 Q360,72 720,32 T1440,32 L1440,0 L0,0 Z" fill="#ffffff" />
      </svg>

      {/* Ambient glows */}
      <div className="absolute top-24 left-1/4 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12 mb-14">
          {/* Brand / contact */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              aria-label="Vyshnavi Dairy – Home"
              className="inline-flex items-center bg-white rounded-xl px-4 py-2.5 mb-6 shadow-lg shadow-black/20"
            >
              <img src={logo} alt="Vyshnavi Dairy" className="h-10 w-auto" />
            </Link>

            <p className="text-sky-100/70 text-sm leading-relaxed max-w-sm mb-7">
              For over 25 years, Sri Vyshnavi Foods Pvt. Ltd. has combined
              modern automated machinery, strict lab testing, and family care to
              bring delicious, unadulterated dairy to every home at an
              affordable price.
            </p>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <IconTile>
                  <MapPin className="w-4 h-4" />
                </IconTile>
                <div className="space-y-3 leading-relaxed">
                  {addresses.map(({ title, text, map }) => (
                    <a
                      key={title}
                      href={map}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${title} in Google Maps`}
                      className="group block"
                    >
                      <span className="block text-white font-semibold group-hover:text-cyan-300 transition-colors">
                        {title}
                      </span>
                      <span className="block text-sky-100/80 group-hover:text-cyan-300 transition-colors">
                        {text}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconTile>
                  <Phone className="w-4 h-4" />
                </IconTile>
                <div className="flex flex-col gap-1 pt-1">
                  {phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className={contactLinkCls}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconTile>
                  <Mail className="w-4 h-4" />
                </IconTile>
                <div className="flex flex-col gap-1 pt-1">
                  {emails.map((m) => (
                    <a key={m} href={`mailto:${m}`} className={contactLinkCls}>
                      {m}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <Heading>Products</Heading>
            <ul className="space-y-3 text-[15px]">
              {productLinks.map(({ label, key }) => (
                <li key={label}>
                  <Link to={categoryPath(key)} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <Heading>Quick Links & Enquiries</Heading>
            <ul className="space-y-3 text-[15px]">
              {quickLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={linkCls}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions + newsletter + socials */}
          <div className="lg:col-span-3">
            <Heading>Regions We Serve</Heading>
            <div className="flex flex-wrap gap-2 mb-9">
              {["Hyderabad", "Khammam", "Kothagudem", "Warangal", "Karimnagar"].map(
                (city) => (
                  <span
                    key={city}
                    className="text-xs text-sky-100/85 border border-sky-200/20 bg-white/5 rounded-full px-3 py-1"
                  >
                    {city}
                  </span>
                )
              )}
            </div>

            <Heading>Newsletter</Heading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex items-center border border-sky-200/25 bg-white/5 focus-within:border-cyan-300/70 focus-within:bg-white/10 transition-colors mb-6"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your e-mail"
                className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-sky-100/50 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="self-stretch px-4 bg-blue-600 text-white hover:bg-cyan-500 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="inline-flex border border-sky-200/25 divide-x divide-sky-200/25">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 hover:text-cyan-300 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <FreshnessJourney />
      </div>

      {/* Pasture scene + legal row */}
      <div className="relative z-10 mt-6 h-[300px] md:h-[360px]">
        <PastureScene />
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-100/80">
          <p className="text-center sm:text-left">
            <span className="text-cyan-300 font-semibold">
              ISO 22000:2018 Certified
            </span>{" "}
            • Copyright © 2026 Sri Vyshnavi Foods Pvt. Ltd. All rights reserved.
          </p>
          <a
            href="https://elite8digital.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
          >
            Built with ❤️ by Elite8 Digital
            <img
              src="/elite8digital-nav.png"
              alt="Elite8 Digital Logo"
              className="h-7"
            />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes ffGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.06); }
        }
        .ff-glow { animation: ffGlow 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ff-glow { animation: none; }
        }
      `}</style>
    </footer>
  );
}