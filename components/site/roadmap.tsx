import { Section, SectionHeader } from './section'
import { Reveal } from './reveal'
import { roadmap } from '@/lib/content'

/**
 * Vertical timeline: a continuous rule with year cards hanging off it.
 *
 * The card is a two-column grid so the year and its tags occupy the left rail
 * and the prose fills the rest. A single centred column left ~400px of the card
 * empty on desktop, which is what made the section look unfinished.
 */
export function Roadmap() {
  return (
    <Section id="roadmap" className="border-t border-hairline">
      <SectionHeader
        index="004"
        title="Roadmap"
        lead="The arc of the work — how the research, the tooling and the kinds of decisions I support have changed over time."
      />

      <div className="relative mt-12 pl-8 md:pl-16">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-2 h-full w-px bg-hairline md:left-4"
        />

        <ol className="space-y-5">
          {roadmap.map((entry, i) => (
            <li key={entry.year}>
              <Reveal delay={i * 60}>
                <div className="relative">
                  {/* node on the spine */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-9 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:-left-12"
                  />

                  <div className="group relative overflow-hidden rounded-xl border border-hairline transition-colors duration-300 hover:bg-elevated">
                    <div className="grid gap-4 p-6 md:grid-cols-[180px_1fr] md:gap-10 md:p-8">
                      <div className="md:border-r md:border-hairline md:pr-8">
                        <p className="font-serif text-[40px] italic leading-none text-primary">
                          {entry.year}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-secondary"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="self-center text-[16px] font-normal leading-relaxed text-secondary">
                        {entry.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
