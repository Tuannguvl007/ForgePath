# ForgePath V4.0 Web

A clean web rebuild of ForgePath based on the ForgePath 2026 UI direction.

## What changed

- Replaced the monolithic V3.12 `index.html` override stack with separate HTML/CSS/JS files.
- Preserved the 41-exercise V3.12 library.
- Added Today-first adaptive dashboard with readiness, quick adaptations, explainable "Why this workout?", muscle focus and weekly consistency.
- Added real workout logging: previous values, targets, editable actual/RIR, set completion, add set, replace, skip, notes and rest timer.
- Added YouTube Form Guide search instead of bundling a heavy 3D/WebGL runtime.
- Added progress metrics, 8-week trend, coaching insight, muscle distribution and workout history.
- Added searchable/filterable exercise library.
- Uses IndexedDB for V4 state with localStorage fallback and migration support from `forgepath_state_v1`.
- Pure web build: no PWA service worker and no Capacitor.

## Run locally

Use any static server. For example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

The folder can be deployed as a static site to GitHub Pages, Cloudflare Pages, Vercel, Netlify or any normal web host. No build step is required.
