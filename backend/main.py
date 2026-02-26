"""
main.py — Complete Mock Backend for Dynamic Web Scraper
Matches frontend API contract exactly.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime
from typing import List, Optional, Dict
import random

app = FastAPI(
    title="Dynamic Web Scraper API",
    version="1.0.0"
)

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# In-memory database
# -----------------------------
jobs_db: Dict[str, dict] = {}


# -----------------------------
# Models (matching frontend)
# -----------------------------

class ScrapeRequest(BaseModel):
    url: str
    pages: int
    data_type: str
    headless: bool


# -----------------------------
# Health
# -----------------------------

@app.get("/")
async def health():
    return {"status": "ok", "message": "Dynamic Web Scraper API running"}


# -----------------------------
# Submit Scrape Job
# -----------------------------

@app.post("/scrape")
async def submit_scrape(req: ScrapeRequest):
    job_id = str(uuid4())

    job = {
        "job_id": job_id,
        "url": req.url,
        "data_type": req.data_type,
        "status": "completed",
        "pages_scraped": req.pages,
        "pages_total": req.pages,
        "records_extracted": random.randint(50, 200),
        "data_quality_score": round(random.uniform(85, 98), 2),
        "created_at": datetime.utcnow().isoformat(),
        "completed_at": datetime.utcnow().isoformat(),
    }

    jobs_db[job_id] = job

    return {
        "success": True,
        "job_id": job_id,
        "status": "completed",
        "estimated_duration_seconds": 2,
        "created_at": job["created_at"],
        "status_url": f"/status/{job_id}",
    }


# -----------------------------
# Get Job Status
# -----------------------------

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "success": True,
        "job_id": job_id,
        "status": job["status"],
        "progress_percentage": 100,
        "pages_scraped": job["pages_scraped"],
        "pages_total": job["pages_total"],
        "records_extracted": job["records_extracted"],
        "started_at": job["created_at"],
        "completed_at": job["completed_at"],
        "error_message": None,
        "result_url": f"/result/{job_id}",
    }


# -----------------------------
# Get Result
# -----------------------------

@app.get("/result/{job_id}")
async def get_result(job_id: str):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "success": True,
        "job_id": job_id,
        "data_type": job["data_type"],
        "total_records": job["records_extracted"],
        "clean_records": job["records_extracted"],
        "duplicates_removed": 0,
        "missing_fields_fixed": 0,
        "data_quality_score": job["data_quality_score"],
        "quality_breakdown": {
            "completeness": 95,
            "uniqueness": 90,
            "validity": 92,
            "consistency": 93,
        },
        "preview_data": [],
        "download_url": f"/download/{job_id}",
        "download_expires_at": datetime.utcnow().isoformat(),
        "created_at": job["created_at"],
        "completed_at": job["completed_at"],
    }


# -----------------------------
# Job History
# -----------------------------

@app.get("/history")
async def get_history():
    return {
        "success": True,
        "jobs": list(jobs_db.values()),
        "total_count": len(jobs_db),
        "next_cursor": None,
        "prev_cursor": None,
    }


# -----------------------------
# Download
# -----------------------------

@app.get("/download/{job_id}")
async def download(job_id: str):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"message": f"Mock CSV download for job {job_id}"}
