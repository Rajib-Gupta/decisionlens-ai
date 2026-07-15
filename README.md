# DecisionLens AI

DecisionLens AI is a decision-intelligence web app that turns an important choice into a structured decision brief, then lets you manage the full decision lifecycle in a workspace.

## What It Does

- Captures a decision with category, goals, constraints, concerns, and context.
- Runs structured multi-lens analysis (Optimist, Skeptic, Risk Analyst, Long-Term Strategist).
- Produces an executive-style brief with recommendation, conditions, risks, and next actions.
- Saves each analyzed decision into a persistent workspace.
- Supports ongoing decision operations: evidence logging, action tracking, status updates, deadlines, re-analysis, and outcome learning.
- Includes a weighted compare tool for evaluating alternatives against priorities.

## Product Functionality

### 1. Intake and Analysis Flow

- Analyze form at `/analyze` collects a decision statement and optional context fields.
- A local draft is stored in browser storage and analyzed on `/analysis/[id]`.
- Analysis progress UI shows staged reasoning steps.
- On completion, the app attempts to create a persistent workspace and exposes an `Open workspace` action.

### 2. Decision Brief Output

Generated brief sections include:

- Recommendation and reasoning.
- Score and score dimensions.
- Independent perspective cards.
- Debate synthesis (agreements, disagreements, strongest pro/con).
- Scenario simulation for 30 days, 1 year, and 5 years.
- Risk matrix with probability/impact/mitigation.
- Blind spots, unresolved questions, and reversibility assessment.
- Next steps and "what would change my mind" checkpoints.

### 3. Workspace Lifecycle Management

Workspace screen at `/decisions/[id]` supports:

- Status tracking across lifecycle states.
- Deadline updates.
- Action plan management:
	- Add actions.
	- Mark actions complete.
- Evidence locker:
	- Add evidence items with type, stance, and confidence.
- Outcome logging:
	- Record chosen option and real-world result.
- Change log / activity timeline.

### 4. Saved Workspaces and History

- `/history` lists all non-deleted workspaces for the current browser owner cookie.
- Workspaces are sorted by latest update.

### 5. Re-analysis With New Evidence

- Endpoint supports re-analysis of an existing workspace using accumulated evidence.
- Each re-analysis stores:
	- Full new analysis snapshot.
	- Version history entry.
	- Change summary vs previous recommendation.
	- Activity log event.

### 6. Compare Alternatives Tool

- `/compare` provides a weighted matrix for option comparison.
- Users can:
	- Edit alternatives.
	- Adjust priority weights.
	- See weighted fit ranking and simple what-if behavior.

### 7. Demo/Degraded Mode

- If `OPENAI_API_KEY` is missing, analysis falls back to bundled demo output so UX remains explorable.

## Route Map

### UI Routes

- `/` Home and product overview.
- `/about` Method and limitations.
- `/analyze` Decision intake form.
- `/analysis/[id]` Analysis progress + generated brief.
- `/decisions/[id]` Persistent workspace.
- `/history` Saved workspaces.
- `/compare` Weighted comparison matrix.

### API Routes

- `POST /api/decisions/analyze`
	- Validates decision input and runs AI analysis.
- `POST /api/decisions/clarify`
	- Returns up to three clarifying prompts based on missing fields.
- `GET /api/briefs`
	- Lists saved workspaces for owner.
- `POST /api/briefs`
	- Creates a new workspace from input + optional analysis.
- `GET /api/briefs/[id]`
	- Loads one workspace.
- `PATCH /api/briefs/[id]`
	- Updates workspace fields (status/deadline/context/tags/action/evidence/outcome).
- `DELETE /api/briefs/[id]`
	- Soft-deletes a workspace.
- `POST /api/briefs/[id]/reanalyze`
	- Re-runs analysis using current workspace context + evidence.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Zod for schema validation
- MongoDB for persistence
- OpenAI Responses API for analysis generation
- Vitest for tests

## Data and Ownership Model

- Persistence uses MongoDB collection `decisions`.
- App uses an anonymous owner cookie (`dl_owner`) instead of user accounts.
- Workspace links now recover owner context by workspace id when needed, then reset the owner cookie for continued access in the current browser.

## Local Development

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create `.env.local` and set:

```bash
OPENAI_API_KEY=your_openai_key
MONGODB_URI=your_mongodb_connection_string
```

Notes:

- Without `OPENAI_API_KEY`, the app uses demo analysis output.
- Without `MONGODB_URI`, workspace persistence endpoints will fail.

### 3. Run

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Quality Commands

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Known Limitations

- Decision scores are heuristic aids, not objective truth.
- Scenario output is simulated reasoning, not prediction.
- This tool is not a substitute for legal, medical, emergency, or professional financial advice.

## Screenshots

<img width="1907" height="870" alt="image" src="https://github.com/user-attachments/assets/6c05b501-4ff9-415b-b07d-5d78e05b795e" />
<img width="1905" height="870" alt="image" src="https://github.com/user-attachments/assets/d8486378-2278-41df-8bda-4298946b0b35" />
