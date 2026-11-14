# Poke-Switch

A Pokémon discovery hub for games, fan projects, the Pokédex and mobile adventures.

## Open the website

**Windows:** double-click `run-local.bat` in this folder. It starts the local website and opens your browser.

Keep the black server window open while you use the site. Close that window or press `Ctrl + C` to stop it.

**Manual start:** open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit:

**http://localhost:8000**

You need Python 3 and an internet connection for live Pokédex data. No npm install or build step is needed.

## What is included

- Pokémon game catalogue with search, generation filters and grid/list layouts.
- Ten region-inspired colour themes.
- Curated unofficial fan-game directory with links to project pages.
- Searchable Pokédex with Pokémon artwork, types, stats and Pokédex entries.
- Daily Pokémon entry and random Pokémon discovery.
- Official Pokémon mobile-game links.
- PC-release wishboard with local add and vote controls and a message you can copy to Nintendo.

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
- Pokémon illustrations use the official-artwork files available in the [PokéAPI sprites repository](https://github.com/PokeAPI/sprites). Artwork is shown at its available source resolution; images are not artificially upscaled and are not guaranteed to be 4K.
- The game and fan-project directories are curated selections, not exhaustive lists. Check the linked publishers or project creators for current availability.
- PC requests and votes stay in the visitor's browser. They are not sent to Nintendo and are not global vote totals.
- Fan projects are unofficial. Poke-Switch does not host ROMs, game files or copyrighted downloads.

## Development checks

Use Node.js 22 or later:

```bash
node --check assets/js/app.js
node --test tests/site.test.cjs
```

## Official links

- [Pokémon](https://www.pokemon.com/)
- [Pokémon games](https://in.portal-pokemon.com/game/)
- [Nintendo](https://www.nintendo.com/)
- [PokéCommunity](https://www.pokecommunity.com/)

## Disclaimer

Poke-Switch is an independent fan project. It is not affiliated with, endorsed by or sponsored by Nintendo, GAME FREAK, Creatures Inc. or The Pokémon Company. Pokémon names, characters and artwork belong to their respective rights holders.
