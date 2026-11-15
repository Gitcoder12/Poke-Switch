# Project Status — Poke-Switch

**Snapshot date:** 2026-11-16  
**Status type:** Initial documentation and repository-tree assessment  
**Default branch:** main  
**Review completeness:** Partial — not a code audit or release certification

## Project purpose
Independent Pokémon discovery website for game catalogue, Pokédex, region atlas, fan-project links, mobile games and a local PC wishboard.

## Current maturity (README-declared or visible scaffolding; not independently verified)
Root includes index.html, assets/, data/, tests/, run-local.bat and a GitHub Actions workflow. README documents a static browser app using PokéAPI and states that wishboard votes remain in the visitor's browser.

## Observed repository structure
index.html, assets/, data/, tests/, run-local.bat, .github/workflows/site.yml and project governance/worklog files.

## Known issues and risks to investigate
External PokéAPI/network availability affects live Pokédex data; verify rate limits and fallbacks. Copyright/trademark and fan-project links need careful treatment; README appropriately states unofficial status and no ROM hosting. Ensure all region maps/artwork remain attributed and no content is implied to be 4K or original. No tests were run in this pass.

## Recommended next actions
Run `node --check assets/js/app.js` and `node --test tests/site.test.cjs`; verify GitHub Pages workflow and local Windows script; test API offline/error paths, mobile navigation and keyboard accessibility; audit all external links/artwork attribution and ensure local votes are not described as global.

## Verification record
| Check | Result |
|---|---|
| Default-branch top-level tree | Inspected |
| README | Inspected |
| Deep source review | Not performed |
| Tests / build / runtime | Not run |
| Data provenance / numerical validation | Not run |
| Security / dependency audit | Not run |
| Independent review | Not performed |

## Change log
- 2026-11-16: Added this initial status snapshot on a review branch. No application code or existing data changed.

> Update this file only after the corresponding inspection or verification has actually been performed. Distinguish observed facts, README claims, hypotheses and unrun checks.