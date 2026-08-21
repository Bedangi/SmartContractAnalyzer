export const documentData = {
  title: "Software Services Agreement",
  lastUpdated: "Oct 24, 2023",
  pages: "14 pages",
  plan: "Enterprise Plan",
};

export const legalSections = [
  {
    id: "section-12",
    title: "Section 12: Limitation of Liability",
    paragraphs: [
      {
        id: "12.1",
        text: "Except as otherwise provided in this Agreement, in no event will the Company or its affiliates be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
      },
      {
        id: "12.2",
        risk: "critical",
        text: "To the maximum extent permitted by applicable law, the Company's total cumulative liability to you or any third party for all claims arising out of or relating to this Agreement, whether in contract, tort, or otherwise, shall not exceed the total fees paid by you to the Company in the three (3) month period immediately preceding the event giving rise to the claim.",
      },
      {
        id: "12.3",
        text: "The limitations of liability set forth in this Section 12 shall apply even if the Company has been advised of the possibility of such damages and notwithstanding the failure of essential purpose of any limited remedy.",
      },
    ],
  },

  {
    id: "section-15",
    title: "Section 15: Governing Law & Jurisdiction",
    paragraphs: [
      {
        id: "15.1",
        risk: "warning",
        text: "This Agreement and any dispute or claim arising out of or in connection with it or its subject matter or formation shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to any choice or conflict of law provision or rule.",
      },
      {
        id: "15.2",
        text: "Any legal suit, action, or proceeding arising out of, or related to, this Agreement or the services shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware, in each case located in the City of Wilmington.",
      },
    ],
  },

  {
    id: "section-16",
    title: null,
    paragraphs: [
      {
        id: "16.1",
        text: "This document constitutes the entire agreement between the parties...",
        muted: true,
      },
    ],
  },
];

export const aiAnalysis = {
  criticalCount: 1,
  warningCount: 4,

  clauses: {
    "12.2": {
      title: "Liability Cap",
      riskLevel: "Critical Risk",

      translation:
        "If the company messes up, the most money you can ever get back is equal to what you paid them in the last 3 months.",

      risks: [
        "The liability limit is unusually low for enterprise software.",
        'It applies to "all claims," including data breaches and gross negligence.',
      ],

      impact:
        "If a major data breach costs your company $1M in damages, and you only pay $2k/month, you would only be eligible to recover $6k.",

      recommendations: [
        "Negotiate",
        "Opt-out Clause",
      ],

      expertInsight: {
        title: "Expert Insight",
        text: "Industry standard for these agreements is usually 12 months or a fixed amount like $100k, whichever is higher.",
      },
    },

    "15.1": {
      title: "Governing Law",
      riskLevel: "Moderate Risk",

      translation:
        "Any dispute related to this agreement must be handled under Delaware law and brought before courts located in Wilmington, Delaware.",

      risks: [
        "The agreement restricts disputes to a specific jurisdiction.",
        "Litigation in Delaware may increase legal costs for companies based elsewhere.",
      ],

      impact:
        "If a dispute arises, your company may need to hire local legal counsel and participate in proceedings in Delaware.",

      recommendations: [
        "Negotiate",
        "Accept Clause",
      ],

      expertInsight: {
        title: "Expert Insight",
        text: "Exclusive jurisdiction clauses are common in commercial agreements, but companies often negotiate for a mutually convenient jurisdiction.",
      },
    },
  },
};

export const aiSuggestions = [
  "Suggest a redline",
  "Check GDPR compliance",
  "Is this market standard?",
];