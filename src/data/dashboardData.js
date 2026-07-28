export const analysisData = {
  company: {
    name: "SocialNet Plus",
    icon: "hub",
  },

  score: 78,

  status: "Analysis Complete",

  description:
    "The Terms of Service for SocialNet Plus have been scanned using LexisAI v4.0. We've identified several critical clauses regarding user data ownership.",

  verification: {
    verified: true,
    label: "AI Verified",
  },

  lastUpdated: "Updated 2h ago",
};

export const executiveSummaryData = {
  summary:
    "The agreement contains broad indemnification requirements and allows unilateral changes to pricing without notice. Data retention policies are ambiguous.",

  readingTime: "15m",

  recommendation: {
    label: "AI Recommendation",
    value: "Exercise Caution",
    severity: "critical",
  },
};

export const riskData = [
  {
    id: 1,
    title: "Privacy",
    description: "Data collection transparency",
    score: 92,
    icon: "shield_person",
    theme: "secondary",
  },
  {
    id: 2,
    title: "Liability",
    description: "Contractual responsibility",
    score: 45,
    icon: "account_balance_wallet",
    theme: "error",
  },
  {
    id: 3,
    title: "Termination",
    description: "Exit strategy flexibility",
    score: 68,
    icon: "cancel_schedule_send",
    theme: "primary",
  },
  {
    id: 4,
    title: "IP Ownership",
    description: "Creative rights retention",
    score: 84,
    icon: "copyright",
    theme: "secondary",
  },
];

export const clauseData = [
  {
    id: 1,
    title: "Indemnification",
    riskLevel: "Critical Risk",
    riskType: "critical",
    text: "...user shall defend, indemnify and hold harmless SocialNet Plus against all claims, costs, damages, losses, expenses, including attorneys’ fees...",
  },
  {
    id: 2,
    title: "Force Majeure",
    riskLevel: "Moderate Risk",
    riskType: "moderate",
    text: "SocialNet Plus is not liable for performance failures due to events beyond its reasonable control, including but not limited to, global health crises...",
  },
];

export const comparisonData = [
  {
    id: 1,
    name: "ConnectGrid",
    category: "Social Infrastructure",
    score: 94,
    rating: "Excellent",
    icon: "connect_without_contact",
  },
  {
    id: 2,
    name: "OpenCircle",
    category: "Privacy-First Network",
    score: 89,
    rating: "Great",
    icon: "group_work",
  },
];