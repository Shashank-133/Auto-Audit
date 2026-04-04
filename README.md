![AutoAudit AI Dashboard](docs/Image%201.jpeg)

# AutoAudit AI
### Autonomous Financial Compliance — ET AI Hackathon 2026 | Track 3: Cost Intelligence & Autonomous Action

> **Not a chatbot. A system that completes real enterprise work — autonomously.**

AutoAudit AI is a production-ready multi-agent system that reads invoice PDFs, detects GST errors, duplicate payments, and policy violations, fixes 75% of them automatically, and hands the rest to a CFO with full evidence. Zero human touch for routine compliance.

---

## The Problem

Every quarter, Indian finance teams manually audit hundreds of invoices. The result:

| Pain Point | Real Cost |
|------------|-----------|
| 90 hours/quarter of manual review | ₹53,000 in labor |
| 40% of violations missed | ₹12L GST penalty (real Bangalore case) |
| Duplicate payments not caught | ₹3L paid twice (real Mumbai case) |
| CFO buried in invoice approvals | 30 hours/quarter lost to strategy |

**These are not edge cases. They happen every month, at every mid-sized Indian company.**

---

## Our Solution — 5 Agents, 1 Workflow, Zero Manual Work

```
📄 Upload PDFs
      │
      ▼
┌─────────────────┐
│  Agent 1        │  Extracts structured data from PDFs
│  INTAKE         │  Fallback: Gemini Vision for blurry/handwritten scans
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent 2        │  Checks 3 violation types:
│  COMPLIANCE     │  → GST mismatch (rules-based, 100% deterministic)
│  SCANNER        │  → Duplicate payments (vector similarity, ChromaDB)
└────────┬────────┘  → Over-limit invoices (policy threshold check)
         │
         ▼
┌─────────────────┐
│  Agent 3        │  Groq Llama 3.3 70B analyses WHY violation occurred
│  INVESTIGATOR   │  Returns: root cause + confidence score + risk score
└────────┬────────┘
         │
         ▼
┌─────────────────┐  confidence > 0.7 AND risk < 5  →  AUTO-FIX
│  Agent 4        │  Post-fix verification           →  ROLLBACK if needed
│  REMEDIATOR     │  Otherwise                       →  ESCALATE to CFO
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent 5        │  Immutable audit trail saved to DB
│  AUDITOR        │  Downloadable compliance report generated
└─────────────────┘
         │
         ▼
📊 Dashboard + Report
   (violations caught, fixed, escalated, amount saved)
```

**Autonomy rate: 75% of violations resolved without any human involvement.**

---

## Live Results (Tested on Sample Invoice Batch)

| Metric | Result |
|--------|--------|
| Invoices processed | 12 |
| Violations detected | 7 |
| Auto-fixed by AI | 5 (71%) |
| Escalated to CFO | 2 (with full evidence) |
| Amount saved | ₹25,500 in GST corrections |
| Processing time | 8 seconds |
| Human time required | 0 minutes |

---

## Architecture

```
┌──────────────────────────────────────────────┐
│           FRONTEND  (Next.js 14)             │
│  Drag-drop upload │ Real-time agent log (WS) │
│  Results dashboard │ Error recovery demo     │
│  Deployed: Vercel                            │
└─────────────────────┬────────────────────────┘
                      │  REST API + WebSocket
┌─────────────────────▼────────────────────────┐
│           BACKEND  (FastAPI + LangGraph)     │
│                                              │
│  LangGraph State Machine                     │
│  Intake → Compliance → Investigator          │
│        → Remediator → Auditor                │
│                                              │
│  Error Recovery Layer:                       │
│  • OCR fail     → Gemini Vision fallback     │
│  • API timeout  → Exponential retry → swap   │
│  • Bad fix      → Rollback + escalate        │
│  • DB down      → Local queue + retry        │
│  • False pos.   → CFO feedback loop          │
│                                              │
│  Deployed: Railway                           │
└──────┬──────────────────────┬────────────────┘
       │                      │
┌──────▼──────┐        ┌──────▼──────┐
│  Groq API   │        │  ChromaDB   │
│  Llama 3.3  │        │  (in-memory │
│  70B        │        │   vectors)  │
└─────────────┘        └─────────────┘
```

### Why This Stack (Every Decision Has a Reason)

| Decision | Why |
|----------|-----|
| Groq over OpenAI | 10x faster, free tier, no rate limits during demo |
| LangGraph over LangChain | State machine = clean error recovery + debuggable |
| Rules for GST check | Deterministic — auditors need explainability, not LLM guesses |
| ChromaDB for duplicates | Handles vendor name typos ("Tech Supplies" vs "TechSupplies") |
| FastAPI over Flask | Native async = WebSocket support without hacks |

**Total monthly cost: ₹0** — all free tiers, sufficient for 10,000+ invoices/month.

---

## Tech Stack

**Backend**
- Python 3.11 + FastAPI
- LangGraph (multi-agent orchestration)
- Groq — `llama-3.3-70b-versatile` (primary LLM)
- PyMuPDF (PDF text extraction)
- ChromaDB (duplicate detection via vector similarity)
- WebSockets (real-time agent log streaming)

**Frontend**
- Next.js 14 (TypeScript, App Router)
- shadcn/ui + Tailwind CSS
- WebSocket client (live agent activity feed)

**Infrastructure**
- Backend: Railway
- Frontend: Vercel
- Cost: $0/month

---

## Error Recovery (5 Scenarios — All Live)

The system never crashes. It degrades gracefully:

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Blurry/handwritten PDF | OCR confidence < 70% | Switch to Gemini Vision |
| Groq API timeout | 3 retries with backoff | Swap to fallback LLM |
| Auto-fix creates new violation | Post-fix compliance re-scan | Rollback + escalate |
| Duplicate detection false positive | Similarity score < 0.98 | CFO gets 3 action options |
| Database unreachable | Write fails | Queue locally, sync when restored |

Click **"Error Simulation Lab"** in the dashboard to see all 5 in action during the demo.

---

## Impact Model

### Assumptions
- Mid-sized Indian company, 500 employees, Bangalore
- 600–750 invoices per quarter
- Current team: 2 accountants + 1 manager reviewing invoices

### Quantified Savings (Annual)

| Category | Before | After | Saved |
|----------|--------|-------|-------|
| Labor (audit hours) | ₹53,000/qtr | ₹11,250/qtr | **₹1,67,000/yr** |
| GST penalties (missed errors) | ₹1,20,000/yr | ₹0 | **₹1,20,000/yr** |
| Duplicate payments caught | ₹0 recovered | ₹3L avg/yr | **₹3,00,000/yr** |
| Overpayment recovery (98% vs 60%) | Low | High | **₹6,97,680/yr** |
| CFO time freed (30 hrs/qtr) | ₹0 | ₹75,000/yr | **₹75,000/yr** |
| **TOTAL** | | | **₹13,59,680/yr** |

**ROI: Infinite. Implementation cost: ₹0.**

Even on paid API tiers at scale:
- API cost: ~₹72,000/year
- Net savings: ₹12,87,680/year
- ROI: **18x**

### Time Savings
```
Per Quarter:  90 hours → 14.5 hours  (84% reduction)
Per Year:     302 hours saved = 37 working days
```

---
---

## Sample — GST Mismatch Detection

The image below shows a real violation caught by AutoAudit AI — a vendor charged **28% GST instead of the correct 18%** on an electronics invoice. The system detected it, investigated the root cause, and auto-corrected the amount in 3 seconds.

![GST Mismatch Detected by AutoAudit](docs/Image%202.jpeg)

> **Violation:** Electronics invoiced at 28% GST instead of 18%
> **Financial Impact:** Rs 25,500 overcharged
> **Action:** Auto-corrected by Agent 4 with 87% confidence
> **Time taken:** 3 seconds — zero human involvement




## Setup — Run It Yourself in 10 Minutes

### Prerequisites
- Python 3.11+
- Node.js 18+
- Free Groq API key → https://console.groq.com (2 min signup)

---

### Backend

```bash
cd Auto-Audit/backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create your `.env` file:
```bash
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux
```

Open `.env` and set your key — **only change this one line:**
```
GROQ_API_KEY=gsk_your_actual_key_here
```

Everything else is already configured:
```
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=2048
GROQ_TEMPERATURE=0.1
GST_RATE_ELECTRONICS=18.0
INVOICE_AMOUNT_LIMIT=300000.0
AUTO_FIX_RISK_THRESHOLD=5.0
DEBUG=false
```

Start the backend:
```bash
python main.py
```

You should see:
```
AutoAudit AI is ready to receive requests.
Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open.**

---

### Frontend

Open a **second terminal:**

```bash
cd Auto-Audit/frontend
npm install
```

Create `.env.local`:
```bash
New-Item .env.local            # Windows
# touch .env.local             # Mac/Linux
```

Open `.env.local` and paste:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

Start the frontend:
```bash
npm run dev
```

---

### Open in Browser

| | URL |
|--|-----|
| Dashboard | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## Testing With Sample Invoices

Three test invoices are included to demonstrate each violation type:

| Invoice | Violation | What AutoAudit Does |
|---------|-----------|---------------------|
| `invoice_GST_MISMATCH.pdf` | 28% GST on electronics (should be 18%) | Detects, investigates, auto-fixes |
| `invoice_OVER_LIMIT.pdf` | ₹5,31,000 total — exceeds ₹3L policy limit | Flags, escalates to CFO with context |
| `invoice_DUPLICATE.pdf` | Same vendor + amount + date as existing invoice | Catches, shows similarity score, escalates |

Upload all three at once. Watch the Agent Activity log on the right. Review results in the dashboard.

---

## Project Structure

```
Auto-Audit/
├── backend/
│   ├── main.py                  # FastAPI app + WebSocket manager
│   ├── agents/
│   │   ├── intake_agent.py      # PDF extraction + OCR fallback
│   │   ├── compliance_agent.py  # GST / duplicate / limit checks
│   │   ├── investigation_agent.py # Groq LLM root cause analysis
│   │   ├── remediation_agent.py # Auto-fix + rollback logic
│   │   └── audit_agent.py       # Report generation + audit trail
│   ├── services/
│   │   ├── llm.py               # Groq client + retry logic
│   │   ├── duplicate_detector.py # ChromaDB vector search
│   │   └── websocket_manager.py  # Real-time log streaming
│   ├── .env.example             # Config template (safe to commit)
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   └── page.tsx             # Main dashboard
│   ├── components/
│   │   ├── FileUpload.tsx       # Drag-drop uploader
│   │   ├── AgentLog.tsx         # Real-time WebSocket feed
│   │   ├── MetricsCards.tsx     # Stats (processed, fixed, saved)
│   │   ├── ResultsTable.tsx     # Violations + actions table
│   │   └── ErrorDemo.tsx        # Error simulation lab
│   └── package.json
│
└── README.md
```

---

## Submission Checklist

- [x] Source code — all agents implemented and working
- [x] README with full setup instructions
- [x] Architecture diagram with agent roles and error handling
- [x] Impact model with quantified savings and stated assumptions
- [x] Error recovery — 5 scenarios, all demonstrable live
- [x] Real-time agent transparency via WebSocket log
- [x] Free-tier only — zero cost to run and demo

---
---

## Demo Video

Watch AutoAudit AI in action — full 3-minute walkthrough showing invoice upload, agent pipeline, violation detection, auto-fix, and error recovery.

[Watch Demo Video on Google Drive](https://drive.google.com/file/d/1rexrb4vlKNr06jKCMUso2l9_-K_CrjXe/view?usp=sharing)


## Team Members
 Dhruvi Srivastava
 Shashank Gupta
 Nishita Goyal
 Gunika Kharbanda
