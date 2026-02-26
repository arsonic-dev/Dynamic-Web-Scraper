# Dynamic Web Scraper

A dynamic, AI-orchestrated web scraping system built on a **3-layer architecture** that separates intent, decision-making, and deterministic execution.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1 — Directives (directives/)                     │
│  Markdown SOPs defining what to do, inputs, outputs     │
├─────────────────────────────────────────────────────────┤
│  Layer 2 — Orchestration (AI Agent)                     │
│  Reads directives, makes decisions, calls scripts       │
├─────────────────────────────────────────────────────────┤
│  Layer 3 — Execution (execution/)                       │
│  Deterministic Python scripts — reliable & testable     │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Dynamic Web Scraper/
├── CLAUDE.md              # Agent instructions & operating principles
├── README.md              # This file
├── requirements.txt       # Python dependencies
├── .env.example           # Environment variable template → copy to .env
├── .gitignore
│
├── directives/            # Layer 1: Markdown SOPs
│   └── scrape_website.md  # SOP for web scraping tasks
│
├── execution/             # Layer 3: Deterministic Python scripts
│   ├── README.md          # Conventions for writing execution scripts
│   └── scrape_single_site.py
│
├── .tmp/                  # Intermediate files (never committed)
│
├── frontend/              # Next.js app (when web app is needed)
└── backend/               # FastAPI backend (when web app is needed)
```

---

## Quick Start

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and fill in your values
```

### 3. Run a scrape

```bash
python execution/scrape_single_site.py --url https://example.com --output .tmp/result.json
```

---

## How It Works

1. **Directives** (`directives/`) define the SOP for each type of task — inputs, outputs, scripts to use, and edge cases.
2. **The AI agent** reads the relevant directive, selects the right script, handles errors, and updates directives as it learns.
3. **Execution scripts** (`execution/`) do the actual work deterministically — no hallucination, no guessing.

---

## Adding New Capabilities

1. Create a new script in `execution/your_script.py`
2. Create a matching directive in `directives/your_directive.md` documenting inputs, outputs, and edge cases
3. The AI agent will discover and use it automatically

---

## File Organization Rules

| Location | Purpose |
|---|---|
| `directives/` | Markdown SOPs — living documents, improved over time |
| `execution/` | Python tools — deterministic, well-commented |
| `.tmp/` | All intermediate/temporary files — safe to delete |
| `.env` | Secrets & API keys — **never commit** |
| `credentials.json` | Google OAuth — **never commit** |

---

## Tech Stack

- **Scraping**: `requests`, `BeautifulSoup4`, `Playwright` (for JS-heavy sites)
- **Web App** (optional): Next.js + React + Tailwind CSS (frontend), FastAPI (backend)
- **Environment**: `python-dotenv`
