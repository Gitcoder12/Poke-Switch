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

## AI-maintained project notes (secondary — 2026-11-14)

This section supplements the maintainer-authored README above. The preceding README text is restored from the last fuller maintainer-authored version at commit `a581542257b171a6f9c9052788b572f87ac7d7a0`. It is preserved above rather than replaced by generated project notes.

- The current source tree, runtime data and tests are the implementation source of truth. Roadmap items, draft PRs and AI-generated descriptions are not shipped features by themselves.
- Preserve real and maintainer-provided data. Never silently substitute generated or placeholder data. Clearly label and isolate synthetic fixtures.
- Mark unverified sources, identifiers, metrics, benchmark results and external claims as unknown/unverified rather than guessing.
- Verify setup, execution, tests and public claims against the exact current commit before using this repository in a job, research or academic application.
- The current `index.html` references `styles.css` and `app.js`, but neither file is present in the `main` branch tree checked on 2026-11-14. The page's styling and interactive catalogue behaviour are therefore not verified as working. Do not describe it as a functioning emulator; the HTML itself describes a fan-made game catalogue and says no game files are hosted.
- See [MODEL_AUDIT_ROUTER.md](MODEL_AUDIT_ROUTER.md) for independent model review instructions and the merge gate.
