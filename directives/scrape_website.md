# Directive: Scrape Website

## Objective
Scrape structured data from one or more target URLs and save the results as a JSON or CSV file in `.tmp/`.

## Inputs

| Input | Description | Required |
|---|---|---|
| `url` | The target URL to scrape | Yes |
| `output_file` | Path to save results (default: `.tmp/scraped_data.json`) | No |
| `fields` | List of CSS selectors or XPath expressions to extract | Yes |
| `pagination` | Whether to follow pagination links (default: `false`) | No |

## Tools / Scripts to Use

- **Primary**: `execution/scrape_single_site.py`
- **With pagination**: `execution/scrape_paginated_site.py` *(create if not exists)*

## Steps

1. Confirm the target URL is accessible (no login wall, not rate-limited)
2. Run `execution/scrape_single_site.py --url <URL> --output .tmp/scraped_data.json`
3. Verify the output file contains expected data
4. If data is missing or malformed, inspect the HTML and adjust CSS selectors
5. Export or deliver results per user's request (Google Sheets, CSV, etc.)

## Outputs

- `.tmp/scraped_data.json` — raw scraped records
- (Optional) Google Sheet or CSV as final deliverable

## Edge Cases & Known Issues

- **CAPTCHA / bot protection**: If the site uses Cloudflare or similar, try using a headless browser (Playwright) or a proxy service. Update `.env` with `SCRAPING_API_KEY`.
- **Dynamic content (JS-rendered)**: Use `execution/scrape_playwright.py` instead of a simple requests-based scraper.
- **Rate limiting**: Add `--delay` flag (seconds between requests). Default: 1s.
- **Pagination**: Check for `next` link or page number patterns; use `--paginate` flag.

## Notes
- Always check `execution/` for an existing script before writing a new one
- Store intermediate files in `.tmp/` — never in the project root
- Update this directive when you discover new edge cases
