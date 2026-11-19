# Lifestyle Tracker

- `index.html` is GENERATED. Never edit it directly.
- Edit `src/app.jsx` (app code, React 18 + JSX, uses globals `React`/`ReactDOM`) or `src/index.template.html` (head, CSS, fonts; keep the `<!-- BUILD:INLINE_SCRIPTS -->` marker).
- Then run `npm install` (once) and `npm run build`, and commit `index.html` together with `src/`. `npm run check` fails if they are out of sync; CI runs it on every push and PR.
- The built file inlines React/ReactDOM so it works offline when opened from disk (`file://`). Do not add runtime CDN scripts; add npm devDependencies with exact versions and inline them in `scripts/build.mjs` instead.
- The user opens the file directly, saves data in localStorage (`lifestyle-tracker-v8`), and is a Korean speaker: UI text is Korean.
