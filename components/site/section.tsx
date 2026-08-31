import type { ReactNode } from 'react'
import { Reveal } from './reveal'

/** Numbered section header: [001] + heavy uppercase title + optional lead. */
export function SectionHeader({
  index,
  title,
  lead,
}: {
  index: string
  title: string
  lead?: ReactNode
}) {
  return (
    <Reveal>
      <p className="eyebrow">[{index}]</p>
      <h2 className="display mt-4 text-[clamp(34px,6vw,68px)] text-primary">{title}</h2>
      {lead ? (
        <p className="mt-5 max-w-3xl text-[17px] font-light leading-relaxed text-secondary">
          {lead}
        </p>
      ) : null}
    </Reveal>
  )
}

export function Section({
  id,
  children,
  className = '',
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    // Anchor offset comes from `scroll-padding-top` on <html> in globals.css.
    // Adding scroll-margin here too would stack the two offsets.
    <section id={id} className={`px-6 py-14 md:px-10 md:py-20 ${className}`}>
      <div className="mx-auto max-w-shell">{children}</div>
    </section>
  )
}
