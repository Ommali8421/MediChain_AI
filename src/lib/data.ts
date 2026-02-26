// =============================================
// MEDICHAIN DEMO DATA & AUTH CREDENTIALS
// =============================================

export const DEMO_CREDENTIALS = [
    {
        email: "patient@medichain.io",
        password: "patient123",
        role: "patient" as const,
        name: "Om Mali",
        id: "P001",
        avatar: "AM",
        walletAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    },
    {
        email: "doctor@medichain.io",
        password: "doctor123",
        role: "doctor" as const,
        name: "Dr. Neel Patil",
        id: "D001",
        avatar: "SS",
        walletAddress: "0x9f8e7d6c5b4a3210fedcba0987654321fedcba09",
        specialty: "Cardiologist",
    },
];

export type UserRole = "patient" | "doctor";

export interface User {
    email: string;
    password: string;
    role: UserRole;
    name: string;
    id: string;
    avatar: string;
    walletAddress: string;
    specialty?: string;
}

// =============================================
// PATIENT DATA
// =============================================

export const patientProfile = {
    id: "P001",
    name: "Om Mali",
    dob: "1990-05-14",
    age: 35,
    bloodType: "O+",
    weight: "78 kg",
    height: "5'11\"",
    allergies: ["Penicillin", "Aspirin"],
    emergencyContact: "Meera Mehta (+91-98765-43210)",
    address: "124 Marine Drive, Mumbai, Maharashtra",
    insurance: "Star Health Premier",
    policyNo: "SH-2024-78432",
};

export const activeTreatments = [
    {
        id: "T001",
        name: "Hypertension Management",
        doctor: "Dr. Neel Patil",
        startDate: "2024-11-01",
        status: "Active",
        color: "teal",
        medications: ["Lisinopril 10mg", "Amlodipine 5mg"],
    },
    {
        id: "T002",
        name: "Type 2 Diabetes Control",
        doctor: "Dr. Rajesh Iyer",
        startDate: "2024-08-15",
        status: "Active",
        color: "blue",
        medications: ["Metformin 500mg", "Sitagliptin 100mg"],
    },
    {
        id: "T003",
        name: "Vitamin D Deficiency",
        doctor: "Dr. Neel Patil",
        startDate: "2025-01-20",
        status: "Monitoring",
        color: "purple",
        medications: ["Vitamin D3 2000 IU"],
    },
];

export const medicationSchedule = [
    { time: "8:00 AM", meds: ["Lisinopril 10mg", "Metformin 500mg", "Vitamin D3"], taken: true },
    { time: "1:00 PM", meds: ["Metformin 500mg"], taken: true },
    { time: "6:00 PM", meds: ["Amlodipine 5mg", "Sitagliptin 100mg"], taken: false },
    { time: "10:00 PM", meds: ["Lisinopril 10mg"], taken: false },
];

/** All available document tags */
export const VAULT_TAGS = [
    "X-Ray", "MRI", "CT Scan", "Ultrasound",
    "Lab Report", "Blood Test", "Urine Test",
    "Prescription", "Discharge Summary",
    "ECG", "Cardiology", "Neurology",
    "Vaccination", "Insurance", "Other",
] as const;

export type VaultTag = typeof VAULT_TAGS[number];

export const vaultRecords = [
    {
        id: "R001",
        name: "Annual Blood Panel - 2025",
        type: "Lab Report",
        date: "2025-02-10",
        size: "1.2 MB",
        cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        verified: true,
        sharedWith: ["D001"],
        icon: "file-text",
        tags: ["Lab Report", "Blood Test"] as VaultTag[],
    },
    {
        id: "R002",
        name: "Chest X-Ray Anterior View",
        type: "Imaging",
        date: "2025-01-15",
        size: "8.7 MB",
        cid: "QmVtYjNodeP2qQCLGXveXoD4b4HyLqHJQJ9gktHBJmGdwj",
        verified: true,
        sharedWith: ["D001"],
        icon: "image",
        tags: ["X-Ray"] as VaultTag[],
    },
    {
        id: "R003",
        name: "Echocardiogram Report",
        type: "Cardiology",
        date: "2024-12-20",
        size: "3.4 MB",
        cid: "QmSJXwFECvZFSzKZ8gX6RfSiPesSdqxvNm1u6YzQsS5cQj",
        verified: true,
        sharedWith: ["D001"],
        icon: "activity",
        tags: ["ECG", "Cardiology"] as VaultTag[],
    },
    {
        id: "R004",
        name: "HbA1c Diabetes Monitoring",
        type: "Lab Report",
        date: "2025-02-05",
        size: "0.8 MB",
        cid: "QmP5gB6EW9XT5yMhFyjm8k2m9mCbvBBiCeLMJNqYmh5i3",
        verified: false,
        sharedWith: [],
        icon: "file-text",
        tags: ["Lab Report", "Blood Test"] as VaultTag[],
    },
    {
        id: "R005",
        name: "MRI Brain Scan - Routine",
        type: "Imaging",
        date: "2024-11-30",
        size: "22.1 MB",
        cid: "QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51",
        verified: true,
        sharedWith: ["D001", "D002"],
        icon: "image",
        tags: ["MRI", "Neurology"] as VaultTag[],
    },
];


export const doctorPermissions = [
    {
        doctorId: "D001",
        doctorName: "Dr. Neel Patil",
        specialty: "Cardiologist",
        hospital: "Apollo Hospitals, Mumbai",
        grantedFiles: ["R001", "R002", "R003", "R005"],
        grantedDate: "2024-11-05",
        status: "Active",
    },
    {
        doctorId: "D002",
        doctorName: "Dr. Rajesh Iyer",
        specialty: "Endocrinologist",
        hospital: "Fortis Hospital, Delhi",
        grantedFiles: ["R001", "R005"],
        grantedDate: "2024-08-20",
        status: "Active",
    },
    {
        doctorId: "D003",
        doctorName: "Dr. Leena Kulkarni",
        specialty: "General Practitioner",
        hospital: "Max Healthcare, Bangalore",
        grantedFiles: [],
        grantedDate: "",
        status: "Pending",
    },
];

export const patientStats = {
    heartRate: 72,
    bloodPressure: "128/84",
    glucose: 98,
    oxygenSat: 98,
    temperature: 98.6,
    weight: 78,
};

export const notifications = [
    {
        id: "N001",
        type: "alert",
        message: "Your blood pressure reading is slightly elevated today",
        time: "2 hours ago",
        read: false,
    },
    {
        id: "N002",
        type: "info",
        message: "Dr. Neel Patil has reviewed your latest records",
        time: "5 hours ago",
        read: false,
    },
    {
        id: "N003",
        type: "success",
        message: "Prescription renewal approved: Lisinopril 10mg",
        time: "1 day ago",
        read: true,
    },
    {
        id: "N004",
        type: "info",
        message: "New lab results uploaded to your Vault",
        time: "2 days ago",
        read: true,
    },
];

// =============================================
// DOCTOR DATA
// =============================================

export const doctorProfile = {
    id: "D001",
    name: "Dr. Neel Patil",
    specialty: "Cardiologist",
    license: "MD-MH-2018-4521",
    hospital: "Apollo Hospitals, Mumbai",
    department: "Cardiology",
    experience: "12 years",
    rating: 4.9,
    patientsToday: 8,
    walletAddress: "0x9f8e7d6c5b4a3210fedcba0987654321fedcba09",
};

export const patientList = [
    {
        id: "P001",
        name: "Om Mali",
        age: 35,
        dob: "1990-05-14",
        condition: "Hypertension, Type 2 Diabetes",
        lastVisit: "2025-02-15",
        status: "Active",
        riskLevel: "Medium",
        accessGranted: true,
        bloodType: "O+",
        phone: "+91-98765-43210",
        nextAppointment: "2025-03-05",
        allergies: ["Penicillin", "Aspirin"],
        pastSurgeries: [
            { name: "Appendectomy", date: "2012-07-14", hospital: "Lilavati Hospital, Mumbai" },
        ],
    },
    {
        id: "P002",
        name: "Meeta Gupta",
        age: 62,
        dob: "1963-09-22",
        condition: "Atrial Fibrillation, CHF",
        lastVisit: "2025-02-18",
        status: "Critical",
        riskLevel: "High",
        accessGranted: true,
        bloodType: "A-",
        phone: "+91-91234-56789",
        nextAppointment: "2025-02-28",
        allergies: ["Sulfonamides", "Ibuprofen", "Latex"],
        pastSurgeries: [
            { name: "Coronary Bypass (CABG)", date: "2018-03-22", hospital: "Fortis Heart Institute, Delhi" },
            { name: "Pacemaker Implantation", date: "2021-11-05", hospital: "AIIMS, Delhi" },
        ],
    },
    {
        id: "P003",
        name: "Rahul Verma",
        age: 48,
        dob: "1977-01-30",
        condition: "Coronary Artery Disease",
        lastVisit: "2025-01-30",
        status: "Active",
        riskLevel: "High",
        accessGranted: true,
        bloodType: "B+",
        phone: "+91-99887-76655",
        nextAppointment: "2025-03-10",
        allergies: ["Codeine", "Shellfish"],
        pastSurgeries: [
            { name: "Angioplasty (PCI)", date: "2020-08-11", hospital: "Narayana Health, Bangalore" },
            { name: "Cholecystectomy", date: "2015-02-20", hospital: "Manipal Hospital, Bangalore" },
        ],
    },
    {
        id: "P004",
        name: "Jyoti Reddy",
        age: 29,
        dob: "1996-07-11",
        condition: "Arrhythmia (SVT)",
        lastVisit: "2025-02-01",
        status: "Stable",
        riskLevel: "Low",
        accessGranted: false,
        bloodType: "AB+",
        phone: "+91-94455-66778",
        nextAppointment: "2025-04-15",
        allergies: ["None known"],
        pastSurgeries: [],
    },
    {
        id: "P005",
        name: "Deepak Malhotra",
        age: 71,
        dob: "1954-12-03",
        condition: "Heart Failure, Hypertension",
        lastVisit: "2025-02-20",
        status: "Critical",
        riskLevel: "High",
        accessGranted: true,
        bloodType: "O-",
        phone: "+91-95566-77889",
        nextAppointment: "2025-02-24",
        allergies: ["ACE Inhibitors", "Penicillin", "Aspirin"],
        pastSurgeries: [
            { name: "Mitral Valve Repair", date: "2016-06-30", hospital: "Apollo Hospitals, Chennai" },
            { name: "ICD Implantation", date: "2019-09-14", hospital: "Medanta, Gurgaon" },
            { name: "Right Hip Replacement", date: "2022-01-18", hospital: "Fortis, Mumbai" },
        ],
    },
    {
        id: "P006",
        name: "Priya Sharma",
        age: 44,
        dob: "1981-04-17",
        condition: "Palpitations, Anxiety",
        lastVisit: "2025-02-10",
        status: "Monitoring",
        riskLevel: "Low",
        accessGranted: true,
        bloodType: "A+",
        phone: "+91-96677-88990",
        nextAppointment: "2025-03-20",
        allergies: ["Erythromycin"],
        pastSurgeries: [
            { name: "Thyroidectomy (partial)", date: "2017-11-08", hospital: "Kokilaben Hospital, Mumbai" },
        ],
    },
];


export const prescriptions = [
    {
        id: "RX001",
        patientId: "P001",
        patientName: "Om Mali",
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2024-11-01",
        endDate: "2025-05-01",
        status: "Active",
        refills: 3,
        notes: "Monitor BP weekly. Avoid NSAIDs.",
    },
    {
        id: "RX002",
        patientId: "P001",
        patientName: "Om Mali",
        medication: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily at night",
        startDate: "2024-11-01",
        endDate: "2025-05-01",
        status: "Active",
        refills: 3,
        notes: "Can cause ankle swelling.",
    },
    {
        id: "RX003",
        patientId: "P002",
        patientName: "Meeta Gupta",
        medication: "Warfarin",
        dosage: "5mg",
        frequency: "Once daily",
        startDate: "2024-09-15",
        endDate: "2025-09-15",
        status: "Active",
        refills: 5,
        notes: "INR monitoring required monthly.",
    },
];

export const aiInsights = [
    {
        patientId: "P001",
        insight: "Patient's HbA1c levels show a downward trend over the past 3 months, suggesting improved glycemic control. Blood pressure remains borderline elevated. Consider adjusting Lisinopril dosage or adding a diuretic.",
        flags: ["BP trending high", "Good glucose control"],
        severity: "medium",
        generatedAt: "2025-02-20 09:15:00",
    },
    {
        patientId: "P002",
        insight: "Patient exhibits signs of worsening cardiac function. BNP levels elevated. Recent echocardiogram shows EF reduced to 35%. Immediate medication review recommended. Consider specialist referral for ICD evaluation.",
        flags: ["Deteriorating EF", "High BNP", "Immediate attention required"],
        severity: "high",
        generatedAt: "2025-02-21 14:30:00",
    },
];

// =============================================
// MEDI-STREAK & ADHERENCE DATA
// =============================================

export type AdherenceStatus = "perfect" | "partial" | "missed" | "empty";

export interface DailyLog {
    date: string; // YYYY-MM-DD
    status: AdherenceStatus;
    morningTaken: boolean;
    eveningTaken: boolean;
}

/** Generate 365 days of synthetic adherence for Om Mali (P001) */
function generateAdherenceGrid(): DailyLog[] {
    const today = new Date("2026-02-26");
    const logs: DailyLog[] = [];
    const seed = [
        "perfect", "perfect", "partial", "perfect", "missed", "perfect", "perfect",
        "partial", "perfect", "perfect", "perfect", "missed", "perfect", "partial",
        "perfect", "perfect", "perfect", "missed", "partial", "perfect", "perfect",
        "perfect", "partial", "perfect", "perfect", "perfect", "missed", "perfect",
    ];
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        // first 60 days ago: older history has more misses
        const seedStatus = seed[i % seed.length] as AdherenceStatus;
        // recent 14 days: mostly perfect (current streak)
        const status: AdherenceStatus = i <= 14
            ? (i === 3 || i === 7 ? "partial" : "perfect")
            : (i > 300 ? (i % 11 === 0 ? "missed" : "partial") : seedStatus);

        logs.push({
            date: dateStr,
            status,
            morningTaken: status === "perfect" || status === "partial",
            eveningTaken: status === "perfect",
        });
    }
    return logs;
}

export const adherenceGrid: DailyLog[] = generateAdherenceGrid();

export const streakData = {
    currentStreak: 11,   // last 11 days perfect
    longestStreak: 34,
    totalPerfectDays: 198,
    complianceScore30d: 83, // % perfect days in last 30
    notificationsEnabled: true,
    badges: [
        { id: "b7", label: "7-Day Streak", days: 7, emoji: "🌱", unlocked: true, unlockedAt: "2025-10-14" },
        { id: "b30", label: "30-Day Streak", days: 30, emoji: "🥈", unlocked: true, unlockedAt: "2025-11-20" },
        { id: "b50", label: "50-Day Streak", days: 50, emoji: "🔥", unlocked: false, unlockedAt: null },
        { id: "b100", label: "100-Day Streak", days: 100, emoji: "🥇", unlocked: false, unlockedAt: null },
        { id: "b365", label: "365-Day Streak", days: 365, emoji: "💎", unlocked: false, unlockedAt: null },
    ],
};

/** Per-patient compliance summary used on doctor's patient detail page */
export const patientCompliance: Record<string, { score30d: number; streak: number; longestStreak: number }> = {
    "P001": { score30d: 83, streak: 11, longestStreak: 34 },
    "P002": { score30d: 51, streak: 2, longestStreak: 12 },
    "P003": { score30d: 68, streak: 5, longestStreak: 21 },
    "P004": { score30d: 94, streak: 27, longestStreak: 27 },
    "P005": { score30d: 45, streak: 0, longestStreak: 8 },
    "P006": { score30d: 77, streak: 9, longestStreak: 18 },
};

/** Today's medication doses for the patient (for mark-as-taken) */
export const todayDoses = [
    {
        id: "d1",
        time: "08:00",
        label: "Morning",
        windowStart: 6,
        windowEnd: 12,
        meds: ["Lisinopril 10mg", "Metformin 500mg", "Vitamin D3 2000 IU"],
        taken: true,  // already taken in our demo
    },
    {
        id: "d2",
        time: "13:00",
        label: "Afternoon",
        windowStart: 12,
        windowEnd: 16,
        meds: ["Metformin 500mg"],
        taken: true,
    },
    {
        id: "d3",
        time: "20:00",
        label: "Evening",
        windowStart: 18,
        windowEnd: 23,
        meds: ["Amlodipine 5mg", "Sitagliptin 100mg"],
        taken: false, // current pending dose
    },
    {
        id: "d4",
        time: "22:00",
        label: "Night",
        windowStart: 21,
        windowEnd: 24,
        meds: ["Lisinopril 10mg"],
        taken: false,
    },
];

// =============================================
// TIMELINE & ACTIVITY DATA
// =============================================

export interface TimelineEvent {
    id: string;
    patientId: string;
    date: string;
    type: "Checkup" | "Surgery" | "Lab Test" | "Prescription" | "Imaging" | "Emergency";
    title: string;
    description: string;
    doctor?: string;
    hospital?: string;
    icon: string;
}

export const patientTimeline: TimelineEvent[] = [
    {
        id: "T001",
        patientId: "P001",
        date: "2025-02-15",
        type: "Checkup",
        title: "Routine Cardiology Follow-up",
        description: "BP 130/85, reviewed Lisinopril efficacy. Patient reports feeling well without side effects.",
        doctor: "Dr. Neel Patil",
        hospital: "MediChain Clinic",
        icon: "activity"
    },
    {
        id: "T002",
        patientId: "P001",
        date: "2025-02-10",
        type: "Lab Test",
        title: "Annual Blood Panel",
        description: "Fasting glucose and lipid profile drawn. HbA1c improved to 6.2%.",
        hospital: "MediChain Labs",
        icon: "droplets"
    },
    {
        id: "T003",
        patientId: "P001",
        date: "2025-01-15",
        type: "Imaging",
        title: "Chest X-Ray",
        description: "Anterior view normal. No signs of cardiomegaly.",
        doctor: "Dr. Arun Das",
        hospital: "City Imaging Center",
        icon: "image"
    },
    {
        id: "T004",
        patientId: "P001",
        date: "2024-11-01",
        type: "Prescription",
        title: "New Medication Regimen",
        description: "Started Lisinopril 10mg and Amlodipine 5mg for hypertension management.",
        doctor: "Dr. Neel Patil",
        hospital: "MediChain Clinic",
        icon: "pill"
    },
    {
        id: "T005",
        patientId: "P001",
        date: "2024-10-22",
        type: "Emergency",
        title: "ER Visit: Palpitations",
        description: "Presented with elevated BP (160/95) and palpitations. Discharged after 4 hours of observation and ECG.",
        hospital: "Fortis ER",
        icon: "alert-triangle"
    }
];

// Generate 365 days of synthetic activity intensity (0 to 4 scale, 0 = no activity, 1 = low, etc.)
const activityCalStart = new Date("2024-02-26"); // pinned to roughly 1y ago so it's stable relative to our demo dates
export const activityCalendar = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date(activityCalStart);
    d.setDate(activityCalStart.getDate() + i);

    let intensity = 0;
    const isRecent = i > 300;
    // Bias: mostly 0. Sometimes 1-4.
    if (Math.random() > (isRecent ? 0.8 : 0.96)) {
        intensity = Math.floor(Math.random() * 4) + 1;
    }
    // Hardcode some intensity for the dates we have in timeline above so they always match visually
    const dStr = d.toISOString().split("T")[0];
    if (["2025-02-15", "2025-02-10", "2025-01-15", "2024-11-01", "2024-10-22"].includes(dStr)) {
        intensity = 4;
    }

    return {
        date: dStr,
        intensity: intensity as 0 | 1 | 2 | 3 | 4
    };
});
