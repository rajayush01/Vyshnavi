import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ProductCategories from "@/components/home/ProductCategories";
import HorizontalProductScroll from "@/components/home/HorizontalProductScroll";
// import OurStory from "@/components/home/OurStory";
import Stats from "@/components/home/Stats";
import VideoSection from "@/components/home/VideoSection";
import HappyFolks from "@/components/home/HappyFolks";
import BulkOrderBanner from "@/components/home/BulkOrderBanner";
import { CurveDivider, SKY } from "@/components/home/shared";
import TrustCards from "@/components/home/TrustCards";
import InstaReelsGrid from "@/components/home/InstaReels";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <TrustCards />
      <ProductCategories />

      <CurveDivider color={SKY} />
      <HorizontalProductScroll />
      <CurveDivider color={SKY} flip />

      {/* <OurStory /> */}
      <Stats />

      <CurveDivider color={SKY} />
      <div id="process">
        <VideoSection />
      </div>
      <CurveDivider color={SKY} flip />

      <HappyFolks />

      <InstaReelsGrid/>

      <CurveDivider color={SKY} flip/>
      <BulkOrderBanner />
    </main>
  );
};

export default Home;