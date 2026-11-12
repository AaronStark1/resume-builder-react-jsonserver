<p align="center">
  <img src="rbuild/public/favicon.svg" alt="rBuild Logo" width="80" />
</p>

<h1 align="center">rBuild — Smart Resume Builder</h1>

> Build professional resumes in minutes.\
> Design. Preview. Download. Track history.

## 🔗 Live Demo

rBuild is live here:  
https://resume-builder-react-jsonserver.vercel.app/

------------------------------------------------------------------------

## ✨ Overview

**rBuild** is a modern, responsive resume builder web application built with React 19, Vite, MUI v7, and Motion. It enables job seekers to create recruiter-ready resumes with guided steps, live responsive A4 preview, client-side PDF export, direct modal editing, and local history tracking — in light or dark mode, switched with an organic WebGL ink-bleed transition.

------------------------------------------------------------------------

## 🧠 Key Features

### 📝 Step-Based Resume Form
- 7-step guided workflow: Basics, Contact, Education, Experience, Skills, Summary, and Review
- Form validation with inline error states and auto URL normalization
- Smart skill suggestions derived from your professional designation
- Professional summary starter templates with live character counter
- Local draft autosave — never lose your work on page refresh

### 👁️ Live Responsive A4 Preview
- Real-time preview rendered at true A4 dimensions (794 × 1123 px)
- Proportional responsive scaling via `ScaledPage` and `ResizeObserver`
- Mobile preview accessible via floating action button and full-screen modal

### 📄 Multi-Page PDF & Print Export
- Client-side multi-page PDF generation via lazy-loaded `html2canvas` and `jsPDF`
- High-fidelity JPEG compression (quality 0.92) with automatic user-based naming
- Print-optimized CSS stylesheet for ATS-friendly selectable text PDFs
- Resumes always render as a white A4 document with dark text — in the preview, the PDF and print — whatever the app theme

### 🕘 Resume History & Snapshots
- Relationship-based snapshot history with json-server (`_expand=resume`)
- Search by name or job title with instant filtering
- Direct route `/resume/:id` to open, edit, and re-download any snapshot
- Optimistic deletion with confirmation dialogs

### 🌗 Ink-Bleed Light / Dark Mode
- Switching themes spreads an organic ink blot (or bleach, back to light) from the toggle across the page, revealing the new theme as it grows
- Custom WebGL2 shader: domain-warped noise, branching tendrils, paper-fibre edges, diffusion haze, speckles and a pooled pigment rim
- Pixel-accurate snapshots of the screen, rendered by the browser itself (SVG `foreignObject`) at the moment you toggle — so it works on every page, with live form input, scroll position and sticky headers
- Interruptible: toggle again mid-spread and a new ink spreads over the current frame
- Sun ⇄ moon toggle icon that morphs in step with the ink; works with mouse, touch and keyboard (Enter / Space)
- Respects `prefers-reduced-motion` with a gentle colour cross-fade, which is also the fallback without WebGL2
- Theme saved in `localStorage` (`rbuild_theme_mode`); follows your OS setting until you choose one
- Lazy-loaded engine (~11 kB gzipped) that frees its GPU memory after each transition — see [`rbuild/src/ink/`](rbuild/src/ink/)

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 7**
- **Material UI (MUI v7)** + Emotion
- **Motion (`motion/react`)** for smooth, accessible page & element animations
- **WebGL2** (custom GLSL shader) for the ink-bleed theme transition
- **React Router v7** with lazy-loaded route splitting
- **SweetAlert2** + **canvas-confetti**

### Backend & Storage
- **json-server 0.17** REST API (`server/`)
- Browser `localStorage` for form draft autosaving

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AaronStark1/resume-builder-react-jsonserver
cd resume-builder-react-jsonserver
```

### 2️⃣ Start Backend (Terminal 1)

```bash
cd server
npm install
npm start
```
The mock API server runs at `http://localhost:3000`.

> **Note on Free-tier Hosting:** Render's free tier has an ephemeral filesystem, meaning records reset upon server cold restarts or redeployments.

### 3️⃣ Start Frontend (Terminal 2)

```bash
cd rbuild
npm install
npm run dev
```
The application runs at `http://localhost:5173`.

### 🌐 Environment Variables

In `rbuild/`, copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:3000
```
For production deployment (e.g. Vercel), set:
```env
VITE_API_URL=https://resume-builder-jsonserver.onrender.com
```

------------------------------------------------------------------------

## 📸 Screenshots & Visuals

| Home Landing | Step Form & Live Preview |
| :---: | :---: |
| *(Interactive 3D mini resume & feature highlights)* | *(Two-pane split layout with real-time A4 scaling)* |

| Resume History | PDF Export |
| :---: | :---: |
| *(A4 miniature cards with search & actions)* | *(Crisp multi-page PDF export & print preview)* |

------------------------------------------------------------------------

## 🙏 Acknowledgements

The ink-bleed theme transition is adapted from [ink-bleed-theme-changer](https://github.com/codemure-official/ink-bleed-theme-changer) by codemure.

------------------------------------------------------------------------

## 👨‍💻 Author

**Aaron Correya**\
Full Stack Developer
