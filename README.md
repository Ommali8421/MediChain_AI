MediChain AI
============

Secure, AI-powered, decentralized medical records platform. Privacy-first design, clinician-friendly tools, and a premium, responsive UI.

Table of Contents
-----------------
- Overview
- Features
- Tech Stack
- Prerequisites
- Quick Start
- Configuration
- Available Scripts
- Project Structure
- Troubleshooting
- License

Overview
--------
MediChain AI is an MVP built with Next.js that demonstrates a decentralized health records experience. It includes patient and clinician dashboards, a “Medical Vault” concept with fine-grained access controls, a gamified medication adherence system, and a simulated Doctor AI engine for summarizing and interrogating patient history.

Features
--------
- Patient Experience
  - Active treatments overview with vitals context.
  - Medical Vault for documents (X‑Rays, lab reports) with tag filtering.
  - Access revocation flow to remove a doctor’s access to specific files.
  - Chronological medical timeline of checkups, surgeries, labs, prescriptions, emergencies.
  - Overall medical activity heatmap (GitHub‑style 365‑day view).
- Medi‑Streak & Reminders
  - Time‑window dose reminders (morning/evening windows).
  - “Mark as taken” verification stored locally for quick feedback.
  - Streak counter and unlockable badges (7, 30, 50, 100, 365 days).
  - 52‑week adherence grid with missed/partial/perfect indicators.
- Clinician Dashboard
  - Patient roster with risk stratification and sorting.
  - Detailed patient views: demographics, vitals, prescriptions, and timeline.
  - Adherence analytics: compliance %, current/longest streaks, 12‑week grid.
  - Smart prescribing simulation with allergy awareness.
- Doctor AI Engine (Simulated)
  - Natural‑language Q&A over patient records.
  - Reads demographics, vitals/blood‑type, allergies/surgeries, and prescriptions.
  - Generates cohesive risk summaries and follow‑up suggestions.
- UX & Design
  - Premium glass‑morphism UI with framer‑motion micro‑interactions.
  - Dark/Light theme support and responsive layouts.

Tech Stack
----------
- Next.js 14 (App Router), React 18, TypeScript 5
- Tailwind CSS 3, PostCSS
- Framer Motion, Lucide Icons, clsx, tailwind‑merge
- Path alias: @/* → src/*

Prerequisites
-------------
- Node.js 18+ (LTS recommended)
- Git
- One package manager: npm, pnpm, or yarn

Quick Start
-----------
1. Clone this repository:

```bash
git clone https://github.com/Ommali8421/MediChain_AI.git
cd MediChain_AI
```

2. Install dependencies:

```bash
npm install
# or: pnpm install
# or: yarn
```

3. Start the development server:

```bash
npm run dev
# open http://localhost:3000
```

4. Demo accounts (on /login):
   - Patient: email patient@medichain.io — password patient123
   - Doctor: email doctor@medichain.io — password doctor123
   - Use the “Demo” autofill buttons to populate credentials quickly.

Configuration
-------------
- Environment
  - The MVP does not require environment variables.
  - You may optionally create .env.local for future integrations (e.g., NEXT_PUBLIC_* values).
- Build output
  - Default Next.js configuration in next.config.mjs.
- Styling
  - Tailwind is preconfigured in tailwind.config.ts and postcss.config.mjs.
- TypeScript
  - Path aliases are set in tsconfig.json (@"/*" → "src/*").

Available Scripts
-----------------
- Development
  - npm run dev — start the dev server
- Production
  - npm run build — create an optimized production build
  - npm start — start the production server
- Quality
  - npm run lint — run ESLint (next/core‑web‑vitals)

Project Structure
-----------------
```
MediChain_AI/
├── src/
│   ├── app/
│   │   ├── dashboard/           # Patient & doctor dashboards
│   │   ├── login/               # Login route with demo autofill
│   │   ├── fonts/               # Local fonts (Geist)
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx           # App Router root layout
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable UI components
│   └── lib/                     # Auth context, data, utilities, streak store
├── package.json                 # Scripts and dependencies
├── tsconfig.json                # TS config with path aliases
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.mjs           # PostCSS configuration
├── next.config.mjs              # Next.js configuration
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Ignored files and dirs
└── features.md                  # Detailed feature list
```

Troubleshooting
---------------
- Node version errors
  - Ensure Node 18+ is installed: node -v
  - If using nvm: nvm use 18
- Port already in use
  - Run on a different port: npm run dev -- -p 3001
- Tailwind styles not applying
  - Restart the dev server after dependency or config changes.
  - Ensure globals.css is imported in src/app/layout.tsx.
- Path alias resolution (@/*)
  - If your IDE shows unresolved imports, reload the TS server and restart dev.
- Windows CRLF warnings
  - Harmless; Git will normalize line endings based on your settings.

License
-------
All rights reserved. For usage or contributions, please open an issue in the repository.
