import { Section, SectionHeader } from './section'
import { Reveal } from './reveal'
import { HangingProfile } from './hanging-profile'
import { WorkGallery } from './work-gallery'
import { capabilities, process, research, site } from '@/lib/content'

export function About() {
  return (
    <Section id="about" className="border-t border-hairline">
      <SectionHeader
        index="001"
        title="About"
        lead={
          <>
            My strength is not simply producing maps. It is using{' '}
            <em className="font-serif italic text-primary">spatial</em> and{' '}
            <em className="font-serif italic text-primary">non-spatial</em> data to understand
            problems and generate insight.
          </>
        }
      />

      <div className="mt-10 grid items-start gap-10 border-t border-hairline pt-10 lg:grid-cols-[1.4fr_auto] lg:gap-16">
        <Reveal delay={120}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <p className="display text-[clamp(24px,3.2vw,40px)] text-primary">
              Technical analysis,
              <br />
              strategic judgement.
            </p>
            <p className="text-[17px] font-light leading-relaxed text-secondary">
              I combine urban and regional planning, GIS, spatial analysis, data analytics, research
              and applied problem solving. I am interested in work where the spatial pattern matters,
              the data is imperfect, and the answer needs to be communicated clearly enough to
              support action.
            </p>
          </div>
        </Reveal>

        <Reveal delay={220} className="flex flex-col items-center">
          <HangingProfile />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-secondary">
            Drag me
          </p>
        </Reveal>
      </div>
    </Section>
  )
}

export function Process() {
  return (
    <Section id="process" className="border-t border-hairline">
      <SectionHeader
        index="002"
        title="Process"
        lead="Six moves, from an unclear problem to advice someone can act on."
      />

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {process.map((step, i) => (
          <Reveal key={step.n} delay={i * 60}>
            <div className="h-full bg-background p-6 md:p-7 transition-colors duration-300 hover:bg-elevated">
              <span className="font-mono text-[11px] tracking-[0.28em] text-secondary">
                {step.n}
              </span>
              <h3 className="display mt-6 text-[26px] text-primary">{step.title}</h3>
              <p className="mt-3 text-[15px] font-normal leading-relaxed text-secondary">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Work() {
  return (
    // Not <Section>: the gallery is full-bleed, so only the header is shelled.
    <section id="work" className="border-t border-hairline py-14 md:py-20">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <SectionHeader
          index="003"
          title="Selected Work"
          lead={
            <>
              Case studies across GIS, spatial analysis, data integrity, planning evidence, climate
              resilience and{' '}
              <em className="font-serif italic text-primary">business intelligence</em>.
            </>
          }
        />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
          Scroll sideways &middot; select a project to read the full case
        </p>
      </div>

      <WorkGallery />
    </section>
  )
}

export function Capabilities() {
  return (
    <Section id="capabilities" className="border-t border-hairline">
      <SectionHeader
        index="005"
        title="Capabilities"
        lead="The technical and strategic ground the work stands on."
      />

      <div className="mt-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((group, i) => (
          <Reveal key={group.group} delay={i * 80}>
            <div className="border-t border-hairline pt-6">
              <h3 className="display text-[22px] text-primary">{group.group}</h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[15px] font-normal text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Research() {
  return (
    <Section id="research" className="border-t border-hairline">
      <SectionHeader
        index="006"
        title="Research"
        lead="Peer-reviewed work in urban climate, greening, land surface temperature, land-use change, remote sensing and spatial analytics."
      />

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
        {research.map((paper, i) => (
          <Reveal key={paper.title} delay={i * 60}>
            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex h-full flex-col bg-background p-6 md:p-7 transition-colors duration-300 hover:bg-elevated"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[18px] font-semibold leading-snug text-primary">
                  {paper.title}
                </h3>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.16em] text-secondary">
                  {paper.year}
                </span>
              </div>
              <p className="mt-4 flex-1 text-[15px] font-normal leading-relaxed text-secondary">
                {paper.body}
              </p>
              <p className="mt-5 font-serif text-[13px] italic text-secondary">{paper.journal}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
                View article
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &#8599;
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Contact() {
  return (
    <Section id="contact" className="border-t border-hairline">
      <Reveal>
        <p className="eyebrow">[007]</p>
        <h2 className="display mt-5 text-[clamp(38px,8vw,96px)] text-primary">
          Have a spatial
          <br />
          problem worth
          <br />
          exploring?
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="pill bg-primary text-background hover:bg-primary/85"
          >
            {site.email}
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="pill border border-hairline text-primary hover:border-primary"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="pill border border-hairline text-primary hover:border-primary"
          >
            LinkedIn
          </a>
        </div>
      </Reveal>

      <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-8 text-[12px] uppercase tracking-[0.2em] text-secondary sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} {site.name}</span>
        <span className="font-mono normal-case tracking-normal">
          GIS &middot; Spatial Analysis &middot; Urban Planning
        </span>
      </div>
    </Section>
  )
}
