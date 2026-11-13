import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
// import ProductCategories from "@/components/home/ProductCategories";
import HorizontalProductScroll from "@/components/home/HorizontalProductScroll";
// import OurStory from "@/components/home/OurStory";
import Stats from "@/components/home/Stats";
import VideoSection from "@/components/home/VideoSection";
import HappyFolks from "@/components/home/HappyFolks";
import BulkOrderBanner from "@/components/home/BulkOrderBanner";
import { CurveDivider, SKY} from "@/components/home/Shared";
// import TrustCards from "@/components/home/TrustCards";
import InstaReelsGrid from "@/components/home/InstaReels";
import DairyProductShowcase from "@/components/home/DairyProductShowcase";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      {/* <TrustCards /> */}

      <DairyProductShowcase />
            <CurveDivider color={SKY} flip/>

      <Stats />
      <CurveDivider color={SKY} />
      <HorizontalProductScroll />
      <CurveDivider color={SKY} flip />

      {/* <ProductCategories /> */}
      {/* <OurStory /> */}

      <InstaReelsGrid/>
      <CurveDivider color={SKY} />
      <div id="process">
        <VideoSection />
      </div>
      <CurveDivider color={SKY} flip />

      <HappyFolks />


      <BulkOrderBanner />
    </main>
  );
};

export default Home;