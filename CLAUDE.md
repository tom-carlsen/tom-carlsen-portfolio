# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static single-page portfolio site for Tom Carlsen — a CX leadership portfolio targeting mid-market SaaS companies. No build step, no framework, no dependencies. Open `index.html` directly in a browser.

## Development

**To preview locally:** open `index.html` in any browser — no server required. For live-reload during editing, any static file server works:

```bash
npx serve .
# or
python -m http.server 8080
```

**To deploy:** drag the folder onto [netlify.com/drop](https://app.netlify.com/drop), or push to `main` and enable GitHub Pages (Settings → Pages → source: `main` / root).

**Repository:** https://github.com/tom-carlsen/tom-carlsen-portfolio

## Git workflow

After completing any piece of work, commit and push immediately so no progress is ever lost. Commits should be scoped to a single concern — don't bundle unrelated changes.

```bash
git add <files>
git commit -m "type: short description"
git push
```

Commit message types: `feat` (new content or feature), `fix` (bug or visual correction), `style` (CSS-only change), `refactor` (restructuring without behaviour change), `docs` (CLAUDE.md or comments), `chore` (assets, config).

Examples of clean messages:
- `feat: add favicon and link in head`
- `fix: correct mobile layout for stories duo grid`
- `style: increase hero name font size on large screens`
- `docs: update resume PDF in assets`

## Architecture

Three files, no interdependencies beyond the HTML loading the other two:

| File | Responsibility |
|------|---------------|
| `index.html` | All content and structure. Single page, five sections: `#hero`, `#journey`, `#stories`, `#philosophy`, `#contact`. SVG icons are inlined. |
| `style.css` | All styles. Design tokens at the top in `:root`, then sections in source order matching the HTML. No class utilities — every class maps to a specific component. |
| `script.js` | All behaviour. One IIFE, nine numbered micro-interactions. No external libraries. Touch devices skip cursor and tilt interactions via `window.matchMedia("(hover: none)")`. |

## Design system

All colours, spacing, and easing live as CSS custom properties in the `:root` block at the top of `style.css`. Change the accent pair here to retheme the whole site:

```css
--violet: #A78BFA;   /* primary accent */
--teal:   #2DD4BF;   /* secondary accent */
--bg:     #07070F;   /* page background */
```

The gradient `--gradient: linear-gradient(135deg, #A78BFA 0%, #2DD4BF 100%)` is used on: hero name, section labels, scroll progress bar, nav active underline, and contact heading.

## HTML conventions

- Sections requiring scroll-triggered fade-in get class `fade-in`. JS adds `.visible` via Intersection Observer.
- Hero text lines get class `reveal-line`. JS adds `.revealed` with staggered delays on load.
- Buttons that should drift toward the cursor get class `magnetic`.
- Cards that should 3D-tilt get attribute `data-tilt`.
- Journey items track the cursor glow position via CSS custom properties `--mouse-x` / `--mouse-y` set by JS.

## Content placeholders

Two items still need real files added before the site is complete:

- `assets/resume.pdf` — linked from the contact section's "Resume" button
- `assets/favicon.ico` — not yet referenced in the HTML; add a `<link rel="icon">` tag when ready
