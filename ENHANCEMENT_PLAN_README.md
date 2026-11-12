# rBuild — Enhancement & Fix Plan (Agent Execution Guide)

> **Audience:** an autonomous coding agent (Google Antigravity).
> **Goal:** fix every confirmed bug, harden the code, and give rBuild a polished, animated, modern UI — without changing the product's core idea (step form → live preview → PDF → history).
> **This file is temporary.** The last task (§9) is to delete it.

---

## 0. Ground rules for the agent

1. **Read this whole file before writing code.** Tasks are ordered so later phases build on earlier ones.
2. **Work phase by phase** (§2 → §8). After each phase:
   - `cd rbuild && npm run lint` → must report **0 errors**.
   - `cd rbuild && npm run build` → must succeed.
   - Run the app (see §1.3) and walk through the phase's acceptance criteria in a browser.
   - Make **one git commit per phase** with a clear message (e.g. `fix: phase 1 – critical bugs`). Work on a branch `feat/enhancement-plan`, not `main`.
3. **Stay in JavaScript.** Do not migrate to TypeScript. Keep **MUI v7** as the component library. Keep **json-server** as the backend.
4. **Keep the data shape backward compatible.** Existing records in `server/db.json` and on the live Render server must still render. When the shape changes (Phase 6, §8.2), add a normalizer; never require a data wipe.
5. Do not introduce new UI libraries beyond those listed in this plan without a strong reason.
6. If a task turns out to be wrong for the current code (e.g. the code changed), skip it and note why in the commit message. Do not force it.
7. Tick the checkboxes in this file as you go. It's your progress tracker and gets deleted at the end.

---

## 1. Project snapshot

### 1.1 Layout

```
/                       ← repo root (this file lives here)
├── README.md           ← public project README (needs fixes, §7.6)
├── rbuild/             ← React 19 + Vite 7 + MUI 7 frontend (deployed on Vercel)
│   ├── index.html
│   └── src/
│       ├── App.jsx                  routes
│       ├── main.jsx
│       ├── index.css / App.css      (App.css is empty)
│       ├── components/
│       │   ├── Header.jsx  Footer.jsx
│       │   ├── Form.jsx             owns formData state; shows FormSteps + Preview
│       │   ├── FormSteps.jsx        6-step MUI Stepper form, POSTs resume
│       │   ├── Preview.jsx          resume render + PDF download + Edit button
│       │   └── Edit.jsx             modal that PUTs resume
│       ├── pages/
│       │   ├── LandingPage.jsx  ResumeGeneratorPage.jsx  History.jsx  PageNotFound.jsx
│       └── services/
│           ├── commonAPI.js  allAPIs.js  serverURL.js
└── server/             ← json-server 0.17 (deployed on Render), db.json = { resumes[], history[] }
```

### 1.2 Data model (current)

```js
// resumes
{ id, personalDetails:{name,title,location},
  contactDetails:{email,phoneNumber,github,linkedIn,portfolio},
  education:{course,college,university,year},
  professionalDetails:{jobTitle,company,location,duration},
  skills:[string], summary:string }
// history
{ id, resumeId, formattedDate:"16/03/2026 , 10:20 AM" }
```

### 1.3 Run locally

```bash
# terminal 1
cd server && npm install && npm start          # http://localhost:3000
# terminal 2
cd rbuild && npm install && npm run dev        # http://localhost:5173
```
Until §2.3 is done, `rbuild/src/services/serverURL.js` points at the Render URL. Switch it to localhost while developing (or do §2.3 first).

### 1.4 Baseline measured before this plan

- `npm run lint` → **4 errors** (unused `useState` in `App.jsx`; unused `isFinished`, `handleReset`, `err` in `FormSteps.jsx`).
- `npm run build` → main chunk **1,191 kB** (362 kB gzip), with a ">500 kB chunk" warning.
- MUI installed version: **7.3.4**.

---

## 2. Phase 0 — Foundations (do first)

### 2.1 Install the recommended agent skills
See **§10**. Install them before any UI work so they guide Phases 5–6.

### 2.2 Remove dead weight and conflicting CSS
- [x] **`rbuild/index.html`**
  - Remove the **Bootstrap 5 CDN `<link>`**. Bootstrap's reboot fights MUI styles. MUI's `CssBaseline` (§2.4) replaces it.
  - Replace the Google Fonts `<link>`, which loads **~20 font families** while the app only uses Barlow. Load only the families chosen in §7.1, or better, self-host them with `@fontsource-variable/*` and import them in `main.jsx`.
  - Fix `<title>` → `rBuild — Smart Resume Builder`. Add `<meta name="description">`, `theme-color` (`#14002b`) and Open Graph tags.
  - Favicon: the current one is a remote PNG declared as `type="image/svg+xml"`. Add a local `rbuild/public/favicon.svg` (a simple "rB" monogram in brand colors) and reference it correctly.
- [x] **`rbuild/package.json`**: uninstall the unused `bootstrap`, `react-bootstrap` and `react-icons` (grep confirms no imports).
- [x] Delete the empty `rbuild/src/App.css` and its import.
- [x] Replace the Vite boilerplate `rbuild/README.md` with 5–10 lines describing the frontend (scripts and env vars).

### 2.3 Environment-based API URL
- [x] Replace `rbuild/src/services/serverURL.js` with:
  ```js
  export const serverURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  ```
- [x] Add `rbuild/.env.example` with `VITE_API_URL=http://localhost:3000`. `.env` is already git-ignored at the root.
- [x] Note in the root README that Vercel must define `VITE_API_URL=https://resume-builder-jsonserver.onrender.com`.

### 2.4 Central MUI theme (design tokens)
Brand colors are hard-coded in ~15 places (`#14002b`, `#3d0066`, `#ff7b00`, `#e56a00`).
- [x] Create `rbuild/src/theme.js` using `createTheme` with:
  - `palette.primary` = `#3d0066` (dark `#14002b`), `palette.secondary` = `#ff7b00` (dark `#e56a00`), `background.default` = `#f7f7fb`.
  - `typography`: heading and body families from §7.1, plus `button: { textTransform: 'none', fontWeight: 600 }`.
  - `shape.borderRadius: 12`.
  - `components` overrides: `MuiButton` (rounded, no uppercase), `MuiCard`/`MuiPaper` (soft shadow), `MuiTextField` default `variant: 'outlined'`, size small on dense forms.
  - A custom token `theme.custom.gradient = 'linear-gradient(120deg,#14002b,#3d0066)'`.
- [x] In `main.jsx`, wrap `<App/>` in `<ThemeProvider theme={theme}><CssBaseline/>…</ThemeProvider>`.
- [x] Replace **every** hard-coded brand hex in components with theme references (`'primary.main'`, `'secondary.main'`, `theme.custom.gradient`).
- **Acceptance:** `grep -rn "#ff7b00\|#3d0066\|#14002b\|#e56a00" rbuild/src` returns matches only in `theme.js`.

### 2.5 Fix lint baseline
- [x] Remove the unused `useState` import in `App.jsx`, the unused `isFinished` prop and `handleReset` in `FormSteps.jsx`, and use `catch {}` (no binding) where the error is unused.
- **Acceptance:** `npm run lint` → 0 errors.

---

## 3. Phase 1 — Critical bugs (confirmed)

### 3.1 MUI v7 `Grid` API — layouts are silently broken
MUI 7.3.4's `Grid` is the former Grid v2. It **deletes** the `item` prop and the `xs/sm/md` props at runtime (see `node_modules/@mui/system/Grid/deleteLegacyGridProps.js`). Every `<Grid item xs={12} md={6}>` in the app is therefore ignored, and columns don't size responsively.
- [x] In `LandingPage.jsx`, `ResumeGeneratorPage.jsx`, `Footer.jsx` and `History.jsx`, migrate:
  ```jsx
  <Grid item xs={12} md={6}>   →   <Grid size={{ xs: 12, md: 6 }}>
  <Grid item>                  →   <Grid>
  ```
- **Acceptance:** no "prop has been removed" warnings in the browser console. The landing hero is 2 columns at ≥900px and stacked below. The features grid is 1/2/3 columns at xs/sm/md.

### 3.2 `Edit.jsx` — inputs lose focus after every keystroke
`const Section = ({title, children}) => …` is declared **inside** the `Edit` render function. Each render creates a new component type, so React unmounts and remounts every `TextField` and focus is lost after each character.
- [x] Move `Section` to module scope (outside `Edit`), or inline it.
- **Acceptance:** you can type a full sentence into any Edit modal field without clicking back into it.

### 3.3 `Edit.jsx` — many fields are not editable
The modal omits `contactDetails.portfolio`, `education.university`, `education.year` and **all** of `professionalDetails` (jobTitle, company, location, duration).
- [x] Add the missing fields. To avoid repeating ~400 lines of near-identical `TextField` JSX in both `FormSteps` and `Edit`, create **`rbuild/src/config/resumeFields.js`**:
  ```js
  export const sections = [
    { key: 'personalDetails', title: 'Basic Information', fields: [
      { name: 'name', label: 'Full Name', required: true },
      { name: 'title', label: 'Job Title' },
      { name: 'location', label: 'Location' } ] },
    { key: 'contactDetails', title: 'Contact Details', fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
      { name: 'linkedIn', label: 'LinkedIn URL', type: 'url' },
      { name: 'portfolio', label: 'Portfolio URL', type: 'url' } ] },
    // education, professionalDetails …
  ]
  ```
  …and a reusable `<SectionFields section value onChange errors />` component that renders the fields. Use it in both `FormSteps` and `Edit`.
- [x] Use a single nested-update helper instead of hand-written spreads: `updateField(sectionKey, fieldName, value)`.
- **Acceptance:** every field of the data model can be edited in the modal, and the change appears in the preview and the PDF.

### 3.4 `commonAPI.js` swallows errors
`commonAPI` `.catch`es and **returns** the axios error, so every caller's `try/catch` is dead code. On failure, callers read `response.data` → `undefined` → crash. For example, `Edit.handleUpdate` calls `onUpdate(undefined)`, and then `Preview` crashes on `updatedData.personalDetails`. `History` crashes on `resumesRes.data.forEach`.
- [x] Rewrite using an axios instance that **throws**:
  ```js
  import axios from 'axios'
  import { serverURL } from './serverURL'
  export const api = axios.create({ baseURL: serverURL, timeout: 60000 }) // Render cold start can take ~50s
  export const commonAPI = (method, url, data) => api({ method, url, data })
  ```
  Update `allAPIs.js` to pass relative paths (`/resumes`, …).
- [x] Wrap every call site in `try/catch` and show a non-blocking error: `FormSteps.handleAddResume`, `Preview.handlePdfDownload`, `Edit.getResumeDetailsById`, `Edit.handleUpdate`, `History.loadData`, `History.deleteHistory`.
- **Acceptance:** with the server stopped, no screen crashes. Each action shows a friendly error message.

### 3.5 Downloading before submission creates orphan history records
`Form.jsx` renders `Preview` (with the **Download PDF**, Edit and History buttons) beside the form while it is being filled. At that point `resumeId` is `null`, so a download POSTs `{ resumeId: null }` to `/history`. The History page then shows that card as **"Loading..." forever**.
- [x] Add a `mode` prop to `Preview`: `'live'` (form side, no action bar, or only a disabled hint "Finish the form to download") vs `'final'` (full action bar).
- [x] In `handlePdfDownload`, guard `if (!resumeId) return`.
- [x] In `History.jsx`, render a "Resume no longer available" state (with a delete button) when `resumeMap[item.resumeId]` is missing, instead of "Loading...".
- **Acceptance:** no `/history` record is ever created with a `null` `resumeId`, and no card is stuck on "Loading…".

### 3.6 Edit → preview sync is fragile
`Preview` keeps a separate `updatedData` state and merges it field by field. `sk = updatedData.skills?.length ? updatedData.skills : skills` means that **removing all skills in Edit reverts the preview to the old skills**. The `Form`'s `formData` also goes stale.
- [x] Remove `updatedData` from `Preview`. Pass `setFormData` (or an `onUpdate` callback) from `Form` → `Preview` → `Edit`, and on successful PUT call `setFormData(response.data)`. `Preview` renders only from `formData`.
- [x] In `Edit`, re-fetch (or reset from the latest data) **each time the modal opens**, so Cancel discards unsaved edits.
- **Acceptance:** edit → remove all skills → save → the preview shows the placeholder skills state. Edit → change name → Cancel → reopen → the original name is shown.

### 3.7 Double-submit on "Finish"
- [x] Add a `submitting` state in `FormSteps`. Disable the Finish button and show a `CircularProgress` inside it while the POST is in flight. Do the same for "Save Changes" in Edit and "Download PDF".

### 3.8 SPA deep links 404 on Vercel
The repo has no `vercel.json`, so refreshing `/history` or `/form` on the live site 404s (Vite builds a single `index.html`).
- [x] Add `rbuild/vercel.json` (Vercel's project root is `rbuild/`):
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### 3.9 Invalid nested interactive elements
`<Link to="…"><Button>…</Button></Link>` renders `<a><button>`, which is invalid HTML and causes double focus stops. It appears in `LandingPage.jsx` (×4), `ResumeGeneratorPage.jsx` and `Preview.jsx`.
- [x] Replace each one with `<Button component={Link} to="…">`.

### 3.10 Remove the meaningless `/edit` route
`App.jsx` mounts `<Edit/>` at `/edit` with no `resumeId`, which renders a lone disabled button. Remove the route and its import.

---

## 4. Phase 2 — Form UX, validation & data quality

### 4.1 Step labels don't match content
`steps` labels: `…'Skills and Certifications', 'Review and Submit'`, but step 4 is skills only and step 5 is the **Professional Summary** text box, not a review.
- [ ] Rename the steps to: `Basics`, `Contact`, `Education`, `Experience`, `Skills`, `Summary`, then add a real **7th "Review" step** that shows a compact read-only summary with "Edit" links that jump back to a step (`setActiveStep(i)`).
- [ ] Make **Contact** required, since email is essential. If an optional step is still wanted, make **Experience** optional (for freshers) and keep the existing skip logic.

### 4.2 Validation
- [ ] Per-step validation before `handleNext`:
  - `name` is required.
  - `email` is required and must match a valid email format.
  - `phoneNumber`: digits, spaces, `+` and `-`, 7–15 digits.
  - URL fields: optional, but if present they must be valid. Auto-prefix `https://` when the protocol is missing.
  - `year`: 4 digits, between 1950 and current year + 6.
- [ ] Show errors with `TextField` `error` and `helperText`. Don't use `alert()`.
- **Acceptance:** you can't advance with an invalid email. Errors clear as the user fixes them.

### 4.3 Skills input
- [ ] Trim input. Make the duplicate check case-insensitive. Replace `alert("Skill already exists")` with helper text or a MUI `Snackbar`.
- [ ] Pressing **Enter** adds the skill.
- [ ] Render added skills as `Chip`s with `onDelete` (as Edit does), not as contained `Button`s with "✕".
- [ ] Expand suggestions (e.g. TypeScript, Next.js, Python, Java, SQL, Git, Docker, AWS, Figma, Communication, Leadership) and hide ones already added. Ideally, derive suggestions from the entered job title using a small static map (frontend → React/TypeScript/CSS…, backend → Node/SQL/Docker…).

### 4.4 Summary step
- [ ] Add a live character counter (aim for 300–600 chars) and 2–3 clickable "starter" templates that insert editable text using the user's title and skills.

### 4.5 Draft autosave
Refreshing the page loses everything.
- [ ] Persist `formData` and `activeStep` to `localStorage` (debounced, ~400 ms; wrap in try/catch). Restore on mount and clear after a successful submit. Show a subtle "Draft saved" indicator.

### 4.6 After finishing
- [ ] On the final screen, add a **"Create another resume"** button that resets the form state and draft, plus a "Back to editing" option.

### 4.7 Mobile stepper
- [ ] Six or seven horizontal steps overflow on phones. Use `orientation="vertical"` below `md` (`useMediaQuery`), or `alternativeLabel` with a `MobileStepper` on xs.

---

## 5. Phase 3 — Preview & PDF quality

### 5.1 Extract a shared `ResumeTemplate`
`Preview.jsx` and `History.jsx` each hand-render the resume with different markup.
- [ ] Create `rbuild/src/components/resume/ResumeTemplate.jsx`, a pure component `({ data, placeholders = false })` that renders one resume at **true A4 size: 794 × 1123 px**. Use it in both Preview and History.
- [ ] Hide empty contact links instead of rendering `href="#"` placeholders when not in placeholder mode. Separate items with `•` only between present values.
- [ ] Add a `normalizeResume(data)` helper in `rbuild/src/utils/normalizeResume.js` that fills missing keys with defaults. Apply it to every resume fetched from the API, so older and partial records never crash rendering.

### 5.2 Responsive scaling
`Paper width: 700` overflows on phones and in the split view.
- [ ] Wrap the template in a `ScaledPage` component. It measures its container with `ResizeObserver` and applies `transform: scale(containerWidth / 794)` with `transformOrigin: 'top left'`, and sets the wrapper's height to `1123 * scale` so the layout doesn't jump.
- [ ] History thumbnails reuse `ScaledPage` (e.g. a 280px-wide card gives a real miniature of the actual resume).

### 5.3 PDF download
- [ ] **Lazy-load** `html2canvas` and `jspdf` inside the click handler (`const { jsPDF } = await import('jspdf')`). This removes ~200 kB+ from the initial bundle.
- [ ] Capture the **unscaled** page: `html2canvas(el, { scale: 2, backgroundColor: '#fff', useCORS: true, onclone: (doc) => { doc.getElementById('resume-scaler').style.transform = 'none' } })`.
- [ ] **Multi-page support:** if the canvas height exceeds one A4 page, slice it across pages (loop with `pdf.addPage()` and a negative y offset) instead of overflowing the first page.
- [ ] Filename: `${slugify(name) || 'resume'}-rbuild.pdf`.
- [ ] Use JPEG at quality 0.92 instead of PNG for much smaller files.
- [ ] Record history **only after** the save succeeds. Store `createdAt: new Date().toISOString()` alongside `formattedDate` (kept for old records).
- [ ] *(Optional, recommended)* Add a secondary **"Print / ATS-friendly PDF"** button using `react-to-print` v3 (`useReactToPrint({ contentRef, documentTitle })`) with `@page { size: A4; margin: 0 }` print CSS. Browser print gives **selectable text and clickable links**, which applicant-tracking systems can parse. The canvas PDF cannot.

---

## 6. Phase 4 — History page

- [ ] Fetch with json-server's relations and sorting instead of two calls plus a manual map: `GET /history?_expand=resume&_sort=id&_order=desc` (json-server 0.17 supports `_expand`, `_sort` and `_order`). Run each item through `normalizeResume`.
- [ ] **Loading state:** skeleton cards (`Skeleton` with A4 aspect ratio). If a request exceeds ~3 s, show "Waking up the server… (free hosting can take up to a minute)" because Render free-tier cold starts are slow.
- [ ] **Empty state:** an illustration or icon, "No resumes yet", and a CTA to `/form`.
- [ ] **Delete:** confirm with SweetAlert2 (or an MUI `Dialog`), remove optimistically with an exit animation (§7.3), and restore on failure.
- [ ] **Card actions:** add "Open" (navigates to a new route `/resume/:id` that loads the resume and shows the `final` Preview, so it can be edited and re-downloaded) and "Download" buttons.
- [ ] Display dates from `createdAt` when present, formatted with `Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })`, falling back to `formattedDate`.
- [ ] Optional: a search box filtering by name or title.
- [ ] Add `App.jsx` route `/resume/:id` → `pages/ResumeView.jsx`.

---

## 7. Phase 5 — Visual redesign, motion & polish

> Use the installed **frontend-design** / **ui-ux-pro-max** skills (§10) for this phase. The brand stays **deep purple (#14002b → #3d0066) + orange accent (#ff7b00)**. Refine it rather than replace it.

### 7.1 Typography & visual language
- [ ] Fonts (self-hosted via `@fontsource-variable`): **Plus Jakarta Sans** for headings (700–800, tight letter-spacing `-0.02em`) and **Inter** for body and UI. Remove Barlow, or keep it only inside the resume template if preferred.
- [ ] A type scale defined in the theme (h1 clamp(2.5rem, 5vw, 4rem), etc.) using `responsiveFontSizes(theme)`.
- [ ] Consistent 8-pt spacing. Section padding `py: { xs: 8, md: 14 }`.
- [ ] Surfaces: subtle 1px borders (`rgba(20,0,43,0.08)`) and layered soft shadows instead of MUI's default heavy `boxShadow: 10`.
- [ ] Hero background: replace the flat gradient with gradient + soft radial glows (orange and violet blurred blobs) + a faint grid or noise texture, all in CSS, no images.
- [ ] Glassy sticky header: `backdrop-filter: blur(12px)` with a semi-transparent purple background. It shrinks slightly on scroll.

### 7.2 Page-by-page redesign

**Header (`Header.jsx`)**
- [ ] The logo becomes a `Link` to `/` (monogram + wordmark).
- [ ] Mobile: hamburger `IconButton` → MUI `Drawer` with the nav links. Desktop nav is unchanged.
- [ ] Highlight "Create Resume" as active for both `/resume` and `/form`.
- [ ] The "Start Now" CTA duplicates "Create Resume". Keep only the CTA on desktop, styled as the orange primary action.

**Landing (`LandingPage.jsx`)**
- [ ] **Replace the stock Unsplash hero photo** with a live, animated mini resume: render `ResumeTemplate` with sample data inside `ScaledPage`, tilted in 3D (`perspective`, `rotateY(-8deg)`), floating gently, with 2–3 floating "chips" around it ("✓ PDF ready", "ATS-friendly", "6 steps"). This shows the actual product.
- [ ] **Honesty pass on content:** the page currently claims *"AI powered suggestions"*, *"Modern Templates"*, *"drag & edit"*, shows a **"Trusted by Google / Amazon / Infosys…"** strip, and has **fabricated testimonials** with random avatars. None of these exist. Replace them with truthful content:
  - A "How it works" 3-step section (Fill → Preview live → Download), with numbered animated steps.
  - A features grid listing real features: guided steps, live preview, one-click PDF, edit anytime, history, autosave, and templates if Phase 6 is done. Each feature gets an MUI icon in a tinted rounded square.
  - Remove the logo strip and testimonials, or replace them with a single clearly labelled "Built with React, MUI & json-server" tech strip.
- [ ] Fix the hover on the "View History" outlined button. It currently turns solid orange while the text stays white. Use a subtle white/10% fill instead.
- [ ] All images get meaningful `alt` text, `loading="lazy"` (except the hero) and explicit width/height. Any remaining Unsplash URLs get `?auto=format&fit=crop&w=1200&q=75`, since they currently download full-resolution originals.

**ResumeGeneratorPage (`/resume`)**
- [ ] Match the new hero style. Replace the remote Freepik image with the same animated mini resume (or a template gallery if Phase 6 is done). Use MUI `CheckCircle` icons instead of "✔" text.

**Form (`/form`)**
- [ ] Two-pane layout on ≥md: the form card is on the left and the **sticky** live preview (`position: sticky; top: 88px`) is on the right. Show a slim progress bar (`LinearProgress`) of the completion percentage above the form.
- [ ] On < md, the preview is behind a floating "Preview" FAB that opens a full-screen `Dialog`.

**History**
- [ ] A masonry or responsive grid of A4 thumbnails with hover lift. On hover, an overlay with Open / Download / Delete fades in.

**PageNotFound**
- [ ] Replace the bare `<div>PageNotFound</div>` with a branded 404: a large gradient "404", a short message, a "Go home" button and a subtle animated illustration.

**Footer**
- [ ] Brand name is inconsistent ("ResumeBuilder" vs "rBuild"). Use **rBuild**.
- [ ] The contact details (`rbuilder@gmail.com`, `+91 98989 89898`) look like placeholders. Replace them with real ones or remove them. Social `IconButton`s need real `href`s (`component="a"`, `target="_blank"`, `rel="noopener noreferrer"`) and an `aria-label`. Remove any without a real link.
- [ ] Add quick links (Home / Create / History) and a GitHub repo link.

### 7.3 Motion system (use **Motion**, the successor to framer-motion)
- [ ] `npm i motion`. Import with `import { motion, AnimatePresence, MotionConfig } from 'motion/react'`.
- [ ] Create `rbuild/src/motion/variants.js` with shared variants so all motion feels like one system:
  ```js
  export const ease = [0.22, 1, 0.36, 1]            // "easeOutQuint"-like
  export const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }
  export const stagger = (s = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: s } } })
  export const scaleIn = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } } }
  ```
- [ ] Wrap the app in `<MotionConfig reducedMotion="user">` to **respect `prefers-reduced-motion`**. This is required.
- [ ] Where to animate (and **only** here, to stay tasteful):
  | Place | Animation |
  |---|---|
  | Route changes | `AnimatePresence mode="wait"` keyed on `location.pathname`. Fade plus a 8px slide, 250 ms. |
  | Landing hero | Staggered fade-up of headline, sub, CTAs. Mini resume scales in, then floats (`y: [0,-10,0]`, 6 s loop). |
  | Sections on scroll | `whileInView="show"` + `viewport={{ once: true, amount: 0.2 }}` with `fadeUp` and stagger for cards. |
  | Feature cards / buttons | `whileHover={{ y: -4 }}`, `whileTap={{ scale: 0.97 }}`. |
  | Form step changes | `AnimatePresence` with direction-aware slide (next → from right, back → from left). |
  | Skill chips | `layout` + `AnimatePresence` with pop-in and pop-out (scale 0.8 → 1). |
  | Live preview | Subtle highlight flash on the section being edited (e.g. background pulse for 400 ms when its data changes). |
  | History cards | Staggered entrance. `exit={{ opacity: 0, scale: 0.9 }}` on delete with `layout` so the grid reflows smoothly. |
  | Success after Finish / Download | Small confetti burst (`canvas-confetti`, lazy-loaded) plus an MUI `Snackbar` instead of a modal SweetAlert for success cases. |
- [ ] Keep durations at 150–600 ms. Animate only `transform` and `opacity` (no layout-thrashing properties). No infinite animations other than the hero float.

### 7.4 Accessibility & SEO
- [ ] Every icon-only button has an `aria-label`. All images have `alt`. Color contrast ≥ 4.5:1 (check orange text on white; use `#c25e00` for orange *text* if needed).
- [ ] Visible focus rings (`:focus-visible` outline in theme overrides).
- [ ] Keyboard: Enter submits the skill input, Esc closes dialogs (MUI default).
- [ ] Set `document.title` per route (a small `usePageTitle` hook).

### 7.5 Performance
- [ ] Route-level code splitting: `React.lazy` + `Suspense` for `History`, `Form`, `ResumeView` and `PageNotFound`.
- [ ] Lazy-load `html2canvas`, `jspdf`, `canvas-confetti` and `sweetalert2` where used.
- [ ] **Acceptance:** `npm run build` shows **no chunk > 500 kB** and the initial JS is substantially below the 1,191 kB baseline.

### 7.6 Root `README.md` fixes
- [ ] The install steps are wrong: they say `cd rbuild` and then run `json-server --watch db.json` there, but `db.json` lives in `server/`. Replace them with the correct two-terminal instructions from §1.3, plus the `VITE_API_URL` env var.
- [ ] Update the feature list and tech stack to match reality (Motion, the new PDF flow, autosave, templates if done). Remove "AI skill suggestions" unless implemented.
- [ ] Add 2–3 screenshots or a GIF placeholder section.

---

## 8. Phase 6 — Feature enhancements (do after Phases 0–5 are green)

### 8.1 Multiple templates + accent color *(advertised in README "Future Enhancements")*
- [ ] Add `template: 'classic' | 'modern' | 'minimal'` and `accentColor` (hex) to the resume model, with defaults in `normalizeResume` (`'classic'`, `#3d0066`).
- [ ] Turn `ResumeTemplate` into a dispatcher for three layouts:
  - **classic** is the current centered layout.
  - **modern** has a colored left sidebar (contact and skills) with the main column on the right.
  - **minimal** is left-aligned with thin rules and generous whitespace.
- [ ] Add a template picker (thumbnail cards) and 6 accent swatches on the Review step and in the final Preview. Changing them animates with a crossfade.

### 8.2 Multiple education & experience entries
- [ ] Support arrays: `educationList[]` and `experienceList[]`, each experience with `bullets[]` (achievements). Use add/remove/reorder UI (up/down buttons are enough).
- [ ] **Backward compatibility:** `normalizeResume` converts the old single-object `education` and `professionalDetails` into one-item arrays. Keep writing the new shape only.
- [ ] Add optional sections: Projects (name, link, description) and Certifications (name, issuer, year). The current "Skills and Certifications" step label implies certifications.

### 8.3 Resume completeness score
- [ ] Add a small, purely client-side score (0–100) shown as a circular progress ring next to the preview. It is based on filled fields, summary length, skills count (≥5), and having at least one experience with bullets. Show 2–3 actionable tips. *(This covers the README's "Resume scoring system" item honestly, without AI.)*

### 8.4 Optional
- [ ] Dark mode toggle for the app chrome (not the resume page itself). Store it in `localStorage` and respect `prefers-color-scheme` by default.
- [ ] Add Vitest + React Testing Library with a few tests: `normalizeResume`, validators, and FormSteps navigation and validation.

### 8.5 Server notes (`server/`)
- [ ] `server/db.json` currently contains real-looking personal contact data and is committed. Replace the seed records with clearly fake sample data (e.g. "Alex Sample", `alex@example.com`).
- [ ] Add `"engines": { "node": ">=18" }` to `server/package.json`.
- [ ] Document in the README that Render's free tier has an **ephemeral filesystem**, so created resumes reset on redeploy or restart. This is acceptable for a demo but should be stated.

---

## 9. Final verification & self-cleanup

- [ ] `cd rbuild && npm run lint` → 0 errors, 0 warnings.
- [ ] `cd rbuild && npm run build` → success, no chunk > 500 kB.
- [ ] Manual (or Playwright via the **webapp-testing** skill) smoke test at 375px, 768px and 1440px widths:
  1. Landing renders, animations play, and nothing animates when the OS "reduce motion" setting is on.
  2. Create a resume end to end. Validation blocks bad email. Refreshing mid-form restores the draft.
  3. Finish → final preview → Edit (typing doesn't lose focus; all fields editable) → Save → preview updates.
  4. Download PDF → file named after the user, multi-page if long → history entry created.
  5. History shows the new card with a real thumbnail. Open / Download / Delete work. The empty state appears when all are deleted.
  6. Visit `/does-not-exist` → branded 404. Refresh on `/history` works (vercel.json).
  7. Stop the server → actions show friendly errors and nothing crashes.
- [ ] Browser console shows no errors or React warnings during the flow above.
- [ ] **Delete this file** and commit:
  ```bash
  git rm ENHANCEMENT_PLAN_README.md
  git commit -m "chore: remove completed enhancement plan"
  ```
  Keep any skills you installed under `.agent/skills/` (see §10). They document the project's conventions for future work.

---

## 10. Recommended agent skills (install in Phase 0)

Antigravity supports the open **Agent Skills** format (`SKILL.md` folders). Workspace skills go in **`.agent/skills/<skill-name>/SKILL.md`** at the repo root, and global ones go in `~/.gemini/antigravity/skills/`. If your Antigravity version uses a different path, check its Skills docs. Verify each repository below exists before copying. If a source is unavailable, skip it and rely on the guidance in §7.

| Skill | Source | Why it helps rBuild |
|---|---|---|
| **frontend-design** | `github.com/anthropics/skills` → `skills/frontend-design` | Pushes toward distinctive, non-generic UI: bold typography, cohesive palettes, purposeful motion, atmospheric backgrounds. This is the main lever for §7. |
| **ui-ux-pro-max** | `github.com/nextlevelbuilder/ui-ux-pro-max-skill` | A searchable library of UI styles, color palettes, font pairings and UX guidelines. Useful for choosing the hero treatment, card styles and spacing. |
| **web-design-guidelines** & **react-best-practices** | `github.com/vercel-labs/agent-skills` | Audits UI for accessibility, focus states and forms (§7.4), and React performance patterns such as code splitting and avoiding re-render traps like the `Section` bug in §3.2 (§7.5). |
| **webapp-testing** | `github.com/anthropics/skills` → `skills/webapp-testing` | Drives the running app with Playwright to take screenshots and verify flows at multiple viewport widths. Use it for every phase's acceptance check and for §9. |

Install example (manual copy, works everywhere):
```bash
mkdir -p .agent/skills && cd /tmp
git clone --depth 1 https://github.com/anthropics/skills anthropic-skills
cp -r anthropic-skills/skills/frontend-design anthropic-skills/skills/webapp-testing \
      "$OLDPWD/.agent/skills/"
# repeat for the other repos, copying only the skill folders you need
```

### 10.1 Project skill to create: `rbuild-ui-conventions`
Create **`.agent/skills/rbuild-ui-conventions/SKILL.md`** with the content below. It keeps Phases 5–6 consistent and stays in the repo after this plan is deleted.

```markdown
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
```

---

*End of plan. When every box above is ticked and §9 passes, delete this file as instructed in §9.*
