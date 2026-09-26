# ForgePath V4.0 implementation notes

## Product direction

V4.0 follows the ForgePath 2026 direction: Today-first coaching, explainable adaptive decisions, fast workout logging, actionable progress and a premium dark visual language.

## Deliberate architecture decisions

1. **Web-first** — no Capacitor and no service worker in this release.
2. **No 3D runtime** — V4 uses lightweight SVG form illustrations and a YouTube Form Guide action. This keeps the app fast and avoids CDN/WebGL failure modes from V3.12.
3. **Real IndexedDB storage** — V4 state is stored in IndexedDB with localStorage fallback.
4. **V3.12 migration** — profile, history, XP and streak can migrate from `forgepath_state_v1` on first run.
5. **No framework/build dependency** — ES modules allow direct deployment to any static host.

## Current core screens

- Today: readiness, adaptive workout, quick adaptations, explainable recommendation, muscle focus, streak.
- Workouts: daily workout queue and program presets.
- Workout mode: set logging, actual/RIR entry, previous performance, add set, replace, skip, notes, rest timer, YouTube form search.
- Progress: volume trend, streak, PR, coaching insight, muscle distribution, history.
- Library: all 41 V3.12 exercises with search/filter and progression detail.

## Suggested next V4.x work

- V4.1: onboarding + assessment redesign and full plan generator.
- V4.2: richer progressive overload engine and exercise substitution constraints.
- V4.3: account/cloud sync and authentication.
- V4.4: Health Connect / HealthKit integrations.
- V4.5: shareable workout completion cards and notification/live workout surfaces.
