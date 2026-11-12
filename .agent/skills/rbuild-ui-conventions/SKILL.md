---
name: rbuild-ui-conventions
description: Design-system and motion conventions for the rBuild resume builder (React 19 + MUI 7 + Motion). Use whenever creating or modifying any UI component, page, style or animation in rbuild/.
---

# rBuild UI conventions

## Tokens
- Never hard-code brand colors. Use the MUI theme in `rbuild/src/theme.js` and the studio tokens in
  `rbuild/src/studio/tokens.js` (CSS custom properties on `<body>`, light/dark aware):
  primary #3d0066 (dark #14002b), secondary/accent tomato #ef4a23 (dark #c5361a, ink text on it),
  warm paper background #f8f3ea, gradient `theme.custom.gradient`.
  Tomato *text* on light surfaces uses `--lp-accent-text` for contrast.
- Fonts: Archivo Variable condensed (`.lp-display`, headlines) + Playfair italic (`.lp-serif`,
  editorial accents); Plus Jakarta Sans / Inter for functional UI, labels and inputs.
- Shared primitives live in `rbuild/src/studio/studio.css` (`lp-` type/CTA/link/paper, `lpn-`
  navigation, `st-` inner routes, `stf-` footer); route styles sit beside it
  (`builder.css`, `easel.css`, `controls.css`, `vault.css`, `launchpad.css`).
- Primary actions: `CtaLink` / `CtaButton` from `components/studio/Bits.jsx`; secondary: `.st-btn`.
- Buttons are pills, no uppercase, weight 600. Cards radius 16–24. 8-pt spacing. Soft shadows +
  1px `--st-desk-line` borders. The A4 resume is always white paper with dark ink.

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

