import { Link } from "react-router-dom";
import { BirdsDoodle, SunDoodle } from "./Shared";

export default function BulkOrderBanner() {
  return (
    <section className="relative px-6 pb-24 pt-10 text-center font-body">
      <SunDoodle className="absolute right-[8%] top-6 hidden h-24 w-24 md:block" />
      <BirdsDoodle className="absolute bottom-10 left-[8%] hidden h-10 w-24 md:block" />
      <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight tracking-[0.06em] text-[#1B2430] sm:text-4xl">
        BUYING FOR A SHOP, CATERER OR A BIG FAMILY?
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-[#5B6672]">
        Tell us what you need. We'll quote fair, steady prices on our lab-tested milk, curd and ghee.
      </p>
      <Link
        to="/contact-us"
        className="mt-10 inline-block rounded-2xl border-2 border-[#1B2430] bg-white px-9 py-4 text-lg font-semibold text-[#1B2430] transition-colors hover:bg-[#1B2430] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B2430]"
      >
        Ask about bulk orders
      </Link>
    </section>
  );
}