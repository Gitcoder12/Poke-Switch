# Poke-Switch

A community-powered Pokémon game discovery and request platform.

Discover official Pokémon games, explore available PC options, and submit or vote on ideas for future Pokémon games and features.

## Features

- Browse a catalog of Pokémon games with links to official sources.
- Request PC releases, remakes, features, and new game ideas.
- Vote on community requests.
- Save games to a personal wishlist.

## Official Pokémon Links

- [Official Pokémon Website](https://www.pokemon.com/)
- [Pokémon Video Games](https://www.pokemon.com/us/pokemon-video-games)
- [Nintendo Games Store](https://www.nintendo.com/us/store/games/)
- [Pokémon Support](https://support.pokemon.com/hc/en-us)

## Fan Games & Community

These are independent, unofficial fan projects:

- [Pokémon Showdown](https://pokemonshowdown.com/) — Online battle simulator.
- [Pokémon Uranium](https://pokemonuranium.co/) — Fan-made adventure.
- [Pokémon Insurgence](https://p-insurgence.com/) — Fan game set in the Torren region.
- [Pokémon Reborn](https://www.rebornevo.com/) — Story-driven fan game.
- [PokéCommunity](https://www.pokecommunity.com/) — Pokémon fan community and game development forums.

## Disclaimer

Poke-Switch is an independent fan project and is not affiliated with or endorsed by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company. Pokémon and related intellectual property belong to their respective rights holders.

Poke-Switch does not distribute unauthorized game files or copyrighted assets. Users are responsible for complying with applicable laws and third-party terms.

---


## Current website

Run the site locally from the repository root:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). The site is static HTML, CSS and JavaScript; no build step or backend is required.

The current website includes:

- A curated catalogue of main-series and selected spin-off games, with official Pokémon and Nintendo links.
- Region-inspired visual themes and grid/list catalogue layouts.
- A curated directory of independent fan projects, linked to their project pages or developer threads.
- A searchable National Pokédex, type filters, Pokémon detail cards and a daily Pokédex entry.
- Official Pokémon mobile-app links.
- A PC-release wishboard where visitors can add requests and vote locally in their own browser.

### Data and limits

- Pokédex names, species records, type data, stats and flavor text are loaded from [PokéAPI](https://pokeapi.co/docs/v2). API responses are cached in browser storage.
- Pokémon sprites are loaded from the public [PokéAPI sprites repository](https://github.com/PokeAPI/sprites).
- Official game, mobile-app and Nintendo links point to publisher-controlled catalogues or product pages. Store availability can differ by country and device.
- The game catalogue is curated; it is not an exhaustive history of every regional release, edition or delisted product.
- The fan-game directory is a curated selection, not a complete list. Fan projects are unofficial and can disappear or change. Poke-Switch does not host their game files, ROMs or downloads.
- PC requests and votes use this browser's local storage only. They are not transmitted to Nintendo, uploaded to a server or counted as global community votes.
- The website does not emulate games, provide game ROMs or distribute copyrighted assets.

### Checks

Use Node.js 22 or later:

```bash
node --check app.js
node --test tests/site.test.cjs
```

GitHub Actions runs the static checks for website changes.

## AI-maintained project notes (secondary — 2026-11-14)

This section supplements the maintainer-authored README above. The preceding README text is restored from the last fuller maintainer-authored version at commit `a581542257b171a6f9c9052788b572f87ac7d7a0`. It is preserved above rather than replaced by generated project notes.

- The current source tree, runtime data and tests are the implementation source of truth. Roadmap items, draft PRs and AI-generated descriptions are not shipped features by themselves.
- Preserve real and maintainer-provided data. Never silently substitute generated or placeholder data. Clearly label and isolate synthetic fixtures.
- Mark unverified sources, identifiers, metrics, benchmark results and external claims as unknown/unverified rather than guessing.
- Verify setup, execution, tests and public claims against the exact current commit before using this repository in a job, research or academic application.
- The current `index.html` references `styles.css` and `app.js`, but neither file is present in the `main` branch tree checked on 2026-11-14. The page's styling and interactive catalogue behaviour are therefore not verified as working. Do not describe it as a functioning emulator; the HTML itself describes a fan-made game catalogue and says no game files are hosted.
- See [MODEL_AUDIT_ROUTER.md](MODEL_AUDIT_ROUTER.md) for independent model review instructions and the merge gate.
