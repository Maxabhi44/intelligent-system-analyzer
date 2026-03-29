# 🧠 Intelligent System Analyzer (ISA)

> **Understand Your System, Not Just Clean It**

ISA is an AI-powered desktop utility that goes beyond simple disk cleanup. It intelligently analyzes your file system, understands context, and gives you smart, risk-free recommendations — so you always know *what* to delete and *why*.

---

## ✨ Features

### 🔍 Intelligent Scanner
- Full file system traversal with metadata extraction
- Tracks file name, path, size, last modified, and last accessed
- Incremental scanning — only re-scans changed files after the first run

### 🧩 Context-Aware Classification
- Understands file context: type + location + usage behavior
- Distinguishes between junk, useful files, and risky files
- Rule-based engine: no guessing, no false positives

### 📊 Insight Dashboard
- Junk summary, unused files, large files, risky files — all in one view
- Visual breakdown of what's eating your storage
- Safe, actionable recommendations

### 🤖 AI Insight Engine *(Phase 3)*
- AI is used only for unknown or suspicious files
- Generates explanation, risk level, and recommendation
- Designed to be fast, minimal, and trust-building — not a black box

### 👨‍💻 Developer Mode *(Phase 3)*
- Detects Node.js, Python, and Java projects automatically
- Identifies inactive projects and unused build artifacts
- Suggests cleanup actions: clean cache, remove builds, or archive

### 🛡️ Safety First
- Trash system with full undo/restore support
- System folder blacklist — critical paths are never touched
- Backup before any destructive action

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| Scanner Engine | Go / Rust |
| Database | SQLite |
| Frontend | React / Next.js |
| State Management | Zustand / Redux |
| AI Layer | Anthropic Claude API (limited use) |

---

## 📁 Project Structure

```
intelligent-system-analyzer/
├── backend/          # FastAPI backend
│   ├── api/          # Route handlers
│   ├── models/       # Pydantic schemas
│   ├── services/     # Business logic
│   ├── db/           # SQLite layer
│   └── main.py       # Entry point
├── frontend/         # React / Next.js UI
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── store/
├── scanner/          # Go / Rust scanner engine
│   ├── src/
│   ├── rules/
│   └── knowledge/
└── .github/
    └── workflows/    # CI/CD pipelines
```

---

## 🚀 Getting Started

> ⚠️ **Work in progress.** Installation instructions will be added as development progresses.

### Prerequisites

- Python 3.11+
- Node.js 18+
- Go 1.21+ *(for scanner engine)*

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/intelligent-system-analyzer.git
cd intelligent-system-analyzer

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend setup (separate terminal)
cd frontend
npm install
npm run dev
```

> Full setup guide coming soon.

---

## 🗺️ Roadmap

### ✅ Phase 1 — MVP *(In Progress)*
- [x] Project structure and GitHub setup
- [ ] Basic file system scanner
- [ ] Temp file and large file detection
- [ ] Manual clean with trash/undo support
- [ ] Basic insight dashboard

### 🔄 Phase 2 — Intelligence
- [ ] Context-aware rule engine
- [ ] Usage tracking system
- [ ] Duplicate file detection
- [ ] Personalization engine

### 🤖 Phase 3 — AI + Developer Mode
- [ ] AI Insight Engine (unknown/suspicious files)
- [ ] Developer Mode (Node, Python, Java project detection)
- [ ] Inactive project detection and cleanup suggestions

---

## ⚠️ Design Principles

- **Never auto-delete** — every action requires user confirmation
- **AI is minimal** — used only where rules fail, never as the default
- **Speed over features** — fast scans, non-blocking UI
- **Trust first** — transparency in every recommendation

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with focus on speed, accuracy, and user trust.</p>
