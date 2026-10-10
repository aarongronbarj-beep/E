# ealize-nordic

The Nordic / Signal rebuild of the Ealize marketing site — light editorial canvas,
electric cobalt `#002FD6` as the owned brand colour, Helsinki design-week feel.
No purple, ever.

## Stack
React 19 · Vite · TypeScript · Tailwind · Motion · Space Grotesk + Inter.

## Run
```bash
npm install
npm run dev      # http://localhost:5173 (or the printed port)
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

Append `?static` to the URL to render the page with entrance animations skipped
(used for deterministic screenshots; the site also respects `prefers-reduced-motion`).

## Design tokens
Defined in `tailwind.config.js` + `src/index.css`:
`blue #002FD6` · `ink #0A0E1A` · `navy #05103A` · `paper #FFFFFF / #F6F7FB` · `line #E5E7EF`.
Palette is intentionally blue + ink + paper only.

## Sections
`Nav · Hero · LogoStrip · Services · Flywheel · DarkSignal · Work · Founders ·
Pricing · Contact · Footer` (assembled in `src/App.tsx`).

## Imagery
Generated with Higgsfield (pure cobalt duotone), stored in `public/images/*.webp`
and referenced from `src/lib/assets.ts`. Swap any file there.

### Edit before launch
- `public/images/founders.webp` — replace with a **real photo** of the two founders.
- `src/components/Pricing.tsx` — prices are placeholders (Website `from €399`, Digital Marketing `Monthly`, Full System `Custom`).
- Logo names in `src/components/LogoStrip.tsx` are sample clients.
- `src/lib/projects.ts` — the Kesäyrittäjät.fi entry has placeholder copy, and `public/images/hero-noise.webp` stands in for its screenshot.
- `public/images/service-design.webp` stands in for the Digital Marketing card image; `service-seo.svg` is a hand-drawn mockup.
- Contact details (`hello@ealize.fi`, Helsinki) live in `Contact.tsx` / `Footer.tsx`.
