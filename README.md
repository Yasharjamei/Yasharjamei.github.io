# Yashar Jamei — Spatial Intelligence Portfolio

**Live: [yasharjamei.github.io](https://yasharjamei.github.io/)**

A Next.js + TypeScript + Tailwind portfolio site: ten GIS/spatial case studies,
peer-reviewed research, a career roadmap, light/dark theming, and an
order-to-chaos particle field in the hero.

Published from this repo by GitHub Actions — **every push to `main` redeploys**.

The field is the argument, not decoration. An ordered lattice on the left
dissolving into chaos on the right — structure, noise, and the work of finding
where the pattern survives. For a portfolio about spatial analysis, that is the
subject matter.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

| Route | What it is |
|---|---|
| `/` | The portfolio — hero, about `[001]`, process `[002]`, work `[003]`, roadmap `[004]`, capabilities `[005]`, research `[006]`, play `[007]`, contact `[008]` |
| `/work/<slug>` | Ten statically generated case-study pages, one per project |
| `/entropy` | The original `Entropy` component on black, unmodified — reference implementation |
| `/portfolio-hero` | Early hero-only preview in the old cream palette, kept for comparison |
| `/standalone/portfolio-hero.html` | That cream hero as **plain HTML + vanilla JS**, no React |

> **Do not run `npm run build` while `next dev` is running.** They share `.next`,
> and building against a live dev server corrupts it — `Cannot find module
> './611.js'`, missing vendor chunks, blank pages. Stop dev first, or verify
> against `npx serve out`, which tests the real deployable artifact anyway.

> **Never bulk-edit source with PowerShell `Get-Content`.** On a UTF-8 file with
> no BOM it falls back to the ANSI codepage; write that back as UTF-8 and every
> non-ASCII character corrupts — `—` becomes `â€"`, `·` becomes `Â·`, `Ş` becomes
> `Åž`. This shipped to production once, visible in the Roadmap lead. If a bulk
> edit is unavoidable use `[System.IO.File]::ReadAllText` / `WriteAllText`, which
> default to UTF-8, and grep for `â€`, `Â`, `Ã` before committing.

---

## What's in here

```
app/
  page.tsx                    composes the sections
  layout.tsx                  data-theme, --font-noto, theme-init script, cursor
  globals.css                 theme tokens, display/eyebrow/pill classes, reveal
  work/[slug]/page.tsx        case-study pages (generateStaticParams)
  entropy/page.tsx            original Entropy demo (viewport-locked)
  portfolio-hero/             early cream hero preview
components/site/
  nav.tsx                     fixed nav, scroll-spy, mobile sheet, theme toggle
  hero.tsx                    display type + entropy field
  marquee.tsx                 full-bleed ticker
  section.tsx                 numbered section header + shell
  sections.tsx                about / process / work / capabilities / research / contact
  roadmap.tsx                 vertical timeline
  work-gallery.tsx            horizontal scroll rail of project cards
  vector-arena.tsx            original canvas twin-stick shooter (section 007)
  ambient-geometry.tsx        near-invisible wireframe layer behind the page
  hanging-profile.tsx         draggable pendulum card
  theme-toggle.tsx            light/dark switch + pre-paint init script
  custom-cursor.tsx           trailing ring cursor
  reveal.tsx                  IntersectionObserver fade-in
  lock-viewport.tsx           scopes the supplied viewport lock to /entropy
components/ui/
  entropy.tsx                 the original component, kept faithful
  entropy-demo.tsx            its demo
  entropy-field.tsx           themeable, fills its parent, spatial-hash neighbours
lib/
  content.ts                  ALL site copy — edit here, not in components
  paths.ts                    asset() helper for basePath-aware raw URLs
  utils.ts                    shadcn cn() helper
public/
  projects/<slug>.png         case-study screenshots, keyed by slug
  standalone/                 zero-dependency vanilla port of the field
  .nojekyll                   stops GitHub Pages from eating _next/
scripts/make-zip.ps1          Netlify bundle builder
.github/workflows/deploy.yml  GitHub Pages build + publish
```

**All copy lives in `lib/content.ts`.** Adding a case study means adding an entry
to `work` and dropping a matching `public/projects/<slug>.png` — the filename is
derived from the slug.

---

## Deploying

### GitHub Pages — already set up

The site is live at **https://yasharjamei.github.io/**. To publish a change:

```bash
git push
```

`.github/workflows/deploy.yml` builds and republishes on every push to `main`.
No manual step, no zip. Check a run with `gh run list` or
`gh run watch`.

**Do not rename the repo.** `Yasharjamei.github.io` is a GitHub *user site*,
which requires the repo name to match the account name **exactly** — the
account is `Yasharjamei`, so anything else (including `Yashar.jamei.github.io`)
demotes it to a *project* site served from `/<repo>/` and breaks the bare URL.
The workflow would add the base path automatically, but the address changes.

The repo must stay **public** — Pages on private repos requires a paid plan.

Because a user site has no base path, the build is byte-identical to the Netlify
one; the same `out/` and the same zip serve both.

<details>
<summary>Setting this up again from scratch</summary>

Run these as separate commands — **PowerShell has no `&&` operator**, so chaining
them is a parser error and the first step silently never runs.

```bash
gh auth login
```

```bash
gh repo create Yasharjamei.github.io --public
```

```bash
git push -u origin main
```

Pages may auto-enable itself as `build_type: legacy`, which serves the **repo
root** — there is no `index.html` there, so you get the README or a 404. Force it
to build from Actions, and use `PUT` if it is already enabled:

```bash
gh api -X PUT repos/Yasharjamei/Yasharjamei.github.io/pages -f build_type=workflow
```

Confirm with `gh api repos/Yasharjamei/Yasharjamei.github.io/pages` — you want
`"build_type":"workflow"`.

</details>

#### Two things that silently break Next.js on Pages

**Jekyll eats `_next/`.** Pages runs Jekyll by default, and Jekyll ignores any
directory starting with an underscore — every script and stylesheet 404s and the
page renders as unstyled HTML. `public/.nojekyll` disables it; the file must
reach `out/`, which it does by living in `public/`.

**Project sites are served from a subpath.** At `username.github.io/<repo>`, a
root-absolute `/_next/...` resolves to the domain root and misses.
`next.config.mjs` reads `NEXT_PUBLIC_BASE_PATH`, which the workflow derives from
the repo name — empty for a `*.github.io` repo, `/<repo>` otherwise. `next/link`
and `next/image` apply it automatically; **raw `<img src>` and hand-written URLs
do not**, so those go through `asset()` in `lib/paths.ts`. `trailingSlash: true`
emits `work/<slug>/index.html`, because Pages will not resolve an extensionless
path.

Neither currently bites: `.nojekyll` ships, and `Yasharjamei.github.io` is a user
site serving at the root, so there is no base path. The second only matters if the
repo is ever renamed. To verify a subpath build:

```bash
NEXT_PUBLIC_BASE_PATH=/some-repo npm run build
```

Every `_next` reference in `out/index.html` should carry the prefix and none
should be bare. Last checked against `/portfolio`: 15 prefixed, 0 bare.

### Netlify (drag-and-drop) — optional

Not needed now that Pages is wired up; kept for a quick throwaway preview.

```bash
npm run build
```

```bash
powershell -File scripts/make-zip.ps1
```

Drop `website-design-netlify.zip` onto [app.netlify.com/drop](https://app.netlify.com/drop).
No account needed.

> **Do not use `Compress-Archive`.** Windows PowerShell writes zip entries with
> backslash separators (`_next\static\...`). Netlify unpacks on Linux, which
> treats those as literal filenames rather than folders — the tree flattens and
> every asset 404s. `scripts/make-zip.ps1` writes forward slashes via `ZipArchive`
> and fails loudly if either invariant breaks. To check any zip:
>
> ```powershell
> Add-Type -AssemblyName System.IO.Compression.FileSystem
> $z = [System.IO.Compression.ZipFile]::OpenRead("website-design-netlify.zip")
> @($z.Entries | Where-Object { $_.FullName -like '*\*' }).Count   # must be 0
> $z.Dispose()
> ```

Deployed routes: `/`, `/work/<slug>/`, `/entropy/`, `/portfolio-hero/`, and
`/standalone/portfolio-hero.html`.

---

## Ambient geometry

Seven large wireframe polygons drifting on a fixed layer at `-z-10`, stroked in
`--foreground` at **3.5%** opacity. Opaque cards occlude them, so they only read
in the gaps between content — texture, not decoration.

Two rules keep it from becoming noise:

- **It fades to zero while the hero is on screen.** The entropy field is the
  site's signature generative element; a second particle system competing in the
  same viewport would dilute it. An `IntersectionObserver` on `#home` drives an
  eased fade, verified at 0 painted pixels over the hero and ~23k at the roadmap.
- **It never runs under `prefers-reduced-motion`**, and pauses on tab hide.

No dependency — about 150 lines of canvas. Stroke colour resolves from the theme
token via a `MutationObserver` on `data-theme`.

> The original suggestion was [miurla/morphic](https://github.com/miurla/morphic).
> That project is an AI answer engine built on the Vercel AI SDK — unrelated to
> generative geometry, so it would not have helped here.

## Vector Arena (section 007)

A twin-stick shooter written from scratch in TypeScript on a 2D canvas — no game
engine, no third-party code or assets. WASD to move, mouse to aim, hold to fire.

It sits after Research and before Contact, deliberately: it shows interactive
build capability without competing with the case studies for a hiring manager's
attention.

The loop only runs after the player presses Start, and an `IntersectionObserver`
pauses it when the section scrolls out of view, so it costs nothing to someone
passing by. Colours resolve from theme tokens through `getComputedStyle`, so it
follows the light/dark toggle. Best score goes to `localStorage`, wrapped in
try/catch for private mode.

> **Why not the linked repo.** The original request was to embed
> [Shaptic/Geometry-Wars](https://github.com/Shaptic/Geometry-Wars). That project
> is native C/C++ on SDL, targeting Windows — the repo ships a `vcredist_x86.exe`.
> It is desktop software and cannot run in a page. Its licence is permissive
> (zlib-style, embedding allowed with acknowledgment), so the barrier was purely
> technical: putting it on the web would mean an Emscripten/WebAssembly port of
> 14-year-old SDL 1.2-era code plus ~27 MB of assets, with a low chance of
> success. Building an original one was faster, lighter and carries no
> attribution obligation.

## Design language

Measured off [xkintaro.com](https://www.xkintaro.com/en), the reference site.

| | |
|---|---|
| Background / text | `#0a0a0a` / `#fafafa`, muted `#a1a1a1`, hairline `#1f1f1f` |
| Headings | weight **900**, uppercase, `letter-spacing: -0.045em`, `line-height: 0.85` |
| Body | weight **300**, with *serif italic* and **semibold** emphasis inline |
| Structure | numbered sections `[001]`–`[007]`, full-bleed marquee, pill buttons |
| Motion | scroll-reveal fades, scroll-spy nav, vertical `SCROLL` cue, trailing cursor |

**Light mode is not an inversion.** Dark is the reference language; light restores
the original warm portfolio identity (`--paper #f6f3ee`, `--accent #7b5b3a`). The
toggle moves between two designed palettes, persisted to `localStorage` and applied
by a pre-paint inline script so there is no flash of the wrong one.

The one deviation from pure monochrome: the entropy field's chaotic half stays
`--clay #b36d4d`, carrying a thread of the old warm palette into the dark rebuild.
Order is white, noise is clay.

Canvas cannot read CSS variables, so `EntropyField` and the pendulum resolve theme
tokens via `getComputedStyle` plus a `MutationObserver` on `data-theme`.

---

## Engineering notes

### Environment

Node **v24.19.0**, npm 11.17.0, Python 3.14.5.

> A freshly-spawned shell reported `v18.18.2` while the machine actually had
> v24.19.0 via winget. The installer updates the machine/user PATH, but existing
> shells keep a stale copy. Refresh before trusting a version check:
>
> ```powershell
> $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
> ```

### Scaffold

`create-next-app` **refuses** a folder named `Website design` — npm package names
cannot contain spaces or capitals. Hand-scaffolded instead, which also allowed
pinning **Tailwind v3** deliberately: the supplied `globals.css` uses
`@tailwind base/components/utilities` and a `content` array, both v3. Current
`create-next-app` ships v4 (`@import "tailwindcss"`, no config), which would have
made the supplied CSS inert.

### Three bugs in the supplied `Entropy` snippet

Each one breaks the build.

**Malformed `@apply`**

```css
.footer-link { @apply hover: text-primary; }   /* ✗ parsed as two utilities */
.footer-link { @apply hover:text-primary; }    /* ✓ */
```

**Duplicate export** — `demo.tsx` had both `export function EntropyDemo()` and a
trailing `export { EntropyDemo }`.

**`'ctx' is possibly 'null'`** — `function animate()` is *hoisted*, so TypeScript
discards the `if (!ctx) return` narrowing inside it: a hoisted function could be
called before the guard ran. An arrow function assigned to a `const` is created
after the narrowing, so the narrowing survives:

```ts
const animate = () => { ctx.clearRect(0, 0, size, size) /* ... */ }
```

### Two decisions the supplied code forced

- **`data-theme` on `<html>`.** The CSS defined the four colour variables *only*
  under `:root[data-theme="dark"|"light"]`, never on bare `:root` — without the
  attribute all four are undefined and `body` gets no background. A bare-`:root`
  dark fallback has since been added as a safety net.
- **`--font-noto` had to be defined.** `tailwind.config.ts` maps `font-sans` to
  `var(--font-noto)`, but nothing declared it; now wired via `next/font`.

### The viewport lock had to move

The supplied `globals.css` set `position: fixed; overflow: hidden` on `html, body`,
which makes a scrolling site impossible. Rather than delete it, it ships as a
`.lock-viewport` class that `/entropy` applies to `<html>` — the demo keeps the
original behaviour, the site scrolls.

### Anchor offsets stack

`scroll-padding-top` on the scroller and `scroll-margin-top` on the target are
additive: 88px + 96px landed every section 184px below an 87px nav. Only one of
the two should set the offset.

### `EntropyField` vs `Entropy`

The original is hard-coded black with white particles and a fixed 400px square.
`entropy-field.tsx` was written alongside it, leaving the original untouched:

- **Themeable**, via `rgba()` conversion rather than hex-alpha concatenation, so
  any CSS colour works.
- **Fills its parent** at any aspect ratio, via `ResizeObserver`.
- **Spatial hash for neighbours.** The original is O(n²): 625 particles → ~390k
  distance checks every 30 frames. At hero size that becomes ~1,500 particles and
  ~2.4M checks. Bucketing by neighbour radius and scanning 3×3 cells keeps it
  roughly linear.
- **Honours `prefers-reduced-motion`**, and re-evaluates it live — capturing the
  preference once freezes the field on a single frame permanently.

---

## Content status

The roadmap is drawn from the CV — ten entries from the 2013 Bachelor of Urban
Planning through the 2022 RMIT PhD and into the Melton City Council infrastructure
work, ending on the 2026 JUISS paper.

> **Two dates are inferred.** The CV gives the Melton role as "October 2023 –
> Present" without year-by-year breaks, so the **2024 and 2025** entries are a
> reasonable split of ongoing work rather than stated fact. Everything else is
> taken directly.

All seven publications carry journal and year, supplied directly, ordered newest
first.

Project screenshots add ~3.8 MB to the bundle; converting to WebP would cut most
of that if load time matters.

---

## Known constraints

- **`Entropy` (the original) is not responsive.** `size` is a fixed 400px square;
  at a 375px viewport it overflows, and on `/entropy` the viewport lock clips
  rather than scrolls. `EntropyField` was written to fill its container for
  exactly this reason.
- **The universal `transition-property: opacity`** inherited from the supplied CSS
  applies site-wide. It is specificity 0, so any class-based transition overrides
  it, but it is worth knowing about.
- The horizontal work rail pins only at `≥1024px` and with motion allowed;
  otherwise it degrades to a swipeable row.

---

## Licence and attribution

The `Entropy` component originates from a third-party snippet.

`components/site/hanging-profile.tsx` and `components/site/custom-cursor.tsx` are
adapted from [xkintaro/kintarowwwards](https://github.com/xkintaro/kintarowwwards),
used under the MIT Licence:

```
MIT License
Copyright (c) 2026 Mustafa TAŞAL (kintaro)
```

Both were reworked for this site's tokens and reimplemented without
framer-motion. No content, imagery or copy from that project is used here.

The portfolio, its content, the vanilla port and the entropy field adaptation are
mine.
