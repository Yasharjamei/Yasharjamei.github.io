import { Section, SectionHeader } from './section'
import { Reveal } from './reveal'
import { roadmap } from '@/lib/content'

/** Vertical timeline: a continuous rule with year cards hanging off it. */
export function Roadmap() {
  return (
    <Section id="roadmap" className="border-t border-hairline">
      <SectionHeader
        index="005"
        title="Roadmap"
        lead="The arc of the work â€” how the research, the tooling and the kinds of decisions I support have changed over time."
      />

      <div className="relative mt-12 pl-8 md:pl-16">
        {/* the spine */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-2 h-full w-px bg-hairline md:left-4"
        />

        <ol className="space-y-6">
          {roadmap.map((entry, i) => (
            <li key={entry.year}>
              <Reveal delay={i * 70}>
                <div className="relative">
                  {/* node on the spine */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-8 top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:-left-12"
                  />
                  <div className="relative overflow-hidden rounded-xl border border-hairline p-6 md:p-7 transition-colors duration-300 hover:bg-elevated">
                    {/* oversized ghost year */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-6 right-4 select-none font-serif text-[110px] italic leading-none text-primary/[0.05]"
                    >
                      {entry.year}
                    </span>

                    <p className="font-serif text-[34px] italic leading-none text-primary">
                      {entry.year}
                    </p>
                    <p className="mt-5 max-w-2xl text-[16px] font-normal leading-relaxed text-secondary">
                      {entry.body}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
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
