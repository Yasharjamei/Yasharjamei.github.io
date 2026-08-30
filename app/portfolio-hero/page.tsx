import { Inter } from "next/font/google";
import { EntropyField } from "@/components/ui/entropy-field";
import "./portfolio-hero.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Hero preview — entropy field",
};

export default function PortfolioHeroPreview() {
  return (
    <div className={`pf ${inter.className}`}>
      <header className="nav">
        <div className="mark">Yashar Jamei</div>
        <nav className="navlinks" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#research">Research</a>
          <a href="#about">About</a>
          <a href="#contact" className="talk">
            Let&rsquo;s talk
          </a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <div className="kicker">GIS / Spatial Intelligence / Strategic Planning</div>
          <h1>Turning spatial data into strategic insight.</h1>
          <p className="lead">
            I work across GIS, spatial analysis, data and urban planning to understand complex
            places, reveal patterns and support better decisions. My work connects technical
            analysis with strategic thinking.
          </p>
          <div className="hero-actions">
            <a className="btn fill" href="#work">
              Explore work
            </a>
            <a className="btn" href="#how">
              How I work
            </a>
          </div>
        </div>

        <div className="spatial-stage">
          <div className="gridlines" />
          <div className="field">
            <EntropyField
              orderColor="#202825"
              chaosColor="#b36d4d"
              lineColor="#171717"
              spacing={24}
              neighborRadius={90}
              linkRadius={48}
            />
          </div>
          <div className="stage-caption">
            <b>Structure on the left. Noise on the right.</b>
            <span>
              Spatial intelligence is the work of holding both &mdash; and finding where the
              pattern survives.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
