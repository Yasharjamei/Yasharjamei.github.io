import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Roadmap } from "@/components/site/roadmap";
import {
  About,
  Capabilities,
  Contact,
  Process,
  Research,
  Work,
} from "@/components/site/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Process />
        <Work />
        <Roadmap />
        <Capabilities />
        <Research />
        <Contact />
      </main>
    </>
  );
}
