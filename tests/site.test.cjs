"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("the page loads its local stylesheet and application script", () => {
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="app\.js"/);
  assert.ok(fs.existsSync(path.join(root, "styles.css")));
  assert.ok(fs.existsSync(path.join(root, "app.js")));
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

test("all requested product areas are present", () => {
  for (const id of ["games", "fan-games", "pokedex", "mobile", "requests"]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing section: " + id);
  }
  for (const feature of [
    "pokemon-species", "pokemon-species/", "type/",
    "localStorage", "poke-switch:requests", "poke-switch:voted",
    "data-theme-choice"
  ]) {
    assert.ok(app.includes(feature), "Missing feature hook: " + feature);
  }
  assert.match(html, /id="game-generation"/);
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
  const block = app.split("const fanProjects = [")[1].split("const mobileApps = [")[0];
  const urls = [...block.matchAll(/url:"(https:[^"]+)"/g)].map(match => match[1]);
  assert.ok(urls.length >= 10, "Expected a useful curated fan-project directory");
  for (const url of urls) {
    assert.match(url, /^https:/);
    assert.doesNotMatch(url, /\.(?:zip|gba|gbc|gb|iso|rom|exe)(?:$|\?)/i);
  }
});

test("region themes are defined in both JavaScript and CSS", () => {
  const themeNames = ["league","kanto","johto","hoenn","sinnoh","unova","kalos","alola","galar","paldea"];
  for (const name of themeNames) {
    assert.ok(app.includes('"' + name + '"'), "Missing JS theme: " + name);
    if (name === "league") {
      assert.match(css, /:root\\s*\\{/);
    } else {
      assert.ok(css.includes('data-theme="' + name + '"'), "Missing CSS theme: " + name);
    }
  }
});
