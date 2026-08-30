# Website Design — Entropy Field

A Next.js + TypeScript + Tailwind + shadcn workspace built around the **Entropy**
particle component, plus a restyled adaptation for
[jamayamaj.netlify.app](https://jamayamaj.netlify.app) — my spatial-intelligence portfolio.

The idea: an ordered lattice on the left dissolving into chaos on the right.
For a portfolio about GIS and spatial analysis, that is not decoration — it is
the subject matter. Structure, noise, and the work of finding where the pattern
survives.

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
| `/` | The original `Entropy` component on black — the reference implementation |
| `/portfolio-hero` | My portfolio hero, restyled, with the entropy field replacing the CSS polygons |
| `/standalone/portfolio-hero.html` | The same hero as **plain HTML + vanilla JS**, no React |

---

## What's in here

```
app/
  page.tsx                      original Entropy demo (black theme)
  layout.tsx                    sets data-theme="dark", wires --font-noto
  globals.css                   provided theme CSS
  portfolio-hero/
    page.tsx                    portfolio hero preview
    portfolio-hero.css          design tokens lifted from the live site
components/ui/
  entropy.tsx                   the original component, kept faithful
  entropy-demo.tsx              its demo
  entropy-field.tsx             themeable, fills its parent, spatial-hash neighbours
public/standalone/
  entropy-field.js              zero-dependency port for plain HTML sites
  portfolio-hero.html           self-contained demo of the above
lib/utils.ts                    shadcn `cn()` helper
```

---

## The steps, in order

### 1. Environment

Node.js **v24.19.0**, npm 11.17.0, Python 3.14.5.

> **Gotcha worth recording:** a freshly-spawned shell reported `v18.18.2` while the
> machine actually had v24.19.0 installed via winget. The winget install updates the
> machine/user PATH, but existing shells keep a stale copy. Refresh it before
> trusting a version check:
>
> ```powershell
> $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
> ```

### 2. UI/UX Pro Max skill

Installed globally so it applies across projects:

```bash
npx --yes ui-ux-pro-max-cli@latest init --ai claude --global
```

This lands 7 skills in `~/.claude/skills/`: `ui-ux-pro-max`, `design-system`,
`ui-styling`, `brand`, `banner-design`, `slides`, `design`. Its search backend is a
Python script — the domain is a **flag**, not a positional argument:

```bash
python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
```

The marketplace route (`/plugin marketplace add ...`) was skipped: this repo has a
documented symlink bug in the packaged zip, and the CLI installer is the maintainer's
recommended path.

### 3. Project scaffold

`create-next-app` **refuses** a folder named `Website design` — npm package names
cannot contain spaces or capitals. The project was hand-scaffolded instead, which
also allowed pinning the right Tailwind major.

**Tailwind v3, deliberately.** The supplied `globals.css` uses
`@tailwind base/components/utilities` and the config uses a `content` array — both
v3. Current `create-next-app` ships v4 (`@import "tailwindcss"`, no config file),
which would have made the supplied CSS inert.

### 4. Integrating `Entropy`

The component went into `components/ui/` — the path `components.json` declares as
the `ui` alias, and the path the demo imports from (`@/components/ui/entropy`).
Every `npx shadcn@latest add ...` component lands there too, so a different folder
would break both.

Three bugs in the supplied code had to be fixed; each one breaks the build.

**1. Malformed `@apply`**

```css
.footer-link { @apply hover: text-primary; }   /* ✗ parsed as two utilities */
.footer-link { @apply hover:text-primary; }    /* ✓ */
```

**2. Duplicate export** — `demo.tsx` had both `export function EntropyDemo()` and a
trailing `export { EntropyDemo }`. That is a duplicate-export syntax error.

**3. `'ctx' is possibly 'null'`** — confirmed by a failing build:

```
./components/ui/entropy.tsx:137:7
Type error: 'ctx' is possibly 'null'.
```

`function animate()` is *hoisted*, so TypeScript discards the `if (!ctx) return`
narrowing inside it — a hoisted function could be called before the guard ran.
An arrow function assigned to a `const` is created after the narrowing, so the
narrowing survives:

```ts
const animate = () => { ctx.clearRect(0, 0, size, size) /* ... */ }
```

**Two decisions the supplied code forced:**

- `data-theme="dark"` on `<html>`. The CSS defines `--background`, `--foreground`,
  `--text-primary` and `--text-secondary` **only** under
  `:root[data-theme="dark"|"light"]` — never on bare `:root`. Without the attribute
  all four are undefined and `body` gets no background at all.
- `--font-noto` had to be defined. `tailwind.config.ts` maps `font-sans` to
  `var(--font-noto)`, but nothing declared it; it is now wired via `next/font`.

### 5. Adapting it to the portfolio

The live site turned out to be a **single self-contained ~10.5 MB HTML file** —
vanilla HTML/CSS with one 5.25 MB inline script, no React, no build step. So the
React component cannot be dropped in as-is.

Its palette, read from the live CSS:

| Token | Value | |
|---|---|---|
| `--paper` | `#f6f3ee` | background |
| `--ink` | `#171717` | body text |
| `--line` | `#ded8ce` | borders |
| `--accent` | `#7b5b3a` | kickers |
| `--clay` | `#b36d4d` | accent points |
| `--deep` | `#202825` | dark elements |

The original `Entropy` is hard-coded black with white particles — it would fight a
warm cream editorial design. So `entropy-field.tsx` was written alongside it,
leaving the original untouched:

- **Themeable** — ordered particles in `--deep`, chaotic in `--clay`, links in `--ink`.
  Colours go through an `rgba()` helper rather than hex-alpha concatenation, so any
  CSS colour works.
- **Fills its parent** at any aspect ratio, via `ResizeObserver` — the original is a
  fixed square.
- **Spatial hash for neighbours.** The original is O(n²): 625 particles → ~390k
  distance checks every 30 frames. At hero size that becomes ~1,500 particles and
  ~2.4M checks. Bucketing by neighbour radius and scanning 3×3 cells keeps it linear.
- **Honours `prefers-reduced-motion`**, painting one static frame — and re-evaluates
  live, because capturing the preference once freezes the field permanently.

`public/standalone/entropy-field.js` is a zero-dependency port of the same
simulation for the plain-HTML site.

---

## Dropping it into the live site

In the portfolio's HTML, the hero's right panel is `.spatial-stage`, currently three
CSS-animated `.layer` polygons and four pulsing `.point` dots. Replace its interior:

```html
<div class="spatial-stage">
  <div class="gridlines"></div>

  <div class="entropy-field"
       data-entropy-field
       data-order-color="#202825"
       data-chaos-color="#b36d4d"
       data-line-color="#171717"
       data-spacing="24"></div>

  <div class="stage-caption">
    <b>Structure on the left. Noise on the right.</b>
    <span>Spatial intelligence is the work of holding both.</span>
  </div>
</div>
```

Add the positioning rule, then the script before `</body>`:

```css
.entropy-field { position: absolute; inset: 0; }
```

Delete the now-unused `.layer` / `.point` rules and their `@keyframes float` and
`@keyframes pulse`. The `.gridlines` rotation (`transform: rotate(-7deg) scale(1.2)`)
is worth dropping too — the particle lattice reads better against a square grid.

### Options

| Attribute | Default | |
|---|---|---|
| `data-order-color` | `#202825` | ordered (left) particles |
| `data-chaos-color` | `#b36d4d` | chaotic (right) particles |
| `data-line-color` | `#171717` | links and centre divider |
| `data-spacing` | `24` | px between particles |
| `data-neighbor-radius` | `90` | px interaction radius |
| `data-link-radius` | `48` | px line-drawing radius |
| `data-dot-size` | `1.6` | particle radius |
| `data-divider` | `true` | draw the centre divider |

---

## Deploying to Netlify

The project is configured for static export (`output: "export"` in
`next.config.mjs`), so it builds to a plain folder with no server runtime.

```bash
npm run build
```

That writes `out/`. To produce the drag-and-drop bundle:

```bash
powershell -File scripts/make-zip.ps1
```

Then drop `website-design-netlify.zip` onto the deploy box at
[app.netlify.com/drop](https://app.netlify.com/drop).

> **Do not use `Compress-Archive` for this.** Windows PowerShell writes zip
> entries with backslash separators (`_next\static\...`). Netlify unpacks on
> Linux, which treats those as literal filenames rather than folders — the
> structure flattens and every asset 404s. `scripts/make-zip.ps1` writes entries
> with forward slashes via `ZipArchive` directly. Verify any zip before uploading:
>
> ```powershell
> Add-Type -AssemblyName System.IO.Compression.FileSystem
> $z = [System.IO.Compression.ZipFile]::OpenRead("website-design-netlify.zip")
> @($z.Entries | Where-Object { $_.FullName -like '*\*' }).Count   # must be 0
> $z.Dispose()
> ```

Once deployed, the routes are `/`, `/portfolio-hero.html`, and
`/standalone/portfolio-hero.html`.

## Publishing to GitHub

GitHub CLI 2.98.0 is installed. Authenticate once — this step is interactive and
must be run in your own terminal:

```bash
gh auth login
```

Then create the repo and push:

```bash
gh repo create website-design --public --source=. --remote=origin --push
```

## Known constraints

- **`Entropy` is not responsive.** `size` is a fixed 400px square. At a 375px
  viewport it overflows — and `globals.css` sets
  `html, body { position: fixed; overflow: hidden }`, so the overflow is *clipped,
  not scrollable*. `EntropyField` was written to fill its container for this reason.
- **The demo's global CSS is aggressive.** `position: fixed` on `html`/`body` and a
  universal `transition-property: opacity` are fine for a single full-bleed demo,
  but will fight a normal scrolling page.
- Verified with `npm run build` — all routes compile, no type errors.

## Licence

The `Entropy` component originates from a third-party snippet; the portfolio
adaptation and vanilla port are mine.
