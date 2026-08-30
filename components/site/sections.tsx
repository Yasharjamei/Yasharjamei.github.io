import { Section, SectionHeader } from './section'
import { Reveal } from './reveal'
import { capabilities, process, research, site, work } from '@/lib/content'

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

      <Reveal delay={120}>
        <div className="mt-14 grid gap-10 border-t border-hairline pt-12 md:grid-cols-2 md:gap-16">
          <p className="display text-[clamp(24px,3.2vw,40px)] text-primary">
            Technical analysis,
            <br />
            strategic judgement.
          </p>
          <p className="text-[17px] font-light leading-relaxed text-secondary">
            I combine urban and regional planning, GIS, spatial analysis, data analytics, research
            and applied problem solving. I am interested in work where the spatial pattern matters,
            the data is imperfect, and the answer needs to be communicated clearly enough to support
            action.
          </p>
        </div>
      </Reveal>
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

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {process.map((step, i) => (
          <Reveal key={step.n} delay={i * 60}>
            <div className="h-full bg-background p-8 transition-colors duration-300 hover:bg-[#111111]">
              <span className="font-mono text-[11px] tracking-[0.28em] text-secondary">
                {step.n}
              </span>
              <h3 className="display mt-6 text-[26px] text-primary">{step.title}</h3>
              <p className="mt-3 text-[15px] font-light leading-relaxed text-secondary">
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
    <Section id="work" className="border-t border-hairline">
      <SectionHeader
        index="003"
        title="Selected Work"
        lead={
          <>
            Case studies across GIS, spatial analysis, data integrity, planning evidence, climate
            resilience and <em className="font-serif italic text-primary">business intelligence</em>.
          </>
        }
      />

      <div className="mt-14 border-t border-hairline">
        {work.map((item, i) => (
          <Reveal key={item.title} delay={Math.min(i * 40, 240)}>
            <article className="group grid gap-4 border-b border-hairline py-8 transition-colors duration-300 hover:bg-[#101010] md:grid-cols-[64px_1fr_1.1fr] md:items-baseline md:gap-8 md:px-4">
              <span className="font-mono text-[11px] tracking-[0.24em] text-secondary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="eyebrow">{item.category}</p>
                <h3 className="display mt-3 text-[clamp(22px,2.6vw,32px)] text-primary">
                  {item.title}
                </h3>
              </div>
              <p className="text-[15px] font-light leading-relaxed text-secondary">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Capabilities() {
  return (
    <Section id="capabilities" className="border-t border-hairline">
      <SectionHeader
        index="004"
        title="Capabilities"
        lead="The technical and strategic ground the work stands on."
      />

      <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((group, i) => (
          <Reveal key={group.group} delay={i * 80}>
            <div className="border-t border-hairline pt-6">
              <h3 className="display text-[22px] text-primary">{group.group}</h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[15px] font-light text-secondary transition-colors duration-200 hover:text-primary"
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
        index="005"
        title="Research"
        lead="Peer-reviewed work in urban climate, greening, land surface temperature, land-use change, remote sensing and spatial analytics."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
        {research.map((paper, i) => (
          <Reveal key={paper.title} delay={i * 60}>
            <article className="flex h-full flex-col bg-background p-8 transition-colors duration-300 hover:bg-[#111111]">
              <h3 className="text-[18px] font-semibold leading-snug text-primary">{paper.title}</h3>
              <p className="mt-4 flex-1 text-[15px] font-light leading-relaxed text-secondary">
                {paper.body}
              </p>
            </article>
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
        <p className="eyebrow">[006]</p>
        <h2 className="display mt-5 text-[clamp(38px,8vw,96px)] text-primary">
          Have a spatial
          <br />
          problem worth
          <br />
          exploring?
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 flex flex-wrap items-center gap-4">
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

      <div className="mt-24 flex flex-col gap-3 border-t border-hairline pt-8 text-[12px] uppercase tracking-[0.2em] text-secondary sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} {site.name}</span>
        <span className="font-mono normal-case tracking-normal">
          GIS &middot; Spatial Analysis &middot; Urban Planning
        </span>
      </div>
    </Section>
  )
}
