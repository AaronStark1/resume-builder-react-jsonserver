# rBuild — Frontend

React 19 + Vite 7 + MUI 7 frontend for the rBuild resume builder.

## Scripts

- `npm run dev` — Start the development server at `http://localhost:5173`
- `npm run build` — Build for production
- `npm run lint` — Run ESLint
- `npm run preview` — Preview the production build

## Environment Variables

Copy `.env.example` to `.env` and set:

- `VITE_API_URL` — Backend API URL (defaults to `http://localhost:3000`)

For Vercel deployment, set `VITE_API_URL` in the project settings.

## Theme Transition

The light/dark switch is an ink-bleed transition in `src/ink/`, lazy-loaded by `ColorModeProvider`:

- `InkTransition.js` — orchestration: snapshot, synchronous theme flip, spread, interruptions, fallbacks
- `capture.js` — viewport snapshots rendered by the browser through SVG `foreignObject`
- `renderer.js`, `shaders.js` — WebGL2 renderer and the ink shader
- `params.js` — tuning: duration, tendrils, softness, rim colours

Under `prefers-reduced-motion`, without WebGL2, or if a snapshot fails, it falls back to a CSS colour cross-fade (`themeFade.js`).
