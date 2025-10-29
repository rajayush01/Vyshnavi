import { useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import WelcomeText from "@/components/home/WelcomeText";
import VideoSection from "@/components/home/VideoSection";
import InstaReels from "@/components/home/InstaReels";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import SnakeDivider from "@/components/home/SnakeDivider";
import WhyMe from "@/components/home/WhyMe";
import Compare from "@/components/home/Compare";
import Blogs from "@/components/home/Blogs";
import AlsoAvailableSection from "@/components/home/Available";
import HorizontalProductScroll from "@/components/home/HorizontalProductScroll";
import DairyProductShowcase from "@/components/home/DairyProductShowcase";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
} as const;

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.8,
    },
  },
} as const;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.8,
    },
  },
} as const;

const SectionWrapper = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={sectionVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="overflow-hidden bg-white"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Hero Section */}
        <motion.div id="hero-section" variants={fadeIn}>
          <HeroSection />
        </motion.div>

        <SectionWrapper>
          <WelcomeText />
        </SectionWrapper>

        <SnakeDivider color="#e0f2fe" />

        <SectionWrapper>
                    <HorizontalProductScroll />
        </SectionWrapper>

        <SnakeDivider className="transform rotate-180" color="#e0f2fe" />

        {/* <SnakeDivider color='#f1f5f9'/> */}

        <SectionWrapper>
          <WhyMe />
        </SectionWrapper>


        <DairyProductShowcase/>

        <SnakeDivider color="#e0f2fe" />
        <SectionWrapper>
          <VideoSection />
        </SectionWrapper>

        <SnakeDivider className="transform rotate-180" color="#e0f2fe" />

        <SectionWrapper>
          <Compare />
        </SectionWrapper>

        <SnakeDivider color="#e0f2fe" />

        <SectionWrapper>
          <InstaReels />
        </SectionWrapper>
        <SnakeDivider className="transform rotate-180 mt-44" color="#e0f2fe" />

        <SectionWrapper>
          <TestimonialCarousel />
        </SectionWrapper>

        <SnakeDivider color="#e0f2fe" />

        <SectionWrapper>
          <AlsoAvailableSection />
        </SectionWrapper>
		        <SnakeDivider className="transform rotate-180" color="#e0f2fe" />


        <SectionWrapper>
          <Blogs />
        </SectionWrapper>

        {/* <SnakeDivider color='#f1f5f9'/> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
