# DecisionLens AI

DecisionLens AI is a decision-intelligence MVP that turns a consequential choice into a structured executive brief: independent perspectives, debate synthesis, scenario simulation, risk matrix, blind spots, reversibility, and next steps.

## Features

- Premium responsive decision dashboard, not a chat interface
- Progressive decision intake and locally saved briefs
- Server-side OpenAI Responses API integration with Zod validation
- Four distinct lenses: Optimist, Skeptic, Risk Analyst, Long-Term Strategist
- Debate, 30-day/1-year/5-year scenario simulation, risks, score dimensions, and conditions
- Explicit limitations and decision-support framing

## Architecture

Next.js App Router provides the UI and route handlers. `lib/schema.ts` is the shared validation contract; `app/api/decisions/analyze` performs server-side model calls and validates the result. Browser localStorage stores MVP history. When no `OPENAI_API_KEY` is configured, the app transparently renders the included demonstration brief so the hackathon flow remains explorable.

## Local setup

```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY to .env.local for live analysis
npm run dev
```

Run `npm run typecheck`, `npm test`, and `npm run build` before release.

## AI workflow

The decision is validated, sent only from the server, analyzed in structured JSON, and parsed with Zod before rendering. Invalid output and API errors return safe failures; the interface never exposes an API key.

## Limitations

Scores are heuristic aids, not objective measures. Scenarios are not predictions. This product must not be used as a substitute for qualified medical, legal, emergency, or financial advice.

## Hackathon pitch

Most AI decision tools are chat prompts. DecisionLens makes the reasoning inspectable: it stages independent arguments, shows their tensions, exposes uncertainty, and turns reflection into an actionable decision brief.

## Screenshots

_Add product screenshots here before submission._
