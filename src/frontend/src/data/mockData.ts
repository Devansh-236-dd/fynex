export const kpiData = [
  {
    label: "Total Transactions",
    value: "4,233",
    change: "+12.3%",
    icon: "💳",
    bg: "kpi-blue",
    color: "text-blue-700",
  },
  {
    label: "Suspicious Alerts",
    value: "43",
    change: "+5 today",
    icon: "🚨",
    bg: "kpi-purple",
    color: "text-purple-700",
  },
  {
    label: "Risk Exposure",
    value: "₹29.8L",
    change: "-2.1%",
    icon: "⚠️",
    bg: "kpi-mint",
    color: "text-emerald-700",
  },
  {
    label: "Active Investigations",
    value: "12",
    change: "+3 new",
    icon: "🔍",
    bg: "kpi-peach",
    color: "text-orange-700",
  },
];

export const recentAlerts = [
  {
    id: 1,
    type: "Layering",
    severity: "Critical",
    account: "SBI-8821",
    amount: "₹1,21,000",
    description:
      "Multi-hop fund transfer detected across 6 accounts within 24h",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Round-Tripping",
    severity: "High",
    account: "HDFC-3341",
    amount: "₹72,500",
    description: "Funds returned to origin after 3 intermediaries",
    time: "18 min ago",
  },
  {
    id: 3,
    type: "Structuring",
    severity: "High",
    account: "ICICI-6612",
    amount: "₹9,800",
    description: "Multiple transactions just below ₹10,000 reporting threshold",
    time: "45 min ago",
  },
  {
    id: 4,
    type: "Dormant Reactivation",
    severity: "Medium",
    account: "Axis-1190",
    amount: "₹18,000",
    description:
      "Account inactive for 14 months suddenly received large deposit",
    time: "1 hr ago",
  },
  {
    id: 5,
    type: "Profile Mismatch",
    severity: "Medium",
    account: "PNB-5572",
    amount: "₹2,600",
    description: "Transaction pattern inconsistent with customer risk profile",
    time: "3 hr ago",
  },
];

export const aiInsights = [
  "🔴 Unusual spike detected in SBI Mumbai-West Branch: 340% above normal volume",
  "🟡 Dormant account Axis-1190 (Sunita Patel) activated — flagged for review",
  "🔴 Round-trip pattern confirmed: HDFC-3341 → ICICI-7782 → Kotak-0091 → HDFC-3341",
  "🟢 ML model confidence: 94.2% fraud probability on cluster C-17",
  "🟡 Geographic anomaly: Transactions originating from 3 states in 6 hours on BOB-9921",
];

export interface FundNode {
  id: string;
  x: number;
  y: number;
  label: string;
  risk: "low" | "medium" | "high" | "critical";
  balance: string;
  type: string;
}

export interface FundEdge {
  from: string;
  to: string;
  amount: string;
  suspicious: boolean;
  label: string;
}

export const fundNodes: FundNode[] = [
  {
    id: "n1",
    x: 120,
    y: 250,
    label: "SBI-8821",
    risk: "critical",
    balance: "₹1.21Cr",
    type: "Corporate",
  },
  {
    id: "n2",
    x: 280,
    y: 120,
    label: "HDFC-3341",
    risk: "high",
    balance: "₹72.5K",
    type: "Individual",
  },
  {
    id: "n3",
    x: 280,
    y: 380,
    label: "ICICI-6612",
    risk: "high",
    balance: "₹9.8K",
    type: "Individual",
  },
  {
    id: "n4",
    x: 450,
    y: 80,
    label: "Kotak-7782",
    risk: "medium",
    balance: "₹26K",
    type: "Business",
  },
  {
    id: "n5",
    x: 450,
    y: 250,
    label: "Axis-0091",
    risk: "medium",
    balance: "₹15K",
    type: "Individual",
  },
  {
    id: "n6",
    x: 450,
    y: 420,
    label: "PNB-5572",
    risk: "low",
    balance: "₹2.6K",
    type: "Individual",
  },
  {
    id: "n7",
    x: 620,
    y: 150,
    label: "BOI-1190",
    risk: "medium",
    balance: "₹18K",
    type: "Dormant",
  },
  {
    id: "n8",
    x: 620,
    y: 350,
    label: "BOB-2234",
    risk: "low",
    balance: "₹7K",
    type: "Individual",
  },
  {
    id: "n9",
    x: 760,
    y: 250,
    label: "Canara-9921",
    risk: "high",
    balance: "₹46K",
    type: "Corporate",
  },
  {
    id: "n10",
    x: 760,
    y: 80,
    label: "UCO-4410",
    risk: "low",
    balance: "₹10K",
    type: "Business",
  },
];

export const fundEdges: FundEdge[] = [
  { from: "n1", to: "n2", amount: "₹70K", suspicious: true, label: "₹70K" },
  { from: "n1", to: "n3", amount: "₹50K", suspicious: true, label: "₹50K" },
  { from: "n2", to: "n4", amount: "₹37K", suspicious: true, label: "₹37K" },
  { from: "n2", to: "n5", amount: "₹33K", suspicious: true, label: "₹33K" },
  { from: "n3", to: "n6", amount: "₹9.8K", suspicious: false, label: "₹9.8K" },
  { from: "n4", to: "n9", amount: "₹25K", suspicious: false, label: "₹25K" },
  { from: "n5", to: "n1", amount: "₹31K", suspicious: true, label: "₹31K" },
  { from: "n5", to: "n7", amount: "₹18K", suspicious: false, label: "₹18K" },
  { from: "n7", to: "n9", amount: "₹16K", suspicious: false, label: "₹16K" },
  { from: "n8", to: "n9", amount: "₹7K", suspicious: false, label: "₹7K" },
  { from: "n9", to: "n10", amount: "₹12K", suspicious: false, label: "₹12K" },
];

export const fraudAlerts = [
  {
    id: 1,
    type: "Layering",
    riskScore: 94,
    severity: "Critical",
    accounts: ["SBI-8821", "HDFC-3341", "Kotak-7782"],
    reasoning:
      "Funds split into 6 sub-transactions across multiple accounts, re-aggregated within 24 hours. Classic layering pattern with 94% ML confidence.",
    status: "Open",
    time: "2026-03-29 09:14",
  },
  {
    id: 2,
    type: "Round-Tripping",
    riskScore: 88,
    severity: "Critical",
    accounts: ["HDFC-3341", "Kotak-7782", "Axis-0091"],
    reasoning:
      "Money transferred from HDFC-3341 through two intermediaries and returned to origin. Classic circular transaction detected.",
    status: "Investigating",
    time: "2026-03-29 08:52",
  },
  {
    id: 3,
    type: "Structuring",
    riskScore: 76,
    severity: "High",
    accounts: ["ICICI-6612"],
    reasoning:
      "Customer made 9 cash deposits between ₹9,500–₹9,900 over 5 days, deliberately avoiding the ₹10,000 CTR threshold.",
    status: "Open",
    time: "2026-03-29 07:30",
  },
  {
    id: 4,
    type: "Dormant Activation",
    riskScore: 68,
    severity: "High",
    accounts: ["BOI-1190"],
    reasoning:
      "Account dormant for 14 months suddenly received ₹18,000. No KYC update. Transaction origin from foreign IP.",
    status: "Open",
    time: "2026-03-28 16:45",
  },
  {
    id: 5,
    type: "Profile Mismatch",
    riskScore: 61,
    severity: "Medium",
    accounts: ["PNB-5572"],
    reasoning:
      "Customer profile: street vendor, monthly income ~₹8,000. Transaction of ₹2,600 received from corporate entity.",
    status: "Open",
    time: "2026-03-28 14:20",
  },
  {
    id: 6,
    type: "Cross-Border Anomaly",
    riskScore: 79,
    severity: "High",
    accounts: ["Canara-9921"],
    reasoning:
      "Three transactions originating from Dubai, Singapore, and Mauritius within 6 hours to same domestic account.",
    status: "Investigating",
    time: "2026-03-28 11:05",
  },
  {
    id: 7,
    type: "Velocity Anomaly",
    riskScore: 55,
    severity: "Medium",
    accounts: ["BOB-2234"],
    reasoning:
      "Account typically processes 2-3 transactions/month. Sudden spike to 47 transactions in 72 hours.",
    status: "Closed",
    time: "2026-03-27 09:00",
  },
  {
    id: 8,
    type: "Identity Mismatch",
    riskScore: 72,
    severity: "High",
    accounts: ["UCO-4410"],
    reasoning:
      "KYC photo does not match face captured at ATM during withdrawal. Possible identity theft.",
    status: "Investigating",
    time: "2026-03-27 15:30",
  },
  {
    id: 9,
    type: "Threshold Avoidance",
    riskScore: 63,
    severity: "Medium",
    accounts: ["HDFC-3341", "PNB-5572"],
    reasoning:
      "Coordinated transactions from two accounts, each just below reporting threshold, likely same orchestrator.",
    status: "Open",
    time: "2026-03-26 10:15",
  },
  {
    id: 10,
    type: "Shell Company",
    riskScore: 85,
    severity: "Critical",
    accounts: ["SBI-8821"],
    reasoning:
      "Account linked to shell company registered 3 weeks ago with no business history. Rapid large transfers detected.",
    status: "Open",
    time: "2026-03-26 08:40",
  },
];

export const customers = [
  {
    id: 1,
    name: "Rajesh Kumar Sharma",
    account: "SBI-8821",
    bank: "State Bank of India",
    kyc: "Verified",
    risk: "Critical",
    type: "Corporate Director",
    since: "2019-04-12",
    phone: "+91 98765 43210",
    transactions: 48,
  },
  {
    id: 2,
    name: "Priya Mehta",
    account: "HDFC-3341",
    bank: "HDFC Bank",
    kyc: "Verified",
    risk: "High",
    type: "Individual",
    since: "2021-08-03",
    phone: "+91 87654 32109",
    transactions: 120,
  },
  {
    id: 3,
    name: "Global Trade Solutions Pvt Ltd",
    account: "ICICI-6612",
    bank: "ICICI Bank",
    kyc: "Pending Review",
    risk: "High",
    type: "Business",
    since: "2023-01-15",
    phone: "+91 22 4567 8901",
    transactions: 35,
  },
  {
    id: 4,
    name: "Mohammed Al-Rashid",
    account: "Canara-9921",
    bank: "Canara Bank",
    kyc: "Verified",
    risk: "High",
    type: "NRI Corporate",
    since: "2020-11-22",
    phone: "+971 50 123 4567",
    transactions: 67,
  },
  {
    id: 5,
    name: "Sunita Patel",
    account: "BOI-1190",
    bank: "Bank of India",
    kyc: "Expired",
    risk: "Medium",
    type: "Individual",
    since: "2018-06-08",
    phone: "+91 76543 21098",
    transactions: 12,
  },
  {
    id: 6,
    name: "TechVentures Pvt Ltd",
    account: "PNB-5572",
    bank: "Punjab National Bank",
    kyc: "Verified",
    risk: "Low",
    type: "Startup",
    since: "2022-09-30",
    phone: "+91 80 4321 0987",
    transactions: 89,
  },
];

export const customerTransactions = [
  {
    date: "2026-03-29",
    type: "Credit",
    amount: "₹1,21,000",
    counterparty: "Shell Corp XYZ",
    status: "Flagged",
  },
  {
    date: "2026-03-28",
    type: "Debit",
    amount: "₹70,000",
    counterparty: "HDFC-3341",
    status: "Flagged",
  },
  {
    date: "2026-03-27",
    type: "Debit",
    amount: "₹50,000",
    counterparty: "ICICI-6612",
    status: "Flagged",
  },
  {
    date: "2026-03-25",
    type: "Credit",
    amount: "₹31,000",
    counterparty: "Axis-0091",
    status: "Normal",
  },
  {
    date: "2026-03-20",
    type: "Debit",
    amount: "₹9,800",
    counterparty: "Vendor Enterprises",
    status: "Normal",
  },
];

export const cases = [
  {
    id: "CASE-2024-001",
    title: "Multi-Account Layering - Rajesh Kumar Sharma",
    status: "Investigating",
    priority: "Critical",
    assignee: "Ankit Verma",
    created: "2026-03-28",
    accounts: ["SBI-8821", "HDFC-3341", "Kotak-7782"],
  },
  {
    id: "CASE-2024-002",
    title: "Round-Trip Fraud Ring Detection",
    status: "Open",
    priority: "High",
    assignee: "Deepa Nair",
    created: "2026-03-27",
    accounts: ["HDFC-3341", "Axis-0091"],
  },
  {
    id: "CASE-2024-003",
    title: "Structuring Pattern - Cash Deposits",
    status: "Closed",
    priority: "Medium",
    assignee: "Rohan Shah",
    created: "2026-03-25",
    accounts: ["ICICI-6612"],
  },
  {
    id: "CASE-2024-004",
    title: "Cross-Border Suspicious Transfers",
    status: "Investigating",
    priority: "High",
    assignee: "Ankit Verma",
    created: "2026-03-26",
    accounts: ["Canara-9921"],
  },
  {
    id: "CASE-2024-005",
    title: "Dormant Account Suspicious Reactivation",
    status: "Open",
    priority: "Medium",
    assignee: "Priya Iyer",
    created: "2026-03-29",
    accounts: ["BOI-1190"],
  },
];

export const caseTimeline = [
  {
    time: "2026-03-29 09:14",
    event: "Alert triggered: Layering pattern detected",
    type: "alert",
  },
  {
    time: "2026-03-29 09:30",
    event: "Case created and assigned to Ankit Verma",
    type: "info",
  },
  {
    time: "2026-03-29 10:05",
    event: "Initial investigation started, 3 accounts frozen",
    type: "action",
  },
  {
    time: "2026-03-29 11:22",
    event: "Note added: Customer history reviewed, 3 prior alerts",
    type: "note",
  },
  {
    time: "2026-03-29 14:00",
    event: "FIU report draft generated by AI",
    type: "info",
  },
];

export const analyticsData = {
  riskTrend: [28, 35, 42, 38, 55, 48, 62, 70, 65, 78, 82, 90],
  transactionVolume: [
    420, 380, 510, 490, 620, 580, 710, 750, 680, 820, 900, 870,
  ],
  fraudFrequency: [3, 5, 4, 8, 6, 10, 9, 14, 11, 16, 18, 22],
  months: [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ],
};

export const chatMessages = [
  {
    id: 1,
    role: "bot",
    text: "नमस्ते! मैं FundShield AI Assistant हूँ। मैं fraud patterns analyze करने, cases summarize करने, और suspicious accounts के बारे में सवालों का जवाब देने में मदद कर सकता हूँ। आज मैं आपकी कैसे सहायता करूँ?",
    time: "09:00",
  },
  {
    id: 2,
    role: "user",
    text: "अभी के top 3 high-risk accounts दिखाओ",
    time: "09:01",
  },
  {
    id: 3,
    role: "bot",
    text: "📊 **Top 3 High-Risk Accounts:**\n\n1. **SBI-8821** (Rajesh Kumar Sharma) — Risk Score: 94/100 — Layering + Shell Company patterns\n2. **Canara-9921** (Mohammed Al-Rashid) — Risk Score: 85/100 — Cross-border anomaly\n3. **HDFC-3341** (Priya Mehta) — Risk Score: 88/100 — Round-trip fraud ring\n\nतीनों active investigation under हैं। FIU को तुरंत escalate करने की सिफारिश है।",
    time: "09:01",
  },
];
