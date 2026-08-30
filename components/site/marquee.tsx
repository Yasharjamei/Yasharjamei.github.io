import { marquee } from '@/lib/content'

/**
 * Full-bleed scrolling ticker. The track holds two identical copies and
 * translates by -50%, so the loop is seamless.
 */
export function Marquee() {
  const items = [...marquee, ...marquee]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-hairline py-8 md:py-10"
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display text-[clamp(28px,4.5vw,54px)] text-primary/25">
              {item}
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary/25" />
          </span>
        ))}
      </div>
    </div>
  )
}
