import { EventBrowsingSection } from "@/components/EventBrowsingSection";
import { EventDiscoverySection } from "@/components/EventDiscoverySection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";

function Homepage() {
  return (
    <div className="bg-[#fbf7f4]">
      <Navbar />
      <HeroSection />
      <EventBrowsingSection />
      <EventDiscoverySection />
      <Footer />
    </div>
  );
}

export default Homepage;
