export const decisionStatuses = ["Exploring","Gathering information","Ready to decide","Decided — proceed","Decided — do not proceed","Postponed","In progress","Completed","Outcome recorded"] as const;
export type DecisionStatus = typeof decisionStatuses[number];
