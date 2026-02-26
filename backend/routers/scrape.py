"""
routers/scrape.py — Scraping Router
-------------------------------------
Expose scraping functionality via REST endpoints.
Called by the frontend or directly by the AI agent.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
import subprocess
import json
from pathlib import Path

router = APIRouter()


class ScrapeRequest(BaseModel):
    url: HttpUrl
    delay: float = 1.0
    output_file: str = ".tmp/scraped_data.json"


class ScrapeResponse(BaseModel):
    status: str
    output_file: str
    data: dict | None = None


@router.post("/single", response_model=ScrapeResponse)
async def scrape_single(req: ScrapeRequest):
    """
    Trigger a single-site scrape via the execution layer script.
    Delegates all actual work to execution/scrape_single_site.py.
    """
    script_path = Path("../execution/scrape_single_site.py")
    output_path = Path(req.output_file)

    if not script_path.exists():
        raise HTTPException(status_code=500, detail="Execution script not found.")

    result = subprocess.run(
        [
            "python",
            str(script_path),
            "--url", str(req.url),
            "--output", str(output_path),
            "--delay", str(req.delay),
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=result.stderr)

    # Load and return the output if it exists
    data = None
    if output_path.exists():
        with open(output_path, "r", encoding="utf-8") as f:
            data = json.load(f)

    return ScrapeResponse(status="success", output_file=str(output_path), data=data)
