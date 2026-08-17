export const recommendationData = {
  target: "SocialNet Plus",
  agreement: "Service Agreement",
  reliabilityScore: 94,

  summary:
    'Analysis indicates that while SocialNet Plus offers robust data encryption, its "Third-party sharing" clauses are significantly more aggressive than industry standards.',

  tags: [
    {
      label: "High Risk: Data Liquidity",
      type: "error",
    },
    {
      label: "Action Required",
      type: "secondary",
    },
  ],

  actionableSteps: [
    {
      id: 1,
      text: (
        <>
          Implement{" "}
          <strong>user opt-out controls</strong> for non-essential
          behavioral tracking APIs.
        </>
      ),
    },
    {
      id: 2,
      text: (
        <>
          Refine "Section 8.2" to limit data retention to{" "}
          <strong>24 months</strong> instead of indefinite.
        </>
      ),
    },
    {
      id: 3,
      text: (
        <>
          Add clear disclosure for{" "}
          <strong>automated payment renewals</strong> to prevent
          chargeback disputes.
        </>
      ),
    },
  ],
};

export const comparisonCompanies = [
  {
    id: "socialnet",
    name: "SocialNet Plus",
    abbreviation: "SN",
    type: "current",
  },
  {
    id: "safeconnect",
    name: "SafeConnect",
    abbreviation: "SC",
    type: "competitor",
  },
  {
    id: "privacyhub",
    name: "PrivacyHub",
    abbreviation: "PH",
    type: "competitor",
  },
];

export const comparisonRows = [
  {
    id: "privacy",
    feature: "Privacy",
    description: "Encryption & Anonymization",

    values: {
      socialnet: {
        icon: "verified",
        title: "AES-256",
        description:
          "Standard military-grade encryption for all stored data.",
        type: "safe",
      },

      safeconnect: {
        icon: "verified",
        title: "AES-256",
        description:
          "Matching industry standards for data protection.",
        type: "safe",
      },

      privacyhub: {
        icon: "gpp_maybe",
        title: "AES-128",
        description:
          "Lags behind with older encryption protocols.",
        type: "neutral",
      },
    },
  },

  {
    id: "collection",
    feature: "Data Collection",
    description: "Scope of PII gathering",

    values: {
      socialnet: {
        title: "Aggressive",
        description:
          "Collects biometric and device telemetry by default.",
        type: "danger",
      },

      safeconnect: {
        title: "Minimal",
        description:
          "Only basic identity data required for service.",
        type: "safe",
      },

      privacyhub: {
        title: "Moderate",
        description:
          "Collects location and interaction history.",
        type: "neutral",
      },
    },
  },

  {
    id: "sharing",
    feature: "Data Sharing",
    description: "Third-party distribution",

    values: {
      socialnet: {
        icon: "warning",
        title: "High Velocity",
        description:
          "Shared with 40+ ad-tech partners.",
        type: "danger",
      },

      safeconnect: {
        icon: "shield",
        title: "No Sharing",
        description:
          "Policy explicitly forbids third-party sale.",
        type: "safe",
      },

      privacyhub: {
        icon: "info",
        title: "Limited",
        description:
          'Shared with "Essential Partners" only.',
        type: "neutral",
      },
    },
  },

  {
    id: "payments",
    feature: "Payments",
    description: "Billing transparency",

    values: {
      socialnet: {
        title: "Auto-renew active",
        description:
          "Hidden cancellation paths flagged.",
        type: "neutral",
      },

      safeconnect: {
        title: "Pre-billing alerts",
        description:
          "Sends reminder 7 days before charge.",
        type: "safe",
      },

      privacyhub: {
        title: "Prorated refunds",
        description:
          "Offers generous refund windows.",
        type: "safe",
      },
    },
  },
];

export const verdicts = {
  socialnet: {
    title: "Proceed with Caution",
    description:
      "Require contractual modifications to Section 8 & 12 before signature.",
    type: "danger",
  },

  safeconnect: {
    title: "Highly Recommended",
    description:
      "Best-in-class privacy protections. Safest alternative available.",
    type: "safe",
  },

  privacyhub: {
    title: "Neutral Standing",
    description:
      "Acceptable for non-critical enterprise use cases.",
    type: "neutral",
  },
};