"""
scrape_single_site.py
---------------------
Layer 3 Execution Script — Scrape a single website URL.

Usage:
    python execution/scrape_single_site.py --url <URL> [--output .tmp/output.json] [--delay 1]

Requirements:
    pip install requests beautifulsoup4 python-dotenv
"""

import argparse
import json
import os
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def scrape(url: str, delay: float = 1.0) -> dict:
    """Fetch a URL and return parsed HTML as a dict with metadata."""
    time.sleep(delay)

    proxy_url = os.getenv("PROXY_URL")
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None

    response = requests.get(url, headers=HEADERS, proxies=proxies, timeout=15)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    return {
        "url": url,
        "status_code": response.status_code,
        "title": soup.title.string.strip() if soup.title else None,
        "html_length": len(response.text),
        # TODO: Add your custom field extraction logic here
        # Example:
        # "headings": [h.get_text(strip=True) for h in soup.select("h1, h2, h3")],
        # "links": [a["href"] for a in soup.select("a[href]")],
    }


def main():
    parser = argparse.ArgumentParser(description="Scrape a single website URL.")
    parser.add_argument("--url", required=True, help="Target URL to scrape")
    parser.add_argument(
        "--output",
        default=".tmp/scraped_data.json",
        help="Path to save the output JSON (default: .tmp/scraped_data.json)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Seconds to wait before the request (default: 1.0)",
    )
    args = parser.parse_args()

    # Ensure output directory exists
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"[scrape_single_site] Scraping: {args.url}")
    result = scrape(args.url, delay=args.delay)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"[scrape_single_site] Saved to: {output_path}")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
