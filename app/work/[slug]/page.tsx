import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { work, site } from "@/lib/content";
import { asset } from "@/lib/paths";
import { Reveal } from "@/components/site/reveal";
import { ThemeToggle } from "@/components/site/theme-toggle";

export function generateStaticParams() {
  return work.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = work.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  };
}

const FIELDS = [
  { key: "context", label: "Context" },
  { key: "challenge", label: "The Challenge" },
  { key: "data", label: "Data" },
  { key: "approach", label: "Approach" },
  { key: "outputs", label: "Outputs" },
] as const;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = work.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = work[index];
  const next = work[(index + 1) % work.length];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="text-[15px] font-black uppercase tracking-[0.14em] text-primary">
            {site.mark}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/#work"
              className="text-[11px] uppercase tracking-[0.22em] text-secondary transition-colors hover:text-primary"
            >
              &larr; All work
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <Reveal>
          <p className="eyebrow">
            [{String(index + 1).padStart(3, "0")}] &middot; {project.category}
          </p>
          <h1 className="display mt-6 text-[clamp(38px,7vw,84px)] text-primary">
            {project.title}
          </h1>
          <p className="mt-7 max-w-3xl text-[19px] font-light leading-relaxed text-secondary">
            {project.summary}
          </p>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="pill mt-8 bg-primary text-background hover:bg-primary/85"
            >
              Open live project
              <span aria-hidden="true">&#8599;</span>
            </a>
          ) : null}
        </Reveal>

        <Reveal delay={100}>
          <figure className="mt-14 overflow-hidden rounded-2xl border border-hairline bg-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(`/projects/${project.slug}.png`)}
              alt={`${project.title} — dashboard screenshot`}
              className="w-full"
            />
          </figure>
        </Reveal>

        {/* Key insight, pulled up as the headline takeaway. */}
        <Reveal delay={120}>
          <blockquote className="mt-16 border-l-2 border-accent pl-6 md:pl-8">
            <p className="font-serif text-[clamp(20px,2.6vw,30px)] italic leading-snug text-primary">
              {project.insight}
            </p>
            <cite className="eyebrow mt-4 block not-italic">Key insight</cite>
          </blockquote>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div className="space-y-12">
            {FIELDS.map((field, i) => (
              <Reveal key={field.key} delay={i * 60}>
                <section className="border-t border-hairline pt-7">
                  <h2 className="eyebrow">{field.label}</h2>
                  <p className="mt-4 text-[17px] font-light leading-relaxed text-secondary">
                    {project[field.key]}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>

          <aside className="space-y-12 lg:sticky lg:top-32 lg:self-start">
            <Reveal delay={80}>
              <section className="border-t border-hairline pt-7">
                <h2 className="eyebrow">Methodology</h2>
                <ol className="mt-5 space-y-3">
                  {project.methodology.map((step, i) => (
                    <li key={step} className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-secondary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] text-primary">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>

            <Reveal delay={140}>
              <section className="border-t border-hairline pt-7">
                <h2 className="eyebrow">Tools</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          </aside>
        </div>

        <Reveal>
          <Link
            href={`/work/${next.slug}`}
            className="group mt-20 flex flex-col gap-3 border-t border-hairline pt-8 transition-colors hover:bg-elevated md:flex-row md:items-end md:justify-between"
          >
            <div>
              <span className="eyebrow">Next project</span>
              <p className="display mt-4 text-[clamp(26px,4vw,46px)] text-primary">{next.title}</p>
            </div>
            <span className="text-[15px] font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </Reveal>
      </main>
    </>
  );
}
