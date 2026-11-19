# Lifestyle Tracker

- `index.html` and `sw.js` are GENERATED. Never edit them directly.
- Edit `src/app.jsx` (app code, React 18 + JSX, uses globals `React`/`ReactDOM`) or `src/index.template.html` (head, CSS, fonts; keep the `<!-- BUILD:INLINE_SCRIPTS -->` marker).
- `src/sw.js` is the service worker source; the build injects a content hash as its cache version. `manifest.webmanifest` and `icons/` are plain static files (if you change them, rebuild so the SW version changes).
- Then run `npm install` (once) and `npm run build`, and commit `index.html` and `sw.js` together with `src/`. `npm run check` fails if they are out of sync; CI runs it on every push and PR.
- The built file inlines React/ReactDOM so it works offline when opened from disk (`file://`). Do not add runtime CDN scripts; add npm devDependencies with exact versions and inline them in `scripts/build.mjs` instead.
- The user opens the file directly, saves data in localStorage (`lifestyle-tracker-v8`), and is a Korean speaker: UI text is Korean.
- The app is also served by GitHub Pages at https://gbjh71-ops.github.io/lifestyle/ as an installable PWA. The service worker registers only on http(s), never for `file://`.
