import { EntropyField } from '@/components/ui/entropy-field'
import { Reveal } from './reveal'
import { site } from '@/lib/content'

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] px-6 pb-20 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">{site.role}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display mt-7 text-[clamp(48px,9vw,112px)] text-primary">
              Spatial
              <br />
              Intelligence
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-[20px] leading-snug text-primary md:text-[24px]">
              Turning spatial data into{' '}
              <em className="font-serif italic text-primary">strategic insight</em>.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-5 max-w-xl text-[17px] font-light leading-relaxed text-secondary">
              I work across GIS, spatial analysis, data and urban planning to understand complex
              places, reveal patterns and support better decisions. My work connects{' '}
              <strong className="font-semibold text-primary">technical analysis</strong> with{' '}
              <strong className="font-semibold text-primary">strategic thinking</strong>.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#work" className="pill bg-primary text-background hover:bg-primary/85">
                Explore work
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#process"
                className="pill border border-hairline text-primary hover:border-primary"
              >
                How I work
              </a>
            </div>
          </Reveal>
        </div>

        {/* Order dissolving into chaos — the subject matter, not decoration. */}
        <Reveal delay={200}>
          <div className="relative">
            <div className="relative h-[380px] overflow-hidden rounded-2xl border border-hairline bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))] md:h-[560px]">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px)',
                  backgroundSize: '42px 42px',
                }}
              />
              {/* Colours omitted on purpose: the field reads theme tokens. */}
              <EntropyField spacing={24} neighborRadius={90} linkRadius={48} />
              <div className="absolute inset-x-5 bottom-5 rounded-xl border border-hairline bg-background/70 p-4 backdrop-blur-md">
                <p className="text-[13px] font-semibold text-primary">
                  Structure on the left. Noise on the right.
                </p>
                <p className="mt-1 text-[13px] font-light leading-relaxed text-secondary">
                  Spatial intelligence is the work of holding both &mdash; and finding where the
                  pattern survives.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Vertical scroll cue */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        <span className="h-16 w-px bg-gradient-to-b from-transparent to-hairline" />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>
    </section>
  )
}
