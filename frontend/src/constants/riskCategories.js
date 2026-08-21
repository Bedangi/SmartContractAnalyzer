export const RISK_CATEGORY_MAP = {
  "Limitation of liability": {
    name: "Limited Company Responsibility",
    shortName: "Company Responsibility",
    description:
      "Limits the company's responsibility for losses or damages.",
  },

  "Unilateral termination": {
    name: "Service Can Be Terminated",
    shortName: "Termination Rights",
    description:
      "Allows one side, often the company, to end the agreement.",
  },

  "Unilateral change": {
    name: "Company Can Change Terms",
    shortName: "Term Changes",
    description:
      "Allows the company to change the terms without direct agreement.",
  },

  "Content removal": {
    name: "Content Can Be Removed",
    shortName: "Content Removal",
    description:
      "Allows content, accounts, or user material to be removed.",
  },

  "Contract by using": {
    name: "Agreement by Using the Service",
    shortName: "Using Means Agreement",
    description:
      "Treats continued use of the service as acceptance of the terms.",
  },

  "Choice of law": {
    name: "Which Laws Apply",
    shortName: "Applicable Laws",
    description:
      "Determines which country's or state's laws govern the agreement.",
  },

  "Jurisdiction": {
    name: "Where Legal Disputes Happen",
    shortName: "Legal Location",
    description:
      "Determines where legal disputes must be handled.",
  },

  "Arbitration": {
    name: "Private Dispute Resolution",
    shortName: "Arbitration",
    description:
      "Requires disputes to be resolved through arbitration instead of ordinary court proceedings.",
  },
};

export function getRiskCategory(category) {
  return (
    RISK_CATEGORY_MAP[category] || {
      name: category,
      shortName: category,
      description: "Risk category detected by the analysis model.",
    }
  );
}