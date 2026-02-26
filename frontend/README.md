# 🚀 Dynamic Web Scraper

A full-stack scraping platform built with **React + TypeScript (Vite)** and **FastAPI (Python)**.

Submit scraping jobs, track progress, validate structured data, and download results — all from a clean dashboard interface.

---

## ✨ Features

- ✅ Submit scraping jobs from a modern dashboard
- ✅ Real-time job status tracking
- ✅ Paginated job history view
- ✅ Structured API contract (Frontend ↔ Backend aligned)
- ✅ Data quality scoring system
- ✅ Download endpoint for CSV results (mock)
- ✅ Fully documented REST API (Swagger)
- ✅ Clean responsive dark UI
- ✅ Modular service-layer architecture

---

## ⚙️ How It Works

### 1️⃣ Job Submission
User submits:
- Target URL
- Data type
- Number of pages
- Headless mode

Frontend sends:


---

### 2️⃣ Backend Processing
Backend:
- Generates unique job ID
- Simulates scraping process
- Calculates mock data quality score
- Stores job in memory

---

### 3️⃣ Status Tracking

Frontend polls:


Returns:
- Progress percentage
- Records extracted
- Completion status

---

### 4️⃣ View Results

Displays all previously submitted jobs with pagination support.

---

## 🏗 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Python 3.11+

---

## 🔌 Integrations

- Swagger API documentation (`/docs`)
- RESTful contract-driven API
- Axios service layer for structured requests
- CORS-enabled frontend-backend communication
- Modular backend route architecture

---

## 📂 Project Structure

Dynamic-Web-Scraper/
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── services/api.ts
│
├── backend/
│ ├── main.py
│ └── requirements.txt
│
└── README.md


---

## 🚀 Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

API Docs:

http://localhost:8000/docs

Frontend
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000



🧠 Current Version

This version uses a mock scraping engine for testing the full-stack workflow.

🛣 Roadmap

 Replace mock engine with Selenium execution

 Add CSV file generation

 Add database persistence (PostgreSQL)

 Add background job queue

 Add authentication

 Dockerize application

 Deploy production version



📌 Future Vision

This project is designed to evolve into:

A structured scraping SaaS platform

A scalable data validation engine

A distributed scraping microservice system


👨‍💻 Author

Ankit Kumar
arsonnick349@gmail.com
arsonic-dev
Full-stack system built for structured scraping automation and API-driven architecture learning.