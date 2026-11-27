# Poke-Switch

An independent Pokémon discovery app for game discovery, the National Pokédex, a nine-region map atlas, fan projects and mobile adventures.

## Open the website

**Windows:** double-click `run-local.bat` in the project folder. It starts the local website and opens your browser.

Keep the server window open while using the app. Press `Ctrl + C` in that window to stop it.

**Manual start:** open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000**.

You need Python 3 and an internet connection for live Pokédex data. No npm install or build step is required.

## Navigate the app

Use the fixed left navigation to switch between independent screens:

- **Discover** — featured Pokémon, daily field note and quick-launch cards.
- **Game library** — curated main-series and spin-off catalogue.
- **Region atlas** — nine expandable region maps with landmark notes and source links.
- **Pokédex** — search, type filters, an artwork gallery, shiny variants when available, sprites, statistics and species entries.
- **Fan universe** — curated unofficial community projects.
- **Mobile games** — official Pokémon mobile-app links.
- **PC wishboard** — local requests and votes plus a message you can copy to Nintendo.

The app changes screens without sending you down one long landing page. On smaller screens, use the menu button in the top bar.

## Project structure

```text
Poke-Switch/
├── index.html
├── run-local.bat
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── data/
│   └── catalogue.js
├── tests/
│   └── site.test.cjs
└── .github/
    └── workflows/
        └── site.yml
```

## Data and artwork

- Pokédex records, types, stats and descriptions come from [PokéAPI](https://pokeapi.co/docs/v2).
- Pokémon illustrations and sprite variants use the available files from the [PokéAPI sprites repository](https://github.com/PokeAPI/sprites). A gallery only shows variants returned by the API; images are not artificially upscaled or claimed to be 4K.
- Region maps link to referenced Pokémon Center map products and source collections. Image availability and resolution depend on the original source.
- Game and fan-project directories are curated selections, not exhaustive lists. Check publisher and creator links for current availability.
- PC requests and votes stay in each visitor's browser. They are not sent to Nintendo and are not global vote totals.
- Fan projects are unofficial. Poke-Switch does not host ROMs, game files or copyrighted downloads.

## Development checks

Use Node.js 22 or later:

```bash
node --check assets/js/app.js
node --test tests/site.test.cjs
```

Poke-Switch is not an official Nintendo or Pokémon product. Official brand names appear as outbound resource links only; the Poke-Switch identity remains the primary brand.\n\n## Official links

- [Pokémon](https://www.pokemon.com/)
- [Pokémon games](https://in.portal-pokemon.com/game/)
- [Nintendo](https://www.nintendo.com/)
- [PokéCommunity](https://www.pokecommunity.com/)

## Disclaimer

Poke-Switch is an independent fan project and is not affiliated with, endorsed by or sponsored by Nintendo, GAME FREAK, Creatures Inc. or The Pokémon Company. Pokémon names, characters and artwork belong to their respective rights holders.

---

## Engineering Audit & Handover — 2026-11-17

**Reviewed commit:** `f763c79bf1cd38a359dac224a4c426ecf98c4be9` (`main`). Static inspection covered `assets/js/app.js`, catalogue structure, and `tests/site.test.cjs`; tests were not executed.

### Confirmed findings
- The project has a separated static catalogue, browser application, local-storage wrapper, and a site test file.
- The test suite primarily checks page structure, local asset wiring, catalogue separation, API/cache hooks, and the local-only PC request behavior. These checks do not constitute full browser end-to-end coverage of the PokéAPI flow or every UI interaction.
- Pokédex data depends on the external PokéAPI and sprite repository; availability, rate limits, and returned variants can change.
- The README correctly states that PC requests/votes remain local to each visitor's browser and are not global vote totals. Preserve this limitation.

### Next actions
1. Run `node --check assets/js/app.js` and `node --test tests/site.test.cjs` in CI and record the result.
2. Add browser-level tests for API errors, cache expiry, search/filter behavior, and local-storage failure.
3. Keep curated catalogue entries and third-party API data clearly distinguished, with source links and update dates.

**Verification status:** static source/test inspection only; no test execution or browser end-to-end run was performed.

---

## Examples Used
- Discovering Pokémon by type and region
- Exploring the nine-region atlas and Pokédex entries
- Browsing official mobile games and curated fan projects

---

## Repository navigation

[Alphabetical file index](FILE_INDEX.md)
