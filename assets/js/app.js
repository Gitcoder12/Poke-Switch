"use strict";

const POKEMON_GAME_HUB = "https://in.portal-pokemon.com/game/";
const NINTENDO_GAME_HUB = "https://www.nintendo.com/us/store/games/pokemon-games/";
const NINTENDO_SUPPORT = "https://en-americas-support.nintendo.com/app/home";
const POKEAPI = "https://pokeapi.co/api/v2";
const DEX_LIMIT = 2000;
const themes = ["league","kanto","johto","hoenn","sinnoh","unova","kalos","alola","galar","paldea"];
const themeLabels = {
  league:"Pokémon League",kanto:"Kanto",johto:"Johto",hoenn:"Hoenn",sinnoh:"Sinnoh",
  unova:"Unova",kalos:"Kalos",alola:"Alola",galar:"Galar",paldea:"Paldea"
};

const { games, fanProjects, mobileApps } = window.PokeSwitchData || {
  games: [],
  fanProjects: [],
  mobileApps: []
};
const regions = Array.isArray(window.PokeSwitchRegions) ? window.PokeSwitchRegions : [];
const APP_STORE_DEVELOPER_URL = "https://apps.apple.com/in/developer/the-pokemon-company/id446737235";
const GOOGLE_PLAY_DEVELOPER_URL = "https://play.google.com/store/apps/developer?hl=en_IN&id=The+Pok%C3%A9mon+Company";

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const escapeHTML = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[char]));
const safeStorage = {
  get(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch (_) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { showToast("Browser storage is unavailable. Your change may not be saved."); return false; }
  }
};
function showToast(message) {
  const toast=$("#toast");
  if (!toast) return;
  toast.textContent=message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer=window.setTimeout(()=>toast.classList.remove("show"),2400);
}
function externalLink(url,label) {
  return '<a href="'+escapeHTML(url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(label)+' ↗</a>';
}

let currentGameKind="all";
let currentGameView="grid";
let currentFanKind="all";
let gameSearchTerm="";
let selectedGameGeneration="all";

function renderStoreBadges(game) {
  const platform = String(game.platform || "");
  const badges = [];
  if (/Nintendo Switch|Switch 2/i.test(platform)) {
    badges.push('<a class="store-badge store-eshop" href="'+NINTENDO_GAME_HUB+'" target="_blank" rel="noopener noreferrer" aria-label="Browse Pokémon titles in the Nintendo eShop"><span class="store-mark">N</span><span>Nintendo eShop</span></a>');
  }
  if (/Mobile|Android|iOS/i.test(platform)) {
    badges.push('<a class="store-badge store-app-store" href="'+APP_STORE_DEVELOPER_URL+'" target="_blank" rel="noopener noreferrer" aria-label="Browse The Pokémon Company apps in the App Store"><span class="store-mark">A</span><span>App Store</span></a>');
    badges.push('<a class="store-badge store-google-play" href="'+GOOGLE_PLAY_DEVELOPER_URL+'" target="_blank" rel="noopener noreferrer" aria-label="Browse The Pokémon Company apps on Google Play"><span class="store-mark">▶</span><span>Google Play</span></a>');
  }
  return badges.length ? '<div class="game-store-links" aria-label="Official platform directories">'+badges.join("")+'</div>' : "";
}

function renderGames() {
  const query=gameSearchTerm.trim().toLowerCase();
  const items=games.filter(game=>{
    const matchesKind=currentGameKind==="all" || game.kind===currentGameKind;
    const matchesGeneration=selectedGameGeneration==="all" ||
      (selectedGameGeneration==="spin-off" && game.kind==="spin-off") ||
      (selectedGameGeneration==="upcoming" && game.kind==="upcoming") ||
      String(game.gen)===selectedGameGeneration;
    const matchesQuery=!query || [game.title,game.region,game.platform,game.summary].join(" ").toLowerCase().includes(query);
    return matchesKind && matchesGeneration && matchesQuery;
  });
  const grid=$("#game-grid");
  grid.classList.toggle("list-view",currentGameView==="list");
  $("#game-result-count").textContent=items.length+" curated entries";
  if (!items.length) {
    grid.innerHTML='<div class="empty-state">No games match those filters. Try another title or generation.</div>';
    return;
  }
  grid.innerHTML=items.map(game=>{
    const era=game.kind==="upcoming" ? "UPCOMING" : game.kind==="spin-off" ? "SPIN-OFF" : "GEN "+game.gen;
    const status=game.kind==="upcoming" ? "Announced" : "Official series";
    return '<article class="game-card">'+
      '<div class="game-card-top"><span class="game-chip">'+era+'</span><span class="status-chip">'+status+'</span></div>'+
      '<div class="game-card-heading"><h3>'+escapeHTML(game.title)+'</h3>'+renderStoreBadges(game)+'</div><p class="game-meta">'+escapeHTML(game.region)+' · '+escapeHTML(game.platform)+'</p>'+
      '<div class="game-card-bottom"><span>'+escapeHTML(game.summary)+'</span>'+externalLink(POKEMON_GAME_HUB,"Official details")+'</div>'+
    '</article>';
  }).join("");
}

function initGames() {
  $("#game-search").addEventListener("input",event=>{gameSearchTerm=event.target.value;renderGames();});
  $("#game-generation").addEventListener("change",event=>{selectedGameGeneration=event.target.value;renderGames();});
  $("#game-kind-filters").addEventListener("click",event=>{
    const button=event.target.closest("[data-kind]");
    if (!button) return;
    currentGameKind=button.dataset.kind;
    $$("[data-kind]").forEach(item=>item.classList.toggle("active",item===button));
    renderGames();
  });
  $$("[data-game-view]").forEach(button=>button.addEventListener("click",()=>{
    currentGameView=button.dataset.gameView;
    $$("[data-game-view]").forEach(item=>item.classList.toggle("active",item===button));
    renderGames();
  }));
  renderGames();
}

function renderFanGames() {
  const entries=fanProjects.filter(project=>currentFanKind==="all" || project.kind===currentFanKind);
  $("#fan-grid").innerHTML=entries.map(project=>
    '<article class="fan-card">'+
      '<div class="fan-card-head"><span class="fan-type">'+escapeHTML(project.type)+'</span><span class="fan-symbol">✳</span></div>'+
      '<h3>'+escapeHTML(project.name)+'</h3>'+
      '<p>'+escapeHTML(project.desc)+'</p>'+
      '<div class="fan-card-foot"><span class="platform-label">'+escapeHTML(project.platform)+'</span>'+externalLink(project.url,project.label)+'</div>'+
    '</article>'
  ).join("");
}
function initFanGames() {
  $("#fan-filters").addEventListener("click",event=>{
    const button=event.target.closest("[data-fan-kind]");
    if (!button) return;
    currentFanKind=button.dataset.fanKind;
    $$("[data-fan-kind]").forEach(item=>item.classList.toggle("active",item===button));
    renderFanGames();
  });
  renderFanGames();
}

function renderMobileApps() {
  $("#mobile-grid").innerHTML=mobileApps.map((app,index)=>
    '<article class="mobile-card">'+
      '<div class="mobile-app-icon">'+escapeHTML(app.symbol)+'</div>'+
      '<h3>'+escapeHTML(app.name)+'</h3>'+
      '<p>'+escapeHTML(app.category)+'<br>'+escapeHTML(app.platform)+'</p>'+
      '<a href="'+escapeHTML(app.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(app.note)+' ↗</a>'+
    '</article>'
  ).join("");
}

function applyTheme(theme) {
  if (!themes.includes(theme)) theme="league";
  document.body.dataset.theme=theme;
  safeStorage.set("poke-switch:theme:v2",theme);
  $$("[data-theme-choice]").forEach(button=>button.classList.toggle("active",button.dataset.themeChoice===theme));
  $$(".theme-choice").forEach(button=>button.classList.toggle("active",button.dataset.themeChoice===theme));
}
function initThemes() {
  const themeGrid=$("#theme-dialog-options");
  themeGrid.innerHTML=themes.map(theme=>
    '<button class="theme-choice" data-theme-choice="'+theme+'" type="button"><i class="theme-dot dot-'+theme+'"></i>'+escapeHTML(themeLabels[theme])+'</button>'
  ).join("");
  const stored=safeStorage.get("poke-switch:theme:v2","league");
  applyTheme(stored);
  $("#theme-options").addEventListener("click",event=>{
    const button=event.target.closest("[data-theme-choice]");
    if (button) applyTheme(button.dataset.themeChoice);
  });
  themeGrid.addEventListener("click",event=>{
    const button=event.target.closest("[data-theme-choice]");
    if (!button) return;
    applyTheme(button.dataset.themeChoice);
    $("#theme-dialog").close();
  });
  $("#theme-open").addEventListener("click",()=>$("#theme-dialog").showModal());
  $("#theme-dialog-close").addEventListener("click",()=>$("#theme-dialog").close());
}

const CACHE_PREFIX="poke-switch:api:";
const MEMORY_CACHE=new Map();
async function getJSON(path,ttl=7*24*60*60*1000) {
  const key=CACHE_PREFIX+path;
  if (MEMORY_CACHE.has(key)) return MEMORY_CACHE.get(key);
  const cached=safeStorage.get(key,null);
  if (cached && cached.savedAt && Date.now()-cached.savedAt<ttl) {
    MEMORY_CACHE.set(key,cached.value);
    return cached.value;
  }
  const response=await fetch(POKEAPI+path,{headers:{Accept:"application/json"}});
  if (!response.ok) throw new Error("PokéAPI returned HTTP "+response.status);
  const data=await response.json();
  MEMORY_CACHE.set(key,data);
  safeStorage.set(key,{savedAt:Date.now(),value:data});
  return data;
}

let pokemonList=[];
let dexVisible=30;
let dexFiltered=[];
let dexType="all";
let dexQuery="";
let dexLoading=false;
function pokemonIdFromUrl(url) {
  const parts=String(url).split("/").filter(Boolean);
  return Number(parts[parts.length-1]) || 0;
}
function spriteUrl(id) {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"+id+".png";
}
function shortDexNumber(id) {return "#"+String(id).padStart(4,"0");}
function typePills(types) {
  return (types||[]).map(item=>{
    const name=typeof item==="string"?item:item.type.name;
    return '<span class="type-badge type-'+escapeHTML(name)+'">'+escapeHTML(name)+'</span>';
  }).join("");
}
function renderDex() {
  const grid=$("#dex-grid");
  const items=dexFiltered.slice(0,dexVisible);
  $("#dex-count").textContent=dexFiltered.length.toLocaleString()+" Pokémon in this result";
  $("#dex-load-more").hidden=dexVisible>=dexFiltered.length;
  if (!items.length) {
    grid.innerHTML='<div class="empty-state">No Pokémon found. Try a different name, number or type.</div>';
    return;
  }
  grid.innerHTML=items.map(item=>
    '<button class="dex-card" type="button" data-pokemon-id="'+item.id+'" aria-label="Open '+escapeHTML(item.name)+' details">'+
      '<div class="dex-card-top"><span class="dex-number">'+shortDexNumber(item.id)+'</span><span class="dex-card-label">POKÉMON CARD</span></div>'+
      '<div class="dex-art"><img src="'+spriteUrl(item.id)+'" alt="Official artwork of '+escapeHTML(item.name.replace(/-/g," "))+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+item.id+'.png\'"></div>'+
      '<div class="dex-card-info"><span class="dex-name">'+escapeHTML(item.name.replace(/-/g," "))+'</span>'+
      '<span class="dex-card-footer">NATIONAL POKÉDEX <span>↗</span></span></div>'+
    '</button>'
  ).join("");
  grid.querySelectorAll("[data-pokemon-id]").forEach(button=>button.addEventListener("click",()=>openPokemon(Number(button.dataset.pokemonId))));
}
function applyDexFilters() {
  const query=dexQuery.trim().toLowerCase().replace(/^#/,"");
  dexFiltered=pokemonList.filter(item=>{
    const nameMatch=item.name.includes(query);
    const idMatch=query && String(item.id).includes(query);
    return (!query || nameMatch || idMatch);
  });
  dexVisible=30;
  if (dexType!=="all") loadDexType(dexType);
  else renderDex();
}
async function loadDexType(type) {
  try {
    const response=await getJSON("/type/"+encodeURIComponent(type));
    const ids=new Set(response.pokemon.map(entry=>pokemonIdFromUrl(entry.pokemon.url)));
    dexFiltered=pokemonList.filter(item=>ids.has(item.id) && (!dexQuery.trim() || item.name.includes(dexQuery.trim().toLowerCase()) || String(item.id).includes(dexQuery.trim().toLowerCase().replace(/^#/,""))));
    renderDex();
  } catch(error) {
    $("#dex-grid").innerHTML='<div class="empty-state">Type filter is unavailable right now. '+escapeHTML(error.message)+'</div>';
  }
}
async function initDex() {
  if (dexLoading) return;
  dexLoading=true;
  $("#dex-grid").innerHTML='<div class="empty-state">Loading the National Pokédex…</div>';
  try {
    const data=await getJSON("/pokemon-species?limit="+DEX_LIMIT+"&offset=0");
    pokemonList=data.results.map(item=>({name:item.name,id:pokemonIdFromUrl(item.url)})).filter(item=>item.id>0);
    pokemonList.sort((a,b)=>a.id-b.id);
    dexFiltered=pokemonList;
    $("#dex-count").textContent=pokemonList.length.toLocaleString()+" Pokémon indexed";
    renderDex();
  } catch(error) {
    $("#dex-grid").innerHTML='<div class="empty-state">The live Pokédex could not connect. Check your connection and retry.<br><button class="button button-ghost" id="dex-retry" type="button">Retry</button></div>';
    const retry=$("#dex-retry");
    if (retry) retry.addEventListener("click",()=>{dexLoading=false;initDex();});
  } finally {
    dexLoading=false;
  }
  $("#dex-search").addEventListener("input",event=>{
    dexQuery=event.target.value;
    if (dexType==="all") applyDexFilters(); else loadDexType(dexType);
  });
  $("#dex-type").addEventListener("change",event=>{
    dexType=event.target.value;
    applyDexFilters();
  });
  $("#dex-load-more").addEventListener("click",()=>{
    dexVisible+=30;
    renderDex();
  });
  $("#random-pokemon").addEventListener("click",async()=>{
    if (!pokemonList.length) {showToast("The Pokédex is still loading.");return;}
    const item=pokemonList[Math.floor(Math.random()*pokemonList.length)];
    await openPokemon(item.id);
  });
}
async function openPokemon(id) {
  const dialog=$("#pokemon-dialog");
  const content=$("#pokemon-dialog-content");
  content.innerHTML='<div class="empty-state">Loading Pokémon #'+id+'…</div>';
  dialog.showModal();
  try {
    const results=await Promise.all([
      getJSON("/pokemon/"+id,24*60*60*1000),
      getJSON("/pokemon-species/"+id,7*24*60*60*1000)
    ]);
    const pokemon=results[0],species=results[1];
    const entry=(species.flavor_text_entries||[]).find(item=>item.language.name==="en" && item.version.name==="scarlet") ||
      (species.flavor_text_entries||[]).find(item=>item.language.name==="en") || null;
    const flavor=entry?entry.flavor_text.replace(/[\f\n\r]/g," "):"No English Pokédex entry is available for this Pokémon.";
    const artwork=pokemon.sprites.other && pokemon.sprites.other["official-artwork"];
    const home=pokemon.sprites.other && pokemon.sprites.other.home;
    const gallery=[
      {label:"Official artwork",kind:"OFFICIAL ART",src:artwork && artwork.front_default},
      {label:"Shiny artwork",kind:"SHINY ART",src:artwork && artwork.front_shiny},
      {label:"HOME render",kind:"HOME RENDER",src:home && home.front_default},
      {label:"Shiny HOME render",kind:"SHINY HOME",src:home && home.front_shiny},
      {label:"Classic sprite",kind:"SPRITE",src:pokemon.sprites.front_default},
      {label:"Shiny sprite",kind:"SHINY SPRITE",src:pokemon.sprites.front_shiny}
    ].filter((item,index,list)=>item.src && list.findIndex(other=>other.src===item.src)===index);
    if(!gallery.length) gallery.push({label:"Official artwork",kind:"OFFICIAL ART",src:spriteUrl(id)});
    const stats=pokemon.stats.map(stat=>{
      const name=stat.stat.name.replace("special-","sp. ");
      const value=stat.base_stat;
      return '<div class="stat-row"><span>'+escapeHTML(name)+'</span><span class="stat-track"><span class="stat-fill" style="display:block;width:'+Math.min(100,value/2)+'%"></span></span><b>'+value+'</b></div>';
    }).join("");
    const thumbnails=gallery.map((image,index)=>
      '<button class="gallery-thumb '+(index===0?"active":"")+'" type="button" data-gallery-index="'+index+'" aria-label="Show '+escapeHTML(image.label)+'" aria-pressed="'+(index===0)+'">'+
        '<img src="'+escapeHTML(image.src)+'" alt="" loading="lazy" decoding="async"><span>'+escapeHTML(image.label)+'</span></button>'
    ).join("");
    content.innerHTML=
      '<div class="pokemon-lightbox-layout">'+
        '<section class="pokemon-gallery-panel" aria-label="Pokémon artwork gallery">'+
          '<div class="pokemon-gallery-heading"><span class="gallery-kicker">SPECIMEN VISUAL ARCHIVE</span><span class="gallery-kind" id="gallery-kind">'+escapeHTML(gallery[0].kind)+'</span></div>'+
          '<div class="pokemon-gallery-stage"><div class="gallery-stage-disc"></div><img id="pokemon-gallery-main" src="'+escapeHTML(gallery[0].src)+'" alt="Official artwork of '+escapeHTML(pokemon.name.replace(/-/g," "))+'" decoding="async"></div>'+
          '<div class="pokemon-gallery-thumbs" role="group" aria-label="Available artwork and sprite views">'+thumbnails+'</div>'+
          '<p class="gallery-source-note">Available artwork and sprites served by the PokéAPI sprite collection. Some Pokémon have fewer image variants.</p>'+
        '</section>'+
        '<aside class="pokemon-detail-panel">'+
          '<div class="pokemon-detail-overline">NATIONAL POKÉDEX <span>'+shortDexNumber(id)+'</span></div>'+
          '<h2 id="pokemon-dialog-title">'+escapeHTML(pokemon.name.replace(/-/g," "))+'</h2>'+
          '<div class="dialog-types">'+typePills(pokemon.types)+'</div>'+
          '<div class="pokemon-detail-meta"><span>Height <b>'+(pokemon.height/10).toFixed(1)+' m</b></span><span>Weight <b>'+(pokemon.weight/10).toFixed(1)+' kg</b></span></div>'+
          '<p class="pokemon-detail-flavor">'+escapeHTML(flavor)+'</p>'+
          '<h3 class="stats-heading">BASE STAT PROFILE</h3><div class="stats-list">'+stats+'</div>'+
          '<p class="source-note">Species entry and base stats from PokéAPI. Descriptions can vary by game version.</p>'+
        '</aside>'+
      '</div>';
    content.querySelectorAll("[data-gallery-index]").forEach(button=>button.addEventListener("click",()=>{
      const selected=gallery[Number(button.dataset.galleryIndex)];
      if(!selected) return;
      const main=$("#pokemon-gallery-main",content);
      main.src=selected.src;
      main.alt=selected.label+" of "+pokemon.name.replace(/-/g," ");
      $("#gallery-kind",content).textContent=selected.kind;
      content.querySelectorAll("[data-gallery-index]").forEach(item=>{
        const active=item===button;
        item.classList.toggle("active",active);
        item.setAttribute("aria-pressed",String(active));
      });
    }));
  } catch(error) {
    content.innerHTML='<div class="empty-state">Could not load this Pokémon right now. '+escapeHTML(error.message)+'</div>';
  }
}
function initDexDialog() {
  $("#pokemon-dialog-close").addEventListener("click",()=>$("#pokemon-dialog").close());
  $("#pokemon-dialog").addEventListener("click",event=>{
    if (event.target===$("#pokemon-dialog")) $("#pokemon-dialog").close();
  });
}

async function loadDailyFact() {
  const day=Math.floor(Date.now()/86400000);
  const id=(day%1025)+1;
  const art=$("#daily-art");
  $("#daily-name").textContent="Loading today's entry…";
  $("#daily-text").textContent="Looking up a Pokédex entry for today.";
  try {
    const values=await Promise.all([getJSON("/pokemon/"+id),getJSON("/pokemon-species/"+id)]);
    const pokemon=values[0],species=values[1];
    const entries=(species.flavor_text_entries||[]).filter(item=>item.language.name==="en");
    const chosen=entries.find(item=>item.version.name==="scarlet") || entries[0];
    $("#daily-name").textContent=pokemon.name.replace(/-/g," ")+" · "+shortDexNumber(id);
    $("#hero-daily-name").textContent=pokemon.name.replace(/-/g," ");
    $("#daily-text").textContent=chosen?chosen.flavor_text.replace(/[\f\n\r]/g," "):"Discover this Pokémon in the Pokédex.";
    $("#daily-source").textContent=(chosen?"Pokédex entry · "+chosen.version.name:"Pokédex entry")+" · Powered by PokéAPI";
    art.innerHTML='<img src="'+spriteUrl(id)+'" alt="" loading="lazy">';
  } catch(error) {
    $("#daily-name").textContent="Daily entry unavailable";
    $("#daily-text").textContent="The Pokédex service could not be reached. The rest of Poke-Switch still works.";
    $("#daily-source").textContent="Try again when the connection is available.";
  }
}
function initDaily() {
  loadDailyFact();
  $("#daily-refresh").addEventListener("click",loadDailyFact);
}

const defaultRequests=[
  {id:"wish-scarlet-violet",title:"Pokémon Scarlet & Violet",votes:0},
  {id:"wish-legends-za",title:"Pokémon Legends: Z-A",votes:0},
  {id:"wish-legends-arceus",title:"Pokémon Legends: Arceus",votes:0},
  {id:"wish-classics",title:"A classic Pokémon collection for PC",votes:0}
];
let requests=safeStorage.get("poke-switch:requests",null);
if (!Array.isArray(requests)) requests=defaultRequests.slice();
let votedRequests=new Set(safeStorage.get("poke-switch:voted",[]));
function saveRequests() {
  safeStorage.set("poke-switch:requests",requests);
  safeStorage.set("poke-switch:voted",Array.from(votedRequests));
}
function renderRequests() {
  const list=$("#request-list");
  const sorted=requests.slice().sort((a,b)=>b.votes-a.votes || a.title.localeCompare(b.title));
  if (!sorted.length) {
    list.innerHTML='<div class="empty-state">No requests yet. Add the first PC release wish.</div>';
    return;
  }
  list.innerHTML=sorted.map(request=>{
    const voted=votedRequests.has(request.id);
    return '<div class="request-item"><button class="vote-button '+(voted?"voted":"")+'" type="button" data-vote="'+escapeHTML(request.id)+'" aria-label="'+(voted?"Remove your vote":"Vote for")+' '+escapeHTML(request.title)+'" aria-pressed="'+voted+'">'+(voted?"✓":"↑")+'</button><span class="request-title">'+escapeHTML(request.title)+'</span><span class="request-votes">'+request.votes+' local vote'+(request.votes===1?"":"s")+'</span></div>';
  }).join("");
  list.querySelectorAll("[data-vote]").forEach(button=>button.addEventListener("click",()=>toggleVote(button.dataset.vote)));
}
function toggleVote(id) {
  const request=requests.find(item=>item.id===id);
  if (!request) return;
  if (votedRequests.has(id)) {
    votedRequests.delete(id);
    request.votes=Math.max(0,request.votes-1);
  } else {
    votedRequests.add(id);
    request.votes+=1;
  }
  saveRequests();
  renderRequests();
}
function initRequests() {
  renderRequests();
  $("#request-form").addEventListener("submit",event=>{
    event.preventDefault();
    const input=$("#request-title");
    const title=input.value.trim();
    if (title.length<3) {showToast("Enter a game title first.");return;}
    const existing=requests.find(item=>item.title.toLowerCase()===title.toLowerCase());
    if (existing) {showToast("That request is already on your wishboard.");input.value="";return;}
    requests.push({id:"wish-"+Date.now().toString(36),title,votes:0});
    saveRequests();
    renderRequests();
    input.value="";
    showToast("Added to your local PC wishboard.");
  });
  $("#copy-request").addEventListener("click",async()=>{
    const top=requests.slice().sort((a,b)=>b.votes-a.votes).slice(0,4).map((item,index)=>(index+1)+". "+item.title).join("\n");
    const message="Hello Nintendo team,\n\nI would love to see official Pokémon games become available on PC, alongside Nintendo platforms. My most-requested titles are:\n"+(top||"A Pokémon game collection for PC.")+"\n\nPlease consider PC releases or official PC versions in the future. Thank you for listening to fans.\n\n— A Pokémon player";
    try {
      await navigator.clipboard.writeText(message);
      $("#copy-feedback").textContent="Message copied. Open Nintendo Support to send your feedback.";
      showToast("Request message copied.");
    } catch(error) {
      const textarea=document.createElement("textarea");
      textarea.value=message;
      textarea.style.position="fixed";textarea.style.opacity="0";
      document.body.appendChild(textarea);textarea.select();
      const copied=document.execCommand("copy");
      textarea.remove();
      $("#copy-feedback").textContent=copied?"Message copied. Open Nintendo Support to send your feedback.":"Copy failed. Please select and copy the message manually.";
    }
  });
}

const VIEW_META = {
  discover:{title:"Discover",kicker:"FIELD GUIDE"},
  games:{title:"Game library",kicker:"OFFICIAL GAME ARCHIVE"},
  regions:{title:"Region atlas",kicker:"NINE REGION MAPS"},
  pokedex:{title:"Pokédex",kicker:"NATIONAL DEX"},
  "fan-games":{title:"Fan universe",kicker:"COMMUNITY PROJECTS"},
  mobile:{title:"Mobile games",kicker:"POKÉMON ON THE GO"},
  requests:{title:"PC wishboard",kicker:"COMMUNITY REQUESTS"}
};

function showView(name, updateHistory=false) {
  const viewName=Object.prototype.hasOwnProperty.call(VIEW_META,name)?name:"discover";
  $$(".app-view").forEach(view=>{
    const active=view.dataset.view===viewName;
    view.hidden=!active;
    view.classList.toggle("is-active",active);
  });
  $$(".side-link[data-view-target]").forEach(link=>{
    const active=link.dataset.viewTarget===viewName;
    link.classList.toggle("active",active);
    if(active) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
  const meta=VIEW_META[viewName];
  $("#page-heading").textContent=meta.title;
  $("#page-kicker").textContent=meta.kicker;
  document.title="Poke-Switch — "+meta.title;
  document.body.dataset.currentView=viewName;
  const activeView=$('.app-view[data-view="'+viewName+'"]');
  if(activeView) activeView.scrollTop=0;
  const main=$("#app-main");
  if(main) main.scrollTop=0;
  if(updateHistory) history.pushState({view:viewName},"","#"+viewName);
}

function renderRegions() {
  const grid=$("#region-grid");
  if(!grid) return;
  if(!regions.length) {
    grid.innerHTML='<div class="empty-state">The region atlas data is unavailable.</div>';
    return;
  }
  grid.innerHTML=regions.map((region,index)=>
    '<button class="region-card" type="button" data-region-id="'+escapeHTML(region.id)+'" aria-label="Open the '+escapeHTML(region.name)+' region map">'+
      '<span class="region-card-number">0'+(index+1)+'</span>'+
      '<span class="region-card-generation">GEN '+escapeHTML(region.generation)+'</span>'+
      '<span class="region-card-art"><img src="'+escapeHTML(region.image)+'" alt="'+escapeHTML(region.imageAlt)+'" loading="lazy" decoding="async"></span>'+
      '<span class="region-card-copy"><b>'+escapeHTML(region.name)+'</b><small>'+escapeHTML(region.games)+'</small><span class="region-card-open">EXPLORE MAP <i>↗</i></span></span>'+
    '</button>'
  ).join("");
  grid.querySelectorAll("[data-region-id]").forEach(button=>button.addEventListener("click",()=>openRegion(button.dataset.regionId)));
  grid.querySelectorAll("img").forEach(image=>image.addEventListener("error",()=>{
    image.closest(".region-card-art").classList.add("map-unavailable");
    image.remove();
  },{once:true}));
}

function openRegion(id) {
  const region=regions.find(item=>item.id===id);
  if(!region) return;
  const dialog=$("#region-dialog");
  const content=$("#region-dialog-content");
  const landmarks=region.landmarks.map(item=>'<span class="landmark-chip">'+escapeHTML(item)+'</span>').join("");
  content.innerHTML=
    '<div class="region-dialog-layout">'+
      '<section class="region-dialog-map">'+
        '<div class="region-dialog-map-top"><span>REGION MAP / GEN '+escapeHTML(region.generation)+'</span><a href="'+escapeHTML(region.source)+'" target="_blank" rel="noopener noreferrer">OPEN SOURCE ↗</a></div>'+
        '<div class="region-map-frame"><img src="'+escapeHTML(region.image)+'" alt="'+escapeHTML(region.imageAlt)+'" decoding="async"></div>'+
        '<p class="region-map-caption">'+escapeHTML(region.sourceLabel)+'</p>'+
      '</section>'+
      '<aside class="region-dialog-copy">'+
        '<span class="section-overline">REGION ATLAS / GENERATION '+escapeHTML(region.generation)+'</span>'+
        '<h2 id="region-dialog-title">'+escapeHTML(region.name)+'</h2>'+
        '<p>'+escapeHTML(region.description)+'</p>'+
        '<div class="region-dialog-section"><b>LANDMARKS TO FIND</b><div class="landmark-list">'+landmarks+'</div></div>'+
        '<div class="region-dialog-section"><b>FEATURED GAMES</b><p>'+escapeHTML(region.games)+'</p></div>'+
        '<a class="region-source-link" href="'+escapeHTML(region.source)+'" target="_blank" rel="noopener noreferrer">View map source <span>↗</span></a>'+
        '<p class="region-rights-note">Map artwork is owned by its respective rights holders. Source links identify the referenced map or product collection.</p>'+
      '</aside>'+
    '</div>';
  const image=$(".region-map-frame img",content);
  image.addEventListener("error",()=>{
    image.closest(".region-map-frame").classList.add("map-unavailable");
    image.remove();
  },{once:true});
  dialog.showModal();
}

function initRegionDialog() {
  const dialog=$("#region-dialog");
  $("#region-dialog-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",event=>{
    if(event.target===dialog) dialog.close();
  });
}

function closeMobileNavigation() {
  const sidebar=$("#app-sidebar"),toggle=$("#menu-toggle"),scrim=$("#app-mobile-scrim");
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Open navigation");
  toggle.textContent="☰";
}

function initNavigation() {
  const toggle=$("#menu-toggle"),sidebar=$("#app-sidebar"),scrim=$("#app-mobile-scrim");
  document.addEventListener("click",event=>{
    const link=event.target.closest("[data-view-target]");
    if(!link) return;
    if(event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showView(link.dataset.viewTarget,true);
    closeMobileNavigation();
  });
  toggle.addEventListener("click",()=>{
    const open=!sidebar.classList.contains("open");
    sidebar.classList.toggle("open",open);
    scrim.classList.toggle("show",open);
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    toggle.textContent=open?"×":"☰";
  });
  scrim.addEventListener("click",closeMobileNavigation);
  window.addEventListener("popstate",()=>{
    showView(location.hash.slice(1)||"discover",false);
    closeMobileNavigation();
  });
  const initial=location.hash.slice(1);
  showView(initial||"discover",false);
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape") closeMobileNavigation();
    if(event.key==="/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      const current=document.body.dataset.currentView;
      const target=current==="pokedex"?"#dex-search":current==="games"?"#game-search":null;
      if(target) $(target).focus();
    }
  });
}

function initApp() {
  initGames();
  renderRegions();
  initRegionDialog();
  initFanGames();
  renderMobileApps();
  initThemes();
  initDexDialog();
  initDaily();
  initRequests();
  initNavigation();
  initDex();
}
document.addEventListener("DOMContentLoaded",initApp);
