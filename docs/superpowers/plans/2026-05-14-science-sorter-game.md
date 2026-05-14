# Science Sorter Implementation Plan

## Goal

Build Kid Science as a standalone browser-based science practice game. The first playable module is Science Sorter: learners inspect evidence, select a reason token, sort the object into a category, and review mistakes in a field notebook.

## Current V1 Scope

- React, TypeScript, Vite, and CSS.
- Static client-side app with no backend.
- Rocks and Rock Cycle module.
- Changes to Materials module.
- Evidence tools: visual clue, lens clue, and test clue.
- Reason tokens before sorting.
- Score, streak, mastery percentage, feedback, and review queue.
- Browser smoke verification with Playwright Core.

## File Ownership

Kid Science owns only these app paths:

- `src/App.tsx`
- `src/main.tsx`
- `src/styles.css`
- `scripts/verify.mjs`
- `docs/superpowers/specs/2026-05-14-science-sorter-game-design.md`
- `docs/superpowers/plans/2026-05-14-science-sorter-game.md`

Do not copy cell-gallery source, 3D model assets, generated previews, or deployment files from other projects.

## Next Implementation Tasks

- Move module content from `src/App.tsx` into `src/game/content.ts`.
- Add typed domain helpers under `src/game/`.
- Add Vitest coverage for scoring, mastery, and content validation.
- Add localStorage persistence for mastery progress.
- Add a separate nginx deploy template after the target domain is confirmed.
- Add CI build and verification jobs once the GitHub repo is stable.

## Verification

Use:

```bash
npm run build
npm run dev -- --host 127.0.0.1
APP_URL=http://127.0.0.1:5173/ npm run verify
```
