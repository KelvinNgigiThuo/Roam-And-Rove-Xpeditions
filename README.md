# 🚌 Roam and Rove Xpeditions

> **Operational software for Kenya's transport industry** 

## The Problem

Small and mid-size transport operators in Kenya — matatus, shuttles, charter services — are running real businesses with real cash flow, but managing everything through fragmented tools: WhatsApp groups for task coordination, handwritten expense logs, and invoice formats copied from old PDFs.

The result? Money leaks through untracked fuel costs. Invoices go out late or wrong. No one knows which driver completed which job. Business owners can't see their own numbers.

**Roam and Rove Xpeditions** is the backend system that changes that.

---

## What It Does

| Module | What It Solves |
|---|---|
| 💸 **Expense Tracking** | Log and categorize operational costs — fuel, maintenance, staff — per vehicle or route |
| 🧾 **Invoicing** | Generate and manage client invoices tied to actual trips completed |
| ✅ **Task Management** | Assign jobs to drivers, track completion, maintain accountability |
| 📊 **Reporting** | Aggregate financial and operational data into summaries business owners can actually act on |

---

## Architecture

```
roam-and-rove/
├── core/                  # Shared models, utilities, base views
├── expenses/              # Expense tracking module
├── invoicing/             # Invoice generation and management
├── tasks/                 # Job assignment and tracking
├── accounts/              # Authentication and user management
├── api/                   # REST API layer (DRF)
├── templates/             # Mobile-responsive frontend templates
└── config/                # Django settings, URL routing
```

This is a **monolithic Django application** with a clean modular structure — each business domain lives in its own app, sharing a single PostgreSQL database. The frontend is server-rendered (Django templates + TailwindCSS), fully mobile responsive, reflecting how operators in this market actually access tools — on their phones.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Django 5.x + Python 3.12 | Rapid development, batteries included, strong ORM |
| Database | PostgreSQL 16 | Relational integrity for financial data |
| Frontend | Django Templates + TailwindCSS | SSR for fast mobile load times, no JS framework overhead |
| Auth | Django built-in auth | Session-based, straightforward for SME users |
| API | Django REST Framework | Exposes endpoints for potential mobile client |

---

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 16+
- pip / virtualenv

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/kelvinthuo999/roam-and-rove-xpeditions.git
cd roam-and-rove-xpeditions

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env — set your DB credentials, SECRET_KEY, DEBUG=True

# 5. Run migrations
python manage.py migrate

# 6. (Optional) Load sample data
python manage.py loaddata fixtures/sample_data.json

# 7. Start the development server
python manage.py runserver
```

Visit `http://localhost:8000` — you should see the dashboard.



## Current Status

> 🔶 **MVP in active development** — This is my primary project right now.

| Feature | Status |
|---|---|
| User authentication & roles | ✅ Complete |
| Expense logging & categorization | ✅ Complete |
| Task creation & assignment | ✅ Complete |
| Invoice generation | 🔄 In Progress |
| Reporting dashboard | 🔄 In Progress |
| Mobile-responsive UI | ✅ Complete |
| REST API layer | 📋 Planned |
| Deployment (production) | 📋 Planned |

I'm building this to MVP completion — the goal is a working product a real transport operator can use, not a portfolio demo.

---

## Design Decisions Worth Noting

- **No frontend framework** — Server-rendered templates keep the stack lean and load times fast on variable mobile connections common in Nairobi.
- **PostgreSQL from day one** — Financial data needs transactional integrity. SQLite isn't an option here.
- **Modular Django apps** — Even as a monolith, each domain (expenses, invoicing, tasks) is isolated enough to extract later if needed.

---

## Contributing

This project is in active solo development. If you spot something broken, have a suggestion, or want to collaborate, open an issue — I read them.

---

## Author

**Kelvin Thuo** — Backend Engineer based in Nairobi, Kenya  
Building systems that make businesses and lives run better — not just code that works.

[![GitHub](https://img.shields.io/badge/GitHub-kelvinthuo999-181717?style=flat-square&logo=github)](https://github.com/kelvinthuo999)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/your-handle)
