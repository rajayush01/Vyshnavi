import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/vyshnaviData";
import { underlineLink } from "./Shared";

const DOTS = ["#B9C3EE", "#9FD3EA", "#C9B8E8", "#BFE3D0", "#A9CDEB"];

export default function ProductCategories() {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="bg-white px-6 pb-16 pt-16 font-body md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl tracking-[0.08em] text-[#1B2430] md:text-5xl">OUR PRODUCTS</h2>
          <Link to="/portfolio" className={`text-lg ${underlineLink}`}>See All</Link>
        </div>

        <div
          ref={rail}
          className="mt-12 flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category, i) => {
            const image = category.items.find((it) => it.image)?.image;
            const count = category.items.length;
            return (
              <Link
                key={category.key}
                to={category.key === "ghee" ? "/ghee" : "/portfolio"}
                className="group shrink-0 basis-1/2 snap-start px-4 text-center md:basis-1/4"
              >
                <div className="relative mx-auto flex h-48 items-end justify-center">
                  <span
                    className="absolute right-[18%] top-2 h-3.5 w-4 rounded-[60%_40%_60%_40%]"
                    style={{ background: DOTS[i % DOTS.length] }}
                  />
                  {image ? (
                    <img
                      src={image}
                      alt={category.name}
                      draggable={false}
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      className="h-36 w-36 rounded-[55%_45%_50%_50%]"
                      style={{ background: DOTS[i % DOTS.length], opacity: 0.5 }}
                    />
                  )}
                </div>
                <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1B2430]">
                  {category.name}
                </p>
                <p className={`mt-3 inline-block ${underlineLink}`}>
                  {count} {count === 1 ? "Variant" : "Variants"}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center gap-6">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              aria-label={dir === -1 ? "Previous products" : "Next products"}
              className="flex h-14 w-16 items-center justify-center rounded-2xl bg-white text-[#1B2430] shadow-[0_10px_26px_-10px_rgba(47,111,163,0.45)] transition-colors hover:bg-[#E0F2FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6FA3]"
            >
              {dir === -1 ? <ChevronLeft /> : <ChevronRight />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}