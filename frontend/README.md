# AutoAudit AI — Frontend

Next.js 14 (App Router) frontend for the AutoAudit AI multi-agent invoice
compliance system. Light-theme, enterprise-grade UI built with Tailwind CSS v4,
Framer Motion, Zustand, React Hook Form, and Zod.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State**: Zustand (with `persist` for auth + audit history)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx               # Root layout (Inter font, light theme)
│   ├── page.tsx                 # Landing page (pre-login)
│   ├── globals.css              # Tailwind + custom CSS variables
│   └── dashboard/
│       ├── layout.tsx           # Auth-guarded app shell + nav
│       ├── page.tsx             # Dashboard overview
│       ├── upload/page.tsx      # Drag-drop upload + realtime WS log
│       ├── reports/page.tsx     # Violation cards + processed table
│       └── settings/page.tsx    # Profile + preferences + danger zone
├── components/
│   ├── landing/                 # Hero, Stats, HowItWorks, CTA, Footer …
│   ├── auth/AuthModal.tsx       # Login + Signup (mock auth)
│   ├── dashboard/               # AppNavbar, StatsCard, UploadZone, …
│   └── shared/                  # Button, Input, Card, Badge, Modal, Logo, Spinner
└── lib/
    ├── api.ts                   # Fetch wrappers for backend REST endpoints
    ├── types.ts                 # Shared TS types (Invoice, AuditResponse, …)
    ├── store.ts                 # Zustand stores: auth + audit history
    ├── useWebSocket.ts          # Auto-reconnecting WS hook
    └── utils.ts                 # cn, formatINR, formatBytes, …
```

## Getting Started

### 1. Start the backend

```bash
cd ../backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # Add your GROQ_API_KEY
python main.py
```

Backend runs at `http://localhost:8000`.

### 2. Configure the frontend

```bash
cd ../frontend
npm install
```

Create `.env.local` (if not present):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## How Auth Works

Auth is currently **mocked client-side** with `zustand persist + localStorage`:

- Signup creates a user object keyed by email and persists it.
- Login accepts any email with a password ≥ 6 chars; if the email was used
  in a prior signup the saved profile loads, otherwise a fresh profile is
  created.
- All routes under `/dashboard` redirect to `/` when no user is present.

When real auth lands on the backend, swap the body of `login` / `signup` in
[`lib/store.ts`](lib/store.ts) for real `fetch` calls — the rest of the UI
needs no changes.

## How the Pipeline Drives the UI

1. **Upload page** queues files locally.
2. On `Start Audit`, files are uploaded **sequentially** to `POST /upload`
   (the backend processes one file at a time).
3. While uploading, the page subscribes to `ws://…/ws` and streams every
   agent event into the **Agent Activity** panel.
4. Each completed response is persisted to the `audit-history` Zustand
   store (localStorage), then surfaced on **Dashboard** and **Reports**.
5. **Reports** flattens every `audit_report.investigations[]` array and
   merges it with `remediation_summary.log[]` for status (auto-fixed vs.
   escalated). Click *View details* on a card for evidence (root cause,
   confidence, risk score).

## Build / Deploy

```bash
npm run build
npm run start
```

For Vercel: set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to your
deployed backend URLs.

## Design

Trustworthy light-theme palette:

| Token  | Hex |
|--------|-----|
| Soft Yellow (bg, highlights) | `#FFF9D2` |
| Cream (cards, sections)     | `#FFEBCC` |
| Sky Blue (accents, borders) | `#BFDDF0` |
| Ocean Blue (CTAs, links)    | `#8CC0EB` |
| Text Dark (headings)        | `#2C3E50` |
| Text Medium (body)          | `#5A6C7D` |
| Success / Warning / Error   | `#52C41A` · `#FA8C16` · `#F5222D` |

Animations are deliberately restrained — 200–500 ms ease-out fades and
lifts; no springs, no bounces. Enterprise tone.

## Accessibility

- Every interactive element is keyboard reachable.
- Focus rings are 2 px ocean-blue with 2 px offset.
- ARIA roles on the modal, switches, and menu.
- Form errors announce via `aria-describedby` / `aria-invalid`.
- Color pairs meet WCAG AA (4.5:1) on every text+background combination
  used for body copy.
