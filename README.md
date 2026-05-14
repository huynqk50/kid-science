# Kid Science

Kid Science is a browser-based science practice game for Grade 6 learners. The first playable path is **Science Sorter**, a fast classification activity for rocks, the rock cycle, and changes to materials.

## Scope

- React, TypeScript, and Vite static app.
- Module-driven quiz content.
- Evidence tools, reason tokens, sorting bins, score, streak, and field notebook review.
- No backend required for the current version.

## Project Structure

```text
.
|-- docs/
|   `-- superpowers/
|       |-- plans/
|       `-- specs/
|-- scripts/
|   `-- verify.mjs
`-- src/
    |-- App.tsx
    |-- main.tsx
    `-- styles.css
```

## Commands

```bash
npm install
npm run build
```

Run locally:

```bash
npm run dev -- --host 127.0.0.1
```

Run browser verification while the dev server is running:

```bash
APP_URL=http://127.0.0.1:5173/ npm run verify
```

## Deployment Notes

Build on a modern Node.js host, then deploy the generated `dist/` directory as static files behind nginx. For CentOS 7 targets, keep Node.js out of the server runtime path and serve only static assets.
