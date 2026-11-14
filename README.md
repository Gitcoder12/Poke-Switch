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
