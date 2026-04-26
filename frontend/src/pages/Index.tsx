import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { NextGames } from "@/components/NextGames";
import { Achievements } from "@/components/Achievements";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <NextGames />
        <Achievements />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
