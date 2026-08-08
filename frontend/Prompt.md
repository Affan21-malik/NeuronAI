# NeuronAI — Frontend Implementation Prompt

## AI Tools Used

- **ChatGPT** — Used for requirement analysis, feature planning, UI/UX guidance, debugging guidance, prompt generation, and consolidating frontend requirements.
- **Antigravity** — Used to implement, modify, test, and refine the NeuronAI frontend according to the generated requirements/prompts.

> Backend/API integration for the AI interview agents will be handled separately by the backend developer.

---

# 1. Authentication — Complete Flow

Implement and maintain a proper frontend authentication flow.

Public users should have:

- Landing Page
- Sign In
- Sign Up
- Forgot Password
- Continue with Google

Email/password authentication must use the existing frontend auth service/state.

Login must verify BOTH the registered email and password.

If the email does not exist:

> Account not registered

If the email exists but the password is incorrect:

> Incorrect email or password

Wrong credentials must NEVER authenticate the user.

Only the exact registered email + password should authenticate the user.

---

# 2. Reset Old Test Authentication Data

Clear/reset previously created stale/test authentication accounts and sessions once.

Do NOT delete unrelated application data.

After reset:

- No old hardcoded/default test account
- No stale authentication session
- User must create a fresh account

After a fresh signup, that account must persist normally.

Do not keep permanently hardcoded test credentials.

---

# 3. Sign Up Validation

Signup should contain:

- First Name
- Last Name
- Email
- Password
- Confirm Password
- Optional Profile Photo

Do NOT force profile-photo upload during initial signup.

Password requirements must update live while typing:

- Minimum 8 characters
- At least one uppercase
- At least one lowercase
- At least one number
- Confirm password must match

Do not show every requirement as an error before the user starts typing.

The Create Account button should only become available when all required conditions are satisfied.

---

# 4. Email Validation

Do not immediately show an invalid-email error when the user has only started typing.

Allow normal typing such as:

- `a`
- `af`
- `aff`
- `test`

Validate the email appropriately once the value can reasonably be considered an email.

A valid email should contain a proper structure such as:

`username@domain.com`

Validation should account for:

- `@`
- Valid domain
- Valid extension

Show validation feedback naturally while typing.

---

# 5. Email OTP

When a new account is created:

- Start email OTP verification.
- Use a 6-digit OTP.
- Auto-advance OTP inputs.
- Provide resend OTP.
- Provide resend countdown.

Forgot Password should also use an OTP-based reset flow.

---

# 6. Username Setup

Username setup happens AFTER account creation/verification.

Do NOT put username creation inside the initial signup form.

After account creation:

> Show Username Setup

The username can be suggested from the user's actual name.

The actual user's name must NEVER be hardcoded.

Username requirements:

- 3–20 characters
- Letters, numbers, underscore
- No spaces
- Availability validation

Save the final username to the user's account.

---

# 7. Profile Photo and Default Avatar

Profile photo is optional.

If the user uploads a profile photo:

> Display the uploaded photo.

If no photo is uploaded:

> Generate an avatar using the first letter of First Name + first letter of Last Name.

Example only:

`Example User` → `EU`

Do NOT hardcode any real user's initials.

The avatar must automatically use the actual user's name.

---

# 8. Profile Editing

Authenticated profile should display:

- First Name
- Last Name
- Username
- Email
- Avatar

Allow editing of:

- Name
- Username

When saved:

> Persist the changes.

After logout and re-login, the updated name and username must still appear.

Do NOT restore stale signup data.

---

# 9. Google Sign-In

The Continue with Google option must NOT show fake hardcoded Google accounts.

Do NOT display examples such as:

- account1@gmail.com
- account2@gmail.com

The real Google authentication/provider flow should eventually allow the user to choose an actual Google account.

Keep the frontend integration ready for later backend/auth-provider integration.

Do NOT hardcode a fake Google username or email.

---

# 10. Public Landing Page

When the user is NOT authenticated:

> Show the public NeuronAI Landing Page.

Landing page contains the existing NeuronAI branding and landing content.

Buttons such as:

- Start AI Interview
- Explore

should lead to Sign In / Sign Up.

After successful authentication:

> Open Dashboard.

---

# 11. Landing Navigation for Authenticated Users

After login:

> Hide the Landing/Home navigation option.

Authenticated navigation should contain the private application sections such as:

- Dashboard
- Interview
- Reports
- Knowledge Map
- Skill Gap
- History
- Settings/Profile if already present

If an authenticated user manually opens the public Landing route:

> Redirect to Dashboard.

---

# 12. Session Persistence

Closing the browser tab/window must NOT log the user out.

If the user is authenticated:

`Close tab → Reopen website → Restore session → Dashboard`

Do NOT show Landing Page.

Do NOT ask the user to sign in again.

Only explicit Logout should clear the authentication session.

Logout:

`Logout → Clear session → Landing Page`

---

# 13. New User Zero-Progress State

A new account must start with:

- Readiness: 0%
- Interviews: 0
- Streak: 0
- Questions Answered: 0
- Knowledge Map: Not Assessed
- Skill Gap: Not Assessed
- Final Score: —
- Confidence: —
- Other evaluation metrics: Not Assessed

Do NOT show fake completed interview scores for a new user.

---

# 14. Fixed Sidebar and Main Content Scrolling

The authenticated layout should have:

### Fixed

- Header/navigation
- Left sidebar/navigation

### Scrollable

- Main content only

When the user scrolls the main content:

> Sidebar options must remain fixed.

The following must NOT scroll away:

- Dashboard
- Interview
- Reports
- Knowledge Map
- Skill Gap
- History

Only the main content area should scroll.

---

# 15. Before / During / After Interview Lifecycle

The lifecycle:

`Before → During → After`

must NOT be manually selectable.

It must be based on actual interview state and current page.

### Non-Interview Pages

Dashboard, Reports, Knowledge Map, Skill Gap, History, Settings:

> Before / Pre-Interview

### Active Interview Page

> During

Show:

`Q1 / 10`, `Q2 / 10`, etc.

### Completed Interview

> After

The user must NOT manually switch Before/During/After.

---

# 16. Interview Navigation Behavior

If the user is inside an active interview and moves to another page:

> Dashboard should show Before.

The Dashboard must not show During merely because an interview session exists.

If an actual active interview is intentionally resumed through the appropriate resume behavior:

> Continue the existing session.

However, entering Interview through the main Interview navigation to start a NEW interview must show AI-agent selection again.

---

# 17. AI Interview Agents

Before every NEW interview, the candidate must choose ONE AI interviewer.

Three agents:

### JARVIS — Precision-Focused

**Personality:**
Calm, composed, intelligent, precise, systematic, reliable.

**Communication:**
Professional, concise, information-focused.

**Behavior:**
Analytical, structured, task-oriented, accuracy-focused.

**Role:**
Precision-focused technical interviewer emphasizing:

- Technical correctness
- Architecture
- Engineering decisions
- Accuracy

**Tagline:**
Precision & Technical Correctness

### FRIDAY — Adaptive & Conversational

**Personality:**
Responsive, adaptive, observant, context-aware, supportive.

**Communication:**
Natural, conversational, clear.

**Behavior:**
Responds according to changing situations and candidate context.

**Role:**
Adaptive interviewer focusing on:

- Candidate reasoning
- Context
- Natural conversation
- Contextual follow-up questions

**Tagline:**
Adaptability & Conversation

### ULTRON — Analytical & Challenging

**Personality:**
Highly analytical, autonomous, persistent, confident, skeptical.

**Communication:**
Direct, assertive, analytical.

**Behavior:**
Challenges assumptions, identifies weaknesses and probes deeper.

**Role:**
Technical stress-test interviewer focusing on:

- Edge cases
- Trade-offs
- Limitations
- Technical depth
- Challenging assumptions

**Tagline:**
Depth & Technical Challenge

Only useful analytical/challenging traits should be adapted. Do not include destructive fictional behavior.

---

# 18. AI Agent Selection UI

Before starting a NEW interview, show:

> Choose Your AI Interviewer

Display three selectable cards:

- JARVIS — Precision & Technical Correctness
- FRIDAY — Adaptability & Conversation
- ULTRON — Depth & Technical Challenge

Each card should have:

- Agent name
- Short description
- Personality/communication summary
- Relevant icon/avatar
- Selected/unselected state

Only one agent can be selected.

The selected card should use the existing NeuronAI active/glow styling.

Start Interview remains disabled until an agent is selected.

---

# 19. AI Agent Selection Must Reset for New Interviews

The selected agent is NOT a permanent user preference.

It belongs to an individual interview session.

Example:

`Dashboard → Interview → Choose Agent → JARVIS → Start Interview`

Then:

`Leave Interview → Dashboard → Interview`

The user must see:

> Choose Your AI Interviewer

again.

JARVIS must NOT automatically remain selected.

A new interview should initialize:

`selectedAgent = null`

until the user chooses an agent.

---

# 20. Active Interview Session

Once an interview starts:

> Do NOT ask for agent selection before every question.

The selected agent remains attached to that interview session.

Example:

`JARVIS → Q1 → Q2 → Q3 → ... → Q10`

If the SAME active interview is intentionally resumed:

> Continue with the same selected agent.

When starting a NEW interview:

> Show agent selection again.

---

# 21. Interview Progress Graph

The Interview Progress graph must be completely dynamic.

There are 10 questions:

`Q1 → Q10`

Before any answer:

> No score points.

After Q1 answer:

> Show only Q1 score.

After Q2:

> Show Q1 + Q2.

After Q3:

> Show Q1 + Q2 + Q3.

Continue until Q10.

NEVER show scores for unanswered questions.

Example:

Q1 answered:

`Q1 = 78`

Graph:

`Q1 ● 78`

Q2–Q10 remain empty.

After Q2:

`Q1 ● 78`
`Q2 ● 84`

The graph must update immediately after every submitted answer.

Do NOT use static/mock future scores.

---

# 22. Question Number and Score Synchronization

The graph and interview progress must use the same source of truth.

Example:

Current Question = Q1

Submit answer:

1. Save Q1 answer.
2. Calculate/store Q1 score.
3. Display Q1 score.
4. Move to Q2.

Current Question = Q2

Submit answer:

1. Save Q2 answer.
2. Display Q1 + Q2 scores.
3. Move to Q3.

Continue through Q10.

---

# 23. Live Knowledge Map Radar

Maintain the Live Knowledge Map radar chart with:

- White continuous polygon outline
- Purple radar filled area
- Radar grid
- Existing labels
- Existing Live Radar badge
- Existing NeuronAI styling

Do NOT replace the polygon with a single point.

If radar points are interactive:

Axes include:

- RAG Architecture
- Vector Search
- Prompt Engineering
- MCP Protocols
- Agentic Loops
- LLM Ops

Dragging a point:

- Outward = higher value
- Inward = lower value

The white polygon and purple fill must update live.

Points must move smoothly.

Do NOT snap/jump between vertices.

Do NOT programmatically move the user's mouse.

---

# 24. Custom Cursor

Use ONLY the NeuronAI custom cursor.

Hide the native browser cursor.

Cursor consists of:

- Small outer circle
- Transparent center
- Small center dot

Outer circle and center dot must move together perfectly.

On interactive elements:

> Outer circle may smoothly enlarge.

Do NOT turn the cursor into a large filled white/black circle.

The underlying page content must remain visible.

---

# 25. Custom Cursor Invert Effect

The cursor should behave like a transparent inverted/contrast lens.

Example:

Normal:

`WHITE TEXT`

When the cursor moves over it:

> The portion of the white text INSIDE the cursor circle should visually become BLACK.

Outside the circle:

> Text remains WHITE.

Similarly:

`BLACK TEXT → WHITE inside cursor circle`

IMPORTANT:

The cursor circle itself must NOT become a filled white/black circle.

The underlying content must remain visible.

Only the content inside the circular cursor area should have the inversion/contrast effect.

If a blend-mode implementation creates a large filled circle or hides content:

> Remove/fix that implementation.

Priority:

1. Transparent outer circle
2. Center dot
3. Underlying content visible
4. Correct clipped inversion effect

---

# 26. Cursor Movement

Outer circle + center dot must use the same mouse coordinates.

There must be no separation where the outer circle moves differently from the inner dot.

Both must remain centered.

Native browser cursor must remain hidden.

---

# 27. Profile and User Data Persistence

All authenticated user information must belong to the correct account.

Never show another user's:

- Name
- Username
- Email
- Avatar
- Progress
- Interview history
- Scores

When a user edits their profile:

> Save it permanently for that account.

After logout and re-login:

> Updated information must appear.

Do NOT restore stale signup data.

---

# 28. Data Separation

Each user should have separate:

- Profile
- Username
- Progress
- Interview sessions
- Scores
- Agent/session information
- History

Do not use one global mock user for every account.

---

# 29. Frontend / Backend Boundary

Current implementation is frontend-only.

Do NOT modify FastAPI/backend.

For AI agents use stable IDs:

- `jarvis`
- `friday`
- `ultron`

The backend developer will later use these IDs for the actual AI persona behavior.

Frontend only needs to:

- Display agents
- Allow selection
- Store selected agent in the current interview session
- Keep the selected agent backend-ready
- Display the selected agent during the interview

Do NOT implement actual AI persona intelligence in the frontend.

---

# 30. Final End-to-End Flow

## New User

`Open Website → Landing`

`Start AI Interview / Explore → Sign Up`

`Email Verification → Username Setup → Welcome → Dashboard`

Dashboard:

- 0% progress
- 0 interviews
- 0 streak
- Not Assessed
- No fake scores

## Existing User

`Landing → Sign In → Correct Email + Password → Dashboard`

Wrong password:

> Login rejected

Wrong/unregistered email:

> Login rejected

## Session

`Login → Dashboard`

Close browser/tab:

`Reopen → Dashboard`

No login again.

Explicit Logout:

`Logout → Landing`

## Interview

`Dashboard → Interview`

`Choose AI Interviewer`

`JARVIS / FRIDAY / ULTRON`

`Select → Start Interview`

`Q1 → Answer → Q1 score`

`Q2 → Answer → Q2 score`

Continue until Q10.

After completion:

`After → Final Evaluation / Report`

## New Interview

After previous interview ends:

`Dashboard → Interview`

`Choose AI Interviewer AGAIN`

Previous agent must NOT automatically be selected.

---

# 31. UI Preservation

Preserve the existing NeuronAI design:

- Dark cyber aesthetic
- Purple/indigo glow
- Glassmorphism
- Existing typography
- Existing animations
- Existing cards
- Existing navigation
- Existing branding

Do NOT unnecessarily redesign existing pages.

---

# 32. Final Verification Checklist

## Authentication

- Fresh signup works
- Email validation works
- Password validation works
- OTP works
- Username setup works
- Optional avatar works
- Default initials avatar works
- Correct login works
- Wrong password is rejected
- Unregistered email is rejected
- Logout works
- Session persists after tab close

## Navigation

- Landing visible when logged out
- Landing hidden after login
- Authenticated user cannot access public Landing directly
- Sidebar remains fixed
- Main content scrolls

## Interview

- Before state before interview
- Agent selection before every NEW interview
- JARVIS works
- FRIDAY works
- ULTRON works
- Agent selection resets for new interviews
- Active session behavior works
- During state while interview is active
- Question counter follows actual question
- After state only after completion

## Progress

- No future scores
- Q1 score after Q1 answer
- Q2 score after Q2 answer
- Continue through Q10
- Final graph contains Q1–Q10

## Knowledge Map

- White polygon restored
- Purple fill restored
- Points work correctly
- No snapping/jumping
- Values update correctly if interactive

## Cursor

- Native cursor hidden
- Outer circle visible
- Center dot visible
- Both move together
- Transparent center
- No giant filled circle
- Underlying content visible
- Contrast/inversion effect clipped to cursor circle

## Profile

- Name editing persists
- Username editing persists
- Correct avatar
- Correct email
- Correct user data after re-login

---

# 33. Final Build

Run:

```bash
npm run build
```

Fix all compilation/runtime errors introduced by these changes.

Do NOT modify backend.

Do NOT remove existing working features.

Do NOT replace working implementations unnecessarily.

Before making changes, inspect the current code and preserve already-working functionality.
