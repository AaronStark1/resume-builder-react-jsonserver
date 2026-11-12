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

**rBuild** is a modern, responsive resume builder web application built with React 19, Vite, MUI v7, and Motion. It enables job seekers to create recruiter-ready resumes with guided steps, live responsive A4 preview, client-side PDF export, direct modal editing, and local history tracking.

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

### 🕘 Resume History & Snapshots
- Relationship-based snapshot history with json-server (`_expand=resume`)
- Search by name or job title with instant filtering
- Direct route `/resume/:id` to open, edit, and re-download any snapshot
- Optimistic deletion with confirmation dialogs

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 7**
- **Material UI (MUI v7)** + Emotion
- **Motion (`motion/react`)** for smooth, accessible page & element animations
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

## 👨‍💻 Author

**Aaron Correya**\
Full Stack Developer
