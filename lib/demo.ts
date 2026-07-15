import type { DecisionAnalysis } from "./schema";
export const demoAnalysis: DecisionAnalysis = {
  title: "Join the early-stage startup?",
  summary:
    "The offer has real career upside, but only if financial resilience and the company’s runway are verified before making an irreversible commitment.",
  perspectives: {
    optimist: {
      position: "A high-leverage career move",
      keyArguments: [
        "A 40% increase accelerates earning capacity.",
        "Early-stage ownership can compound learning and scope.",
        "New skills can increase future employability.",
      ],
      strongestInsight:
        "The upside is more than salary if the role expands your career capital.",
      mainConcern: "Learning value must be concrete, not promised.",
      confidence: 76,
    },
    skeptic: {
      position: "The visible raise can hide concentrated downside",
      keyArguments: [
        "Income may be less durable than it appears.",
        "Financial commitments reduce room for a failed bet.",
        "Startup quality is not established by an offer.",
      ],
      strongestInsight:
        "A raise is not equivalent to reliable long-term income.",
      mainConcern: "Runway and fallback options are unknown.",
      confidence: 82,
    },
    riskAnalyst: {
      position: "Proceed only after reducing downside",
      keyArguments: [
        "Emergency reserves change the risk materially.",
        "A written compensation and severance picture matters.",
        "A short tenure can be recoverable with a clear re-entry plan.",
      ],
      strongestInsight:
        "This is a reversible trial only with sufficient runway and employability.",
      mainConcern: "Income interruption during a downturn.",
      confidence: 84,
    },
    longTermStrategist: {
      position: "Optimize for transferable career capital",
      keyArguments: [
        "Scope and mentorship may outweigh short-term salary.",
        "The decision is stronger if it matches a 3–5 year goal.",
        "A deliberate option to return preserves flexibility.",
      ],
      strongestInsight:
        "Choose the path that compounds options, not just this year’s pay.",
      mainConcern: "Trading stability for learning without a defined return.",
      confidence: 78,
    },
  },
  debate: {
    agreements: [
      "The startup’s learning upside could be meaningful.",
      "Financial resilience is the key gating factor.",
      "More evidence on runway would improve the decision.",
    ],
    disagreements: [
      "Optimist weights growth more heavily; Skeptic weights income reliability.",
      "Agents differ on whether a short startup stint is career-positive by default.",
    ],
    strongestArgumentFor:
      "The role may create faster skill and responsibility compounding than the current job.",
    strongestArgumentAgainst:
      "A salary increase does not protect against job loss when monthly obligations are high.",
    unresolvedQuestions: [
      "How many months of expenses are saved?",
      "What is the startup’s runway and funding status?",
      "What would a return to the current market look like?",
    ],
  },
  scenarios: {
    thirtyDays: {
      bestCase:
        "You validate the team, scope, and financial terms before joining.",
      likely:
        "You gain clarity on culture and runway while planning the transition.",
      worstCase: "Important risk signals are discovered after resignation.",
      assumptions: ["Offer terms are accurate", "Due diligence is possible"],
      signals: ["Runway transparency", "Written role scope"],
    },
    oneYear: {
      bestCase:
        "You have expanded responsibility, stronger skills, and higher income.",
      likely:
        "You have learned quickly but faced volatility and shifting priorities.",
      worstCase: "The company contracts and forces an abrupt job search.",
      assumptions: ["The startup retains funding", "Role scope grows"],
      signals: ["Revenue trajectory", "Leadership turnover"],
    },
    fiveYears: {
      bestCase:
        "The experience compounds into senior roles or founder-level credibility.",
      likely: "You have stronger startup fluency and a broader network.",
      worstCase: "Repeated instability delays financial milestones.",
      assumptions: ["Skills remain transferable", "Market stays accessible"],
      signals: ["Portfolio of outcomes", "Savings rate"],
    },
  },
  risks: [
    {
      name: "Income interruption",
      description:
        "A funding or performance event could end compensation unexpectedly.",
      probability: "Medium",
      impact: "High",
      mitigation: "Build 6–9 months of expenses and verify runway.",
      reversible: true,
    },
    {
      name: "Opportunity cost",
      description:
        "Leaving a stable platform may slow near-term financial goals.",
      probability: "Medium",
      impact: "Medium",
      mitigation: "Set a 12-month review point and keep network warm.",
      reversible: true,
    },
    {
      name: "Burnout",
      description:
        "Early-stage ambiguity can create sustained workload pressure.",
      probability: "Medium",
      impact: "Medium",
      mitigation: "Confirm expectations, team size, and decision rights.",
      reversible: true,
    },
  ],
  opportunities: [
    "Faster ownership and learning",
    "Meaningful compensation growth",
    "Stronger startup network",
  ],
  blindSpots: [
    "You may be treating the raise as guaranteed long-term income.",
    "The emotional cost of instability is not yet quantified.",
    "A return path to your current field needs evidence, not assumption.",
  ],
  reversibility: {
    classification: "Partially reversible",
    explanation:
      "You can change jobs again, but a sudden income gap has a real cost when commitments are high.",
    irreversibleConsequences: [
      "Potential disruption to savings goals",
      "Loss of tenure and stability",
    ],
  },
  score: {
    overall: 64,
    dimensions: [
      {
        name: "Upside potential",
        score: 79,
        explanation: "Compelling salary and skill upside.",
      },
      {
        name: "Downside exposure",
        score: 43,
        explanation: "Commitments magnify instability.",
      },
      {
        name: "Goal alignment",
        score: 72,
        explanation: "Strong if learning is your priority.",
      },
      {
        name: "Reversibility",
        score: 61,
        explanation: "Recoverable with reserves and a re-entry plan.",
      },
      {
        name: "Evidence quality",
        score: 52,
        explanation: "Runway and role details need validation.",
      },
      {
        name: "Long-term value",
        score: 74,
        explanation: "Potentially strong transferable experience.",
      },
    ],
  },
  recommendation: {
    verdict: "Proceed with conditions",
    confidence: 78,
    reasoning:
      "The opportunity is worth pursuing if you can protect the downside first. The score is a heuristic decision-support indicator, not an objective prediction.",
    conditions: [
      "Maintain at least six months of essential expenses.",
      "Confirm runway, funding, and role scope with leadership.",
      "Create a credible 12-month fallback plan.",
    ],
    nextSteps: [
      "Request a candid runway and revenue conversation.",
      "Calculate a downside budget and emergency reserve target.",
      "Speak with two current or former employees.",
    ],
    whatWouldChangeMyMind: [
      "Less than three months of available savings.",
      "Unclear runway or evasive leadership.",
      "A role that offers no material skill or scope expansion.",
    ],
  },
};
