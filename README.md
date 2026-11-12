<p align="center">
  <img src="https://cdn.iconscout.com/icon/free/png-256/free-resume-icon-svg-download-png-386556.png" alt="Resume Icon" width="80" />
</p>

<h1 align="center">rBuild — Smart Resume Builder</h1>


> Build professional resumes in minutes.\
> Design. Preview. Download. Track history.

## 🔗 Live Demo

rBuild is live here:  
https://resume-builder-react-jsonserver.vercel.app/

------------------------------------------------------------------------

## ✨ Overview

**rBuild** is a modern resume builder web application that allows
users to:

-   Create structured professional resumes
-   Preview changes live while filling the form
-   Download resumes instantly as PDF
-   Edit previously generated resumes
-   Track resume download history

The application focuses on **simplicity, speed, and recruiter-friendly
design.**

------------------------------------------------------------------------

## 🧠 Key Features

### 📝 Step-Based Resume Form

-   Guided multi-step resume creation
-   Personal details, education, experience, skills & summary
-   Skill suggestions support
-   Clean validation-friendly architecture

### 👁️ Live Resume Preview

-   Real-time preview updates
-   Shows placeholders when fields are empty
-   Professional structured layout
-   Edit support after resume submission

### 📄 Instant PDF Download

-   Converts resume preview to PDF using `html2canvas` + `jsPDF`
-   Maintains layout consistency
-   One-click download experience

### 🕘 Resume History Tracking

-   Stores previously downloaded resumes
-   Shows date & preview snapshot
-   Delete history records anytime
-   Organized dashboard layout

### ✏️ Resume Editing

-   Update resume after creation
-   Modal based editing UI
-   Live preview refresh after update

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-0081CB?logo=mui&logoColor=white)](https://mui.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![SweetAlert2](https://img.shields.io/badge/SweetAlert2-FF6C37?logo=javascript&logoColor=white)](https://sweetalert2.github.io/)

### PDF Generation

[![html2canvas](https://img.shields.io/badge/html2canvas-20232A?logo=javascript&logoColor=F7DF1E)](https://html2canvas.hertzen.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-FFCA28?logo=javascript&logoColor=black)](https://parallax.github.io/jsPDF/)

### Backend (Mock API)

[![json-server](https://img.shields.io/badge/json--server-000000?logo=node.js&logoColor=white)](https://github.com/typicode/json-server)

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/AaronStark1/resume-builder-react-jsonserver\
cd rbuild

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Start Backend

npx json-server --watch db.json --port 3000

### 4️⃣ Start Frontend

npm run dev

Application runs at: http://localhost:5173

> **Note for Deployment:** Vercel must define `VITE_API_URL=https://resume-builder-jsonserver.onrender.com` in environment variables.

------------------------------------------------------------------------

## 🎯 Future Enhancements

-   Multiple resume templates
-   Theme & color customization
-   Authentication system
-   AI skill suggestions
-   Resume scoring system

------------------------------------------------------------------------

## 👨‍💻 Author

**Aaron Correya**\
Passionate Full Stack Developer
