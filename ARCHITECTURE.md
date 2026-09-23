# ForgePath V4.0 Web Architecture

V4.0 is a stabilization release. The presentation layer from V3.12 is intentionally preserved while obsolete delivery/runtime layers are removed.

## Runtime flow

```text
index.html
  -> src/styles/app.css
  -> exercise-guide.js
  -> core/runtime.js
  -> progress / UI compatibility layers
  -> anatomy SVG layers
  -> version.js
```

## Folders

- `src/core/` — application runtime and version bridge.
- `src/features/` — exercise guide, progress data, skills, anatomy SVG.
- `src/ui/` — presentation layers retained from the approved V3.12 experience.
- `src/styles/` — application styles, including retained anatomy styling.
- `scripts/` — dependency-free local server, checks, and production build.

## V4.0 boundaries

V4.0 intentionally does not redesign screens or rewrite training algorithms. The goal is to create a stable Web-only base before deeper engine work.

The next architectural step should separate state/storage and training engines from `core/runtime.js` without changing the presentation layer.
