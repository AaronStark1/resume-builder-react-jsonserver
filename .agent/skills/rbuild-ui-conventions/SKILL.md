---
name: rbuild-ui-conventions
description: Design-system and motion conventions for the rBuild resume builder (React 19 + MUI 7 + Motion). Use whenever creating or modifying any UI component, page, style or animation in rbuild/.
---

# rBuild UI conventions

## Tokens
- Never hard-code brand colors. Use the MUI theme in `rbuild/src/theme.js`:
  primary #3d0066 (dark #14002b), secondary/accent #ff7b00 (dark #e56a00),
  gradient `theme.custom.gradient`. Orange *text* on white uses #c25e00 for contrast.
- Fonts: Plus Jakarta Sans (headings), Inter (UI/body). Buttons: no uppercase, weight 600.
- Radius 12 (cards 16). 8-pt spacing. Soft layered shadows + 1px rgba(20,0,43,.08) borders.

## Components
- Use MUI v7 APIs: `<Grid size={{ xs: 12, md: 6 }}>` (never `item`/`xs` props).
- Links that look like buttons: `<Button component={Link} to="...">`, never nest Button in Link.
- Never declare components inside another component's render body.
- Resume rendering only through `components/resume/ResumeTemplate.jsx` + `ScaledPage`.
- Every API call goes through `services/allAPIs.js`, wrapped in try/catch with user feedback.
- Resume data from the API always passes through `utils/normalizeResume.js`.

## Motion (`motion/react`)
- Import shared variants from `src/motion/variants.js` (fadeUp, stagger, scaleIn, ease).
- App is wrapped in `<MotionConfig reducedMotion="user">`. Do not bypass it.
- Animate only transform/opacity; 150–600 ms; scroll reveals use `viewport={{ once: true }}`.
- Lists that add/remove items use `layout` + `AnimatePresence` with exit animations.
- Only the hero illustration may loop infinitely.

## Quality bar
- `npm run lint` clean, no console warnings, works at 375px / 768px / 1440px.
- Icon-only buttons have aria-label; images have alt; focus-visible rings present.

