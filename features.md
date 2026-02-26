# MediChain AI — Feature List

This document outlines all the features built into the MediChain AI MVP platform.

## 1. Core Platform & Architecture Features
- **Premium Glassmorphism UI**: High-end interface utilizing modern web design principles, backdrop blurs, dynamic mesh gradients, and framer-motion animations.
- **Dark/Light Mode Iteration**: The application defaults to a clean, professional Light Mode but natively supports a full Dark Mode class toggle.
- **Marketing Landing Page**: A scrolling, interactive landing page highlighting the core values: Zero-Knowledge Vaults, IPFS Storage, and AI Insights.
- **Secure Authentication Flow**: A dedicated `/login` route with one-click Demo Account autofill (Patient: Om Mali, Doctor: Dr. Neel Patil).

## 2. Patient Experience (The Patient Dashboard)
- **Active Treatments & Recommendations**: A quick overview of current medications and primary health conditions.
- **The Medical Vault**: A simulated decentralized document storage system where patients can see their uploaded files (X-Rays, Lab Reports) and use a tagging filter system.
- **Data Access Revocation**: Patients can virtually "revoke" access to specific medical documents from specific doctors.
- **Patient Medical Timeline**: A comprehensive, chronological vertical timeline detailing past checkups, surgeries, lab tests, prescriptions, and emergencies.
- **Overall Medical Activity Heatmap**: A GitHub-style 365-day contribution calendar visualizing the frequency and intensity of a patient's overall medical history interactions.

## 3. Medi-Streak & Reminder System (The Health Hub)
A highly gamified medication adherence suite for patients:
- **Time-Window Reminders**: Dynamic dose cards requiring verification within specific times of day (e.g., Morning: 06:00-12:00, Evening: 18:00-23:59).
- **"Mark as Taken" Verification**: Interactive logging mechanism that syncs dose history to local storage.
- **The Flame Streak**: A prominent visual counter tracking consecutive days of perfect adherence.
- **Achievement Badges**: LeetCode-style unlockable milestones for perfect adherence streaks (7 Days, 30 Days, 50 Days, 100 Days, 365 Days).
- **52-Week Adherence Grid**: A color-coded contribution calendar tracking daily performance (Red = missed, Yellow = partial, Teal = perfect).

## 4. Doctor Experience (The Clinician Dashboard)
- **Patient Roster & Risk Stratification**: A sortable list of assigned patients, highlighting those with "High" or "Elevated" risk levels.
- **Detailed Patient Views**: Cross-referencing patient demographics, vitals, active prescriptions, and the Patient Medical Timeline.
- **Clinical Adherence Tracking**: Doctors can view a read-only "Compliance Score" (%), the patient's current/longest Medi-Streak, and a concise 12-week adherence pattern grid.
- **Smart Prescribing & Allergy Alerts**: When prescribing, the platform simulates a check against the patient's known allergies (e.g., automatically blocking Aspirin if the patient's profile lists an NSAID allergy).

## 5. Doctor AI Engine (Gemini 2.5 Pro Integration)
A simulated AI chat console allowing doctors to interrogate a specific patient's data history using natural language:
- **Demographic Queries**: Capable of reading age, Date of Birth (DOB), and contact info from the data layer.
- **Vitals & Blood Type**: Reads accurate blood type data and generates baseline vitals patterns.
- **Allergies & Surgeries**: Explicit query support matching `"allergies"` and `"past surgeries"` to safely unroll arrays of historic patient data.
- **Record Synthesis**: Summarizes active prescriptions and clinical documents stored in the vault, producing a cohesive risk summary and recommended follow-up schedules.
