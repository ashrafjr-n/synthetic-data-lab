import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import HeroSection from "../components/hero/HeroSection.jsx";
import FeaturesShowcase from "../components/home/FeaturesShowcase.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";
import CtaBlock from "../components/home/CtaBlock.jsx";
import { SectionTransition } from "../components/layout/SectionTransition.jsx";
import { ScrollProgress } from "../components/layout/ScrollProgress.jsx";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollProgress />
      <main className="flex-1">
        <div className="container-app py-2">

          <section id="hero" style={{ paddingBottom: "128px" }}>
            <SectionTransition direction="up">
              <HeroSection />
            </SectionTransition>
          </section>

          <section id="features" style={{ paddingBottom: "0" }}>
            <SectionTransition direction="fade" delay={0.05}>
              <FeaturesShowcase />
            </SectionTransition>
          </section>

          <section id="how" style={{ paddingTop: "128px", paddingBottom: "88px" }}>
            <SectionTransition direction="up" delay={0.05}>
              <HowItWorks />
            </SectionTransition>
          </section>

          <section id="cta" style={{ paddingBottom: "60px" }}>
            <SectionTransition direction="up" delay={0.05}>
              <CtaBlock />
            </SectionTransition>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;