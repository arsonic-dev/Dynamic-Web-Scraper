# Execution Layer

This directory contains **deterministic Python scripts** — the Layer 3 of the 3-layer architecture.

## Purpose
- Handle all actual "doing": API calls, data processing, file I/O, database interactions
- Reliable, testable, and fast
- Called by the orchestration layer (the AI agent) based on directives

## Conventions

| Convention | Detail |
|---|---|
| Naming | `verb_noun.py` — e.g. `scrape_single_site.py`, `export_to_sheets.py` |
| CLI args | Use `argparse` for all inputs |
| Output | Write results to `.tmp/` or stdout as JSON |
| Errors | Exit with non-zero code and print a clear error message |
| Comments | Well-commented; explain *why*, not just *what* |

## Environment
- All secrets/config come from `.env` (loaded with `python-dotenv`)
- Never hardcode credentials

## Adding a New Script
1. Create `execution/your_script.py`
2. Add a matching directive in `directives/your_directive.md`
3. Document inputs, outputs, and edge cases in the directive
