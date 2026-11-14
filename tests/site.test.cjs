"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "assets", "js", "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "assets", "css", "styles.css"), "utf8");
const catalogue = fs.readFileSync(path.join(root, "data", "catalogue.js"), "utf8");
const regionData = fs.readFileSync(path.join(root, "data", "regions.js"), "utf8");

test("the Windows launcher starts the documented local server", () => {
  const launcher = fs.readFileSync(path.join(root, "run-local.bat"), "utf8");
  assert.match(launcher, /python -m http.server 8000/);
  assert.match(launcher, /http:\/\/localhost:8000/);
});

test("the page loads local styles, catalogue data and application code", () => {
  assert.match(html, /href="assets\/css\/styles\.css"/);
  assert.match(html, /src="data\/catalogue\.js"/);
  assert.match(html, /src="data\/regions\.js"/);
  assert.match(html, /src="assets\/js\/app\.js"/);
  assert.ok(fs.existsSync(path.join(root, "assets", "css", "styles.css")));
  assert.ok(fs.existsSync(path.join(root, "assets", "js", "app.js")));
  assert.ok(fs.existsSync(path.join(root, "data", "catalogue.js")));
});

test("every in-page navigation link has a matching target", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
  const known = new Set(ids);
  const fragments = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  for (const fragment of fragments) {
    assert.ok(known.has(fragment), "Missing in-page target: #" + fragment);
  }
});

test("all requested product areas and application hooks are present", () => {
  for (const id of ["games", "fan-games", "pokedex", "mobile", "requests"]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing section: " + id);
  }
  for (const feature of [
    "pokemon-species", "pokemon-species/", "type/",
    "localStorage", "poke-switch:requests", "poke-switch:voted",
    "data-theme-choice", "PokeSwitchData", "poke-switch:theme:v2"
  ]) {
    assert.ok(app.includes(feature), "Missing application feature hook: " + feature);
  }
  assert.match(html, /id="game-generation"/);
});

test("catalogue data is separate from the application logic", () => {
  assert.match(catalogue, /games:\s*\[/);
  assert.match(catalogue, /fanProjects:\s*\[/);
  assert.match(catalogue, /mobileApps:\s*\[/);
  assert.match(app, /window\.PokeSwitchData/);
});

test("PokéAPI responses are cached in browser storage", () => {
  assert.match(app, /CACHE_PREFIX/);
  assert.match(app, /savedAt/);
  assert.match(app, /safeStorage\.set\(key/);
});

test("PC requests are explicitly local-only and do not POST to Nintendo", () => {
  assert.match(html, /LOCAL TO THIS BROWSER/);
  assert.match(html, /not sent to Nintendo automatically/);
  assert.match(app, /poke-switch:requests/);
  assert.doesNotMatch(app, /method\s*:\s*["']POST["']/i);
  assert.match(app, /NINTENDO_SUPPORT/);
});

test("fan directory links to project pages, not hosted ROM or installer files", () => {
  const block = catalogue.split("fanProjects: [")[1].split("mobileApps: [")[0];
  const urls = [...block.matchAll(/url:"(https:[^"]+)"/g)].map(match => match[1]);
  assert.ok(urls.length >= 10, "Expected a useful curated fan-project directory");
  for (const url of urls) {
    assert.match(url, /^https:/);
    assert.doesNotMatch(url, /\.(?:zip|gba|gbc|gb|iso|rom|exe)(?:$|\?)/i);
  }
});

test("region themes are defined in JavaScript and CSS", () => {
  const themeNames = ["league","kanto","johto","hoenn","sinnoh","unova","kalos","alola","galar","paldea"];
  for (const name of themeNames) {
    assert.ok(app.includes('"' + name + '"'), "Missing JS theme: " + name);
    if (name === "league") {
      assert.match(css, /:root\s*\{/);
    } else {
      assert.ok(css.includes('data-theme="' + name + '"'), "Missing CSS theme: " + name);
    }
  }
});

test("the default theme is light with a red accent and rounded card styling", () => {
  assert.match(css, /color-scheme:light/);
  assert.match(css, /--accent:#df2938/);
  assert.match(css, /\.dex-card\{[^}]*border-radius:25px/s);
  assert.match(css, /\.dex-art img\{[^}]*width:174px/s);
});

test("Pokédex cards use named official artwork and accessible image loading", () => {
  assert.match(app, /official-artwork/);
  assert.match(app, /Official artwork of /);
  assert.match(app, /decoding="async"/);
  assert.match(app, /POKÉMON CARD/);
});

test("README explains the Windows launcher and manual local URL without AI notes", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert.match(readme, /double-click `run-local\.bat`/);
  assert.match(readme, /http:\/\/localhost:8000/);
  assert.match(readme, /No npm install or build step is (needed|required)/);
  assert.doesNotMatch(readme, /AI-maintained project notes|AI-generated/);
});


test("the app has seven independent route views and a persistent navigation shell", () => {
  const routes = ["discover", "games", "regions", "pokedex", "fan-games", "mobile", "requests"];
  for (const route of routes) {
    assert.ok(html.includes('data-view="' + route + '"'), "Missing view: " + route);
    assert.ok(html.includes('data-view-target="' + route + '"'), "Missing navigation item: " + route);
    const metaKey = route === "fan-games" ? '"fan-games":{title:' : route + ":{title:";
    assert.ok(app.includes(metaKey), "Missing route metadata: " + route);
  }
  assert.ok(html.includes('class="app-sidebar"'));
  assert.ok(html.includes('class="app-topbar"'));
  assert.ok(html.includes('class="app-main"'));
  assert.ok(css.includes("body{margin:0;min-width:320px;height:100vh;overflow:hidden"));
  assert.ok(css.includes(".app-view[hidden]{display:none!important}"));
});

test("navigation changes views rather than scrolling to page anchors", () => {
  // showView iterates over NodeLists; a single querySelector result is not iterable.
  assert.ok(app.includes(String.fromCharCode(36).repeat(2)+'(".app-view").forEach(view=>'));
  assert.ok(app.includes(String.fromCharCode(36).repeat(2)+'(".side-link[data-view-target]").forEach(link=>'));
  assert.ok(app.includes("const initial=location.hash.slice(1);"));
  assert.ok(app.includes('showView(initial||"discover",false);'));
  assert.ok(app.includes("function showView("));
  assert.ok(app.includes("history.pushState"));
  assert.ok(app.includes('closest("[data-view-target]")'));
  assert.ok(css.includes(".app-view{height:100%;min-height:0;overflow-y:auto"));
});

test("the region atlas has nine sourced maps and opens a dedicated detail dialog", () => {
  const ids = [...regionData.matchAll(/id:"([a-z]+)",name:/g)].map(match => match[1]);
  assert.deepEqual(ids, ["kanto","johto","hoenn","sinnoh","unova","kalos","alola","galar","paldea"]);
  assert.equal((regionData.match(/image:"https:\/\//g) || []).length, 9);
  assert.equal((regionData.match(/source:"https:\/\//g) || []).length, 9);
  assert.match(html, /id="region-grid"/);
  assert.match(html, /id="region-dialog"/);
  assert.match(app, /function renderRegions\(/);
  assert.match(app, /function openRegion\(/);
  assert.match(app, /function initRegionDialog\(/);
});

test("Pokémon detail viewer exposes available official, shiny and sprite variants", () => {
  assert.match(app, /pokemon\.sprites\.other/);
  assert.match(app, /official-artwork/);
  assert.match(app, /front_shiny/);
  assert.match(app, /front_default/);
  assert.match(app, /data-gallery-index/);
  assert.match(html, /id="pokemon-dialog-content"/);
});

test("game cards show only the platform directories supported by catalogue metadata", () => {
  assert.match(app, /function renderStoreBadges\(game\)/);
  assert.match(app, /APP_STORE_DEVELOPER_URL/);
  assert.match(app, /GOOGLE_PLAY_DEVELOPER_URL/);
  assert.match(app, /NINTENDO_GAME_HUB/);
  assert.match(app, /Nintendo Switch\|Switch 2/);
  assert.match(app, /Mobile\|Android\|iOS/);
});

test("the interface does not include decorative emoji glyphs", () => {
  for (const [label, source] of [["HTML", html], ["application", app], ["catalogue", catalogue]]) {
    assert.doesNotMatch(source, /[⚡✳✉⚔☕☺]/u, label + " should use type and CSS accents instead");
  }
});


test("all app screens remain inside one shared main landmark", () => {
  const mainOpen = html.split("<main").length - 1;
  const mainClose = html.split("</main>").length - 1;
  assert.equal(mainOpen, 1, "The document must have one main landmark");
  assert.equal(mainClose, 1, "The main landmark must close exactly once");
  const mainStart = html.indexOf("<main");
  const mainEnd = html.indexOf("</main>");
  const viewStarts = [...html.matchAll(/<section class="app-view/g)].map(match => match.index);
  assert.equal(viewStarts.length, 7, "All seven app views must exist");
  for (const start of viewStarts) {
    assert.ok(start > mainStart && start < mainEnd, "Every app view must stay inside the shared main landmark");
  }
});


test("game cards and the PC wishboard render PokéAPI artwork with a sprite fallback", () => {
  assert.match(app, /function resolveGameArtwork\(title, region\)/);
  assert.match(app, /function renderGameArtwork\(game\)/);
  assert.match(app, /function renderWishArtwork\(request\)/);
  assert.match(app, /function bindPokemonArtworkFallbacks\(root\)/);
  assert.ok(app.includes("other/official-artwork/"));
  assert.ok(app.includes("data-pokemon-art"));
  assert.ok(app.includes("data-fallback"));
  assert.ok(app.includes("Koraidon + Miraidon"));
  assert.ok(app.includes("Zacian + Zamazenta"));
  assert.ok(app.includes("renderGameArtwork(game)"));
  assert.ok(app.includes("renderWishArtwork(request)"));
  assert.ok(app.includes("bindPokemonArtworkFallbacks(grid)"));
  assert.ok(app.includes("bindPokemonArtworkFallbacks(list)"));
  assert.match(html, /id="request-list"[^>]*aria-live="polite"/);
  assert.match(css, /\.game-card-art\{/);
  assert.match(css, /\.wish-artwork\{/);
});

test("wishboard input is bounded, duplicate titles are rejected, and votes remain local", () => {
  assert.match(app, /title\.length<3 \|\| title\.length>90/);
  assert.match(app, /requests\.find\(item=>item\.title\.toLowerCase\(\)===title\.toLowerCase\(\)\)/);
  assert.match(app, /function toggleVote\(id\)/);
  assert.ok(app.includes("poke-switch:voted"));
  assert.ok(app.includes("poke-switch:requests"));
});
