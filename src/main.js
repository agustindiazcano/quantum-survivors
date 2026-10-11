import './style.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { pickCards } from './cards.js';
import { lookup, sampleSector, MAX_QUANTUM_CARDS } from './weapon.js';

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const ui = {
  hud: $('hud'), hpFill: $('hp-fill'), hpText: $('hp-text'), xpFill: $('xp-fill'), xpText: $('xp-text'),
  waveText: $('wave-text'), enemiesText: $('enemies-text'), minimap: $('minimap'), banner: $('banner'),
  menu: $('menu'), cards: $('cards'), cardsRow: $('cards-row'), cardsTitle: $('cards-title'),
  gameover: $('gameover'), gameoverText: $('gameover-text'),
};
const mm = ui.minimap.getContext('2d');

// ---------- Three.js setup ----------
const container = $('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05000f);
scene.fog = new THREE.Fog(0x05000f, 40, 85);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const CAM_OFFSET = new THREE.Vector3(0, 24, 15);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.95, 0.55, 0.08);
composer.addPass(bloom);
composer.addPass(new OutputPass());

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// Floor grid that follows the player in whole cells so it looks infinite.
const GRID_CELL = 2;
const grid = new THREE.GridHelper(300, 150, 0xff2bd6, 0x2a1070);
grid.material.transparent = true;
grid.material.opacity = 0.7;
scene.add(grid);

// ---------- Helpers ----------
const rand = (a, b) => a + Math.random() * (b - a);
function makeNeon(geo, edges, lineMat, fillMat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, fillMat), new THREE.LineSegments(edges, lineMat));
  return g;
}
function neonShape(geo, color, fill = 0.15) {
  return makeNeon(geo, new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color }),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(fill) }));
}

// Enemy definitions (geometric shapes).
function enemyType(geo, color, r, hp, speed, dmg, xp) {
  return { geo, edges: new THREE.EdgesGeometry(geo), lineMat: new THREE.LineBasicMaterial({ color }),
    color, fill: new THREE.Color(color).multiplyScalar(0.18), r, hp, speed, dmg, xp };
}
const TYPES = {
  tetra: enemyType(new THREE.TetrahedronGeometry(0.85), 0xff2bd6, 0.7, 3, 4.4, 6, 1),
  cube: enemyType(new THREE.BoxGeometry(1.3, 1.3, 1.3), 0xffe94d, 0.85, 8, 3.0, 10, 2),
  octa: enemyType(new THREE.OctahedronGeometry(1.1), 0xff7a1a, 1.0, 18, 2.1, 15, 3),
};
const WHITE = new THREE.Color(0xffffff);

const projGeo = new THREE.SphereGeometry(0.22, 8, 8);
const projMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.3, 0.6) });
const gemGeo = new THREE.OctahedronGeometry(0.28);
const gemMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 1.6, 0.7) });
const shardGeo = new THREE.TetrahedronGeometry(0.22);
const ringGeo = new THREE.RingGeometry(0.85, 1, 40);
const orbGeo = new THREE.IcosahedronGeometry(0.42, 1);

// ---------- Game state ----------
let state = 'menu'; // menu | playing | clearing | cards | gameover
let stats, taken, wave, waveTotal, waveSpawned, waveKilled, spawnTimer, clearTimer, kills, time;
let enemies = [], projectiles = [], gems = [], particles = [], orbs = [];
let offeredCards = [];

const player = new THREE.Group();
player.add(neonShape(new THREE.IcosahedronGeometry(0.8, 0), 0x00f0ff, 0.3));
const playerCore = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 2, 2) }));
player.add(playerCore);
player.position.y = 0.9;
scene.add(player);

function newStats() {
  return {
    maxHp: 100, hp: 100, moveSpeed: 7.5, level: 1, xp: 0, xpNext: 5,
    qcards: [], orbs: 1, orbitRadius: 2.4, orbitSpeed: 2.2, fireRate: 1.1, damage: 2, pierce: 0, projSpeed: 20, magnet: 4,
  };
}

function clearWorld() {
  for (const e of enemies) { scene.remove(e.mesh); e.fillMat.dispose(); }
  for (const p of projectiles) scene.remove(p.mesh);
  for (const g of gems) scene.remove(g.mesh);
  for (const p of particles) { scene.remove(p.mesh); p.mesh.material.dispose(); }
  for (const o of orbs) scene.remove(o.mesh);
  enemies = []; projectiles = []; gems = []; particles = []; orbs = [];
}

function resetGame() {
  clearWorld();
  stats = newStats();
  taken = {};
  kills = 0; time = 0;
  player.position.set(0, 0.9, 0);
  syncOrbs();
  startWave(1);
}

function startWave(n) {
  wave = n;
  waveTotal = 8 + 6 * (n - 1);
  waveSpawned = 0; waveKilled = 0; spawnTimer = 0; clearTimer = 0;
  state = 'playing';
  showBanner(`WAVE ${n}`);
}

function showBanner(text) {
  ui.banner.textContent = text;
  ui.banner.classList.remove('hidden');
  ui.banner.style.animation = 'none';
  void ui.banner.offsetWidth; // restart the CSS animation
  ui.banner.style.animation = '';
}

// ---------- Orbs ----------
function syncOrbs() {
  while (orbs.length < stats.orbs) {
    const mesh = neonShape(orbGeo, 0x00f0ff, 0.5);
    scene.add(mesh);
    orbs.push({ mesh, cd: rand(0, 0.5) });
  }
}

// ---------- Spawning ----------
function spawnEnemy() {
  const pool = ['tetra', 'tetra'];
  if (wave >= 2) pool.push('cube', 'cube');
  if (wave >= 4) pool.push('octa');
  const t = TYPES[pool[Math.floor(Math.random() * pool.length)]];
  const a = rand(0, Math.PI * 2), d = rand(30, 35);
  const fillMat = new THREE.MeshBasicMaterial({ color: t.fill.clone() });
  const mesh = makeNeon(t.geo, t.edges, t.lineMat, fillMat);
  mesh.position.set(player.position.x + Math.cos(a) * d, 0.9, player.position.z + Math.sin(a) * d);
  mesh.rotation.set(rand(0, 6), rand(0, 6), 0);
  scene.add(mesh);
  const scale = 1 + 0.18 * (wave - 1);
  enemies.push({
    mesh, fillMat, t, r: t.r, hp: t.hp * scale, speed: t.speed * Math.min(1.6, 1 + 0.05 * (wave - 1)),
    dmg: t.dmg, flash: 0, hitCd: 0, spin: rand(-2, 2),
  });
  waveSpawned++;
}

// ---------- Effects ----------
function explode(pos, color) {
  const c = new THREE.Color(color).multiplyScalar(1.8);
  for (let i = 0; i < 14; i++) {
    const mesh = new THREE.Mesh(shardGeo, new THREE.MeshBasicMaterial({ color: c, transparent: true }));
    mesh.position.copy(pos);
    const a = rand(0, Math.PI * 2), up = rand(2, 7), sp = rand(3, 9);
    scene.add(mesh);
    particles.push({ mesh, vel: new THREE.Vector3(Math.cos(a) * sp, up, Math.sin(a) * sp), life: 0.7, max: 0.7, ring: false });
  }
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: c, transparent: true, side: THREE.DoubleSide }));
  ring.position.copy(pos); ring.position.y = 0.15; ring.rotation.x = -Math.PI / 2;
  scene.add(ring);
  particles.push({ mesh: ring, vel: new THREE.Vector3(), life: 0.45, max: 0.45, ring: true });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) { scene.remove(p.mesh); p.mesh.material.dispose(); particles.splice(i, 1); continue; }
    const k = p.life / p.max;
    p.mesh.material.opacity = k;
    if (p.ring) {
      p.mesh.scale.setScalar(0.5 + (1 - k) * 4);
    } else {
      p.vel.y -= 18 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.mesh.position.y < 0.1) { p.mesh.position.y = 0.1; p.vel.y *= -0.3; }
      p.mesh.rotation.x += dt * 8; p.mesh.rotation.z += dt * 6;
      p.mesh.scale.setScalar(0.4 + k * 0.8);
    }
  }
}

// ---------- Input ----------
const keys = new Set();
window.addEventListener('keydown', (e) => {
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
  keys.add(e.code);
  if (state === 'cards') {
    const m = /^(?:Digit|Numpad)([123])$/.exec(e.code);
    if (m) chooseCard(Number(m[1]) - 1);
  }
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

function moveVector() {
  let x = 0, z = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) z -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) z += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
  const l = Math.hypot(x, z);
  return l ? [x / l, z / l] : [0, 0];
}

// ---------- Cards ----------
function openCards() {
  state = 'cards';
  offeredCards = pickCards(taken, 3, stats.qcards.length, MAX_QUANTUM_CARDS);
  ui.cardsTitle.textContent = `WAVE ${wave} CLEARED - CHOOSE A CARD`;
  ui.cardsRow.innerHTML = '';
  offeredCards.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'card';
    b.style.setProperty('--c', c.color);
    const visual = c.art ? `<span class="art ${c.art}" aria-hidden="true"></span>` : `<span class="icon">${c.icon}</span>`;
    const quantum = c.qnote ? `<span class="qnote"><b>${c.qtag}</b> ${c.qnote}</span>` : '';
    b.innerHTML = `<span class="key">${i + 1}</span>${visual}` +
      `<span class="name">${c.name}</span><span class="desc">${c.desc}</span>${quantum}` +
      `<span class="lvl">LEVEL ${(taken[c.id] || 0) + 1} / ${c.max}</span>`;
    b.addEventListener('click', () => chooseCard(i));
    ui.cardsRow.appendChild(b);
  });
  ui.cards.classList.remove('hidden');
  ui.cardsRow.firstChild?.focus();
}

function chooseCard(i) {
  const c = offeredCards[i];
  if (state !== 'cards' || !c) return;
  c.apply(stats);
  taken[c.id] = (taken[c.id] || 0) + 1;
  ui.cards.classList.add('hidden');
  syncOrbs();
  startWave(wave + 1);
}

// ---------- Shooting ----------
const laserMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 2.2, 2.6) });
function fireShot(from, angle, laser, mult) {
  const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const mesh = new THREE.Mesh(projGeo, laser ? laserMat : projMat);
  mesh.position.copy(from);
  if (laser) { mesh.rotation.y = Math.atan2(dir.x, dir.z); mesh.scale.set(1.6, 1.6, 14); }
  scene.add(mesh);
  projectiles.push({
    mesh, dir, life: laser ? 0.6 : 1.6, pierce: laser ? 999 : stats.pierce,
    dmg: stats.damage * mult * (laser ? 3 : 1), hit: new Set(), speed: laser ? 45 : stats.projSpeed,
  });
}

// ---------- Gameplay update ----------
function addXp(n) {
  stats.xp += n;
  while (stats.xp >= stats.xpNext) {
    stats.xp -= stats.xpNext;
    stats.level++;
    stats.xpNext = Math.round(stats.xpNext * 1.35 + 2);
    stats.maxHp += 5;
    stats.hp = Math.min(stats.maxHp, stats.hp + 15);
    showBanner(`LEVEL ${stats.level}`);
  }
}

function killEnemy(e, idx) {
  explode(e.mesh.position, e.t.color);
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.set(e.mesh.position.x, 0.6, e.mesh.position.z);
  scene.add(gem);
  gems.push({ mesh: gem, xp: e.t.xp, v: 0 });
  scene.remove(e.mesh);
  e.fillMat.dispose();
  enemies.splice(idx, 1);
  waveKilled++; kills++;
}

function nearestEnemy(from, maxD) {
  let best = null, bd = maxD * maxD;
  for (const e of enemies) {
    const dx = e.mesh.position.x - from.x, dz = e.mesh.position.z - from.z;
    const d = dx * dx + dz * dz;
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}

function updateGame(dt) {
  time += dt;
  const pp = player.position;

  // Player movement
  const [mx, mz] = moveVector();
  pp.x += mx * stats.moveSpeed * dt;
  pp.z += mz * stats.moveSpeed * dt;
  player.rotation.y += dt * 1.5;
  player.rotation.x += dt * 0.7;

  // Wave spawning
  if (state === 'playing' && waveSpawned < waveTotal) {
    spawnTimer -= dt;
    const interval = Math.max(0.22, 14 / waveTotal);
    if (spawnTimer <= 0 && enemies.length < 70) { spawnEnemy(); spawnTimer = interval; }
  }

  // Orbs orbit and shoot
  orbs.forEach((o, i) => {
    const a = time * stats.orbitSpeed + (i * Math.PI * 2) / orbs.length;
    o.mesh.position.set(pp.x + Math.cos(a) * stats.orbitRadius, 1.0, pp.z + Math.sin(a) * stats.orbitRadius);
    o.mesh.rotation.y += dt * 4;
    o.cd -= dt;
    if (o.cd <= 0) {
      const target = nearestEnemy(o.mesh.position, 20);
      if (target) {
        const aim = Math.atan2(target.mesh.position.z - o.mesh.position.z, target.mesh.position.x - o.mesh.position.x);
        const w = lookup(stats.qcards);
        const k = sampleSector(w.probs); // measurement of the Qiskit-computed state
        fireShot(o.mesh.position, aim + (k * Math.PI) / 4, w.laser, w.echo_mask ? 2 : 1);
        if (w.echo_mask) fireShot(o.mesh.position, aim + ((k ^ w.echo_mask) * Math.PI) / 4, w.laser, 2);
        o.cd = 1 / stats.fireRate;
      } else {
        o.cd = 0.1;
      }
    }
  });

  // Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.mesh.position.addScaledVector(p.dir, p.speed * dt);
    p.life -= dt;
    let remove = p.life <= 0;
    if (!remove) {
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (p.hit.has(e)) continue;
        const dx = e.mesh.position.x - p.mesh.position.x, dz = e.mesh.position.z - p.mesh.position.z;
        if (dx * dx + dz * dz < (e.r + 0.3) ** 2) {
          p.hit.add(e);
          e.hp -= p.dmg;
          e.flash = 0.08;
          if (e.hp <= 0) killEnemy(e, j);
          if (p.pierce <= 0) { remove = true; break; }
          p.pierce--;
        }
      }
    }
    if (remove) { scene.remove(p.mesh); projectiles.splice(i, 1); }
  }

  // Enemies: chase, separate, hit the player
  for (const e of enemies) {
    const m = e.mesh.position;
    const dx = pp.x - m.x, dz = pp.z - m.z;
    const d = Math.hypot(dx, dz) || 1;
    m.x += (dx / d) * e.speed * dt;
    m.z += (dz / d) * e.speed * dt;
    e.mesh.rotation.x += dt * e.spin; e.mesh.rotation.y += dt * e.spin * 0.7;
    if (e.flash > 0) { e.flash -= dt; e.fillMat.color.copy(WHITE); }
    else e.fillMat.color.copy(e.t.fill);
    e.hitCd -= dt;
    if (d < e.r + 0.7 && e.hitCd <= 0) {
      stats.hp -= e.dmg;
      e.hitCd = 0.8;
    }
  }
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i], b = enemies[j];
      const dx = b.mesh.position.x - a.mesh.position.x, dz = b.mesh.position.z - a.mesh.position.z;
      const min = (a.r + b.r) * 0.8;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2), push = (min - d) * 0.5;
        a.mesh.position.x -= (dx / d) * push; a.mesh.position.z -= (dz / d) * push;
        b.mesh.position.x += (dx / d) * push; b.mesh.position.z += (dz / d) * push;
      }
    }
  }

  // XP gems
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    g.mesh.rotation.y += dt * 3;
    const dx = pp.x - g.mesh.position.x, dz = pp.z - g.mesh.position.z;
    const d = Math.hypot(dx, dz) || 1;
    if (state === 'clearing' || d < stats.magnet || g.v > 0) {
      g.v = Math.min(30, (g.v || 6) + 40 * dt);
      g.mesh.position.x += (dx / d) * g.v * dt;
      g.mesh.position.z += (dz / d) * g.v * dt;
    }
    if (d < 0.9) { addXp(g.xp); scene.remove(g.mesh); gems.splice(i, 1); }
  }

  // Wave end / death
  if (state === 'playing' && waveKilled >= waveTotal) { state = 'clearing'; clearTimer = 1.4; }
  if (state === 'clearing') { clearTimer -= dt; if (clearTimer <= 0) openCards(); }
  if (stats.hp <= 0) gameOver();
}

function gameOver() {
  stats.hp = 0;
  state = 'gameover';
  ui.gameoverText.textContent = `Reached wave ${wave}  -  level ${stats.level}  -  ${kills} enemies destroyed`;
  ui.gameover.classList.remove('hidden');
  ui.gameover.querySelector('button').focus();
}

// ---------- HUD ----------
function updateHud() {
  ui.hpFill.style.transform = `scaleX(${Math.max(0, stats.hp / stats.maxHp)})`;
  ui.hpText.textContent = `HP ${Math.ceil(stats.hp)} / ${stats.maxHp}`;
  ui.xpFill.style.transform = `scaleX(${stats.xp / stats.xpNext})`;
  ui.xpText.textContent = `LV ${stats.level}`;
  ui.waveText.textContent = `WAVE ${wave}`;
  ui.enemiesText.textContent = `Enemies left: ${Math.max(0, waveTotal - waveKilled)}`;
  drawMinimap();
  drawLab();
}

const lab = $('lab').getContext('2d');
function drawLab() {
  const w = lookup(stats.qcards), c = 65, R = 52;
  lab.clearRect(0, 0, 130, 130);
  w.probs.forEach((p, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 4; // sector 0 points up = toward the aim
    const len = 8 + p * (R - 8);
    lab.strokeStyle = w.laser ? '#7dffff' : '#ffe94d';
    lab.shadowColor = lab.strokeStyle; lab.shadowBlur = p > 0 ? 8 : 0;
    lab.globalAlpha = p > 0 ? 0.35 + 0.65 * p : 0.15;
    lab.lineWidth = p > 0 ? 2 + 4 * p : 1;
    lab.beginPath(); lab.moveTo(c, c); lab.lineTo(c + Math.cos(a) * len, c + Math.sin(a) * len); lab.stroke();
  });
  lab.globalAlpha = 1; lab.shadowBlur = 0;
  $('lab-text').textContent = (stats.qcards.length ? stats.qcards.map((q) => q[0].toUpperCase()).join(' ') : 'BASE') +
    (w.laser ? '  LASER' : '') + (w.echo_mask ? '  ECHO' : '');
}

const MM = { size: 170, range: 42 };
function drawMinimap() {
  const c = MM.size / 2, R = c - 6, k = R / MM.range;
  mm.clearRect(0, 0, MM.size, MM.size);
  mm.strokeStyle = 'rgba(0,240,255,0.25)';
  mm.lineWidth = 1;
  for (const f of [0.33, 0.66, 1]) { mm.beginPath(); mm.arc(c, c, R * f, 0, Math.PI * 2); mm.stroke(); }
  mm.beginPath(); mm.moveTo(c - R, c); mm.lineTo(c + R, c); mm.moveTo(c, c - R); mm.lineTo(c, c + R); mm.stroke();
  const pp = player.position;
  for (const e of enemies) {
    let x = (e.mesh.position.x - pp.x) * k, y = (e.mesh.position.z - pp.z) * k;
    const d = Math.hypot(x, y);
    const far = d > R;
    if (far) { x = (x / d) * R; y = (y / d) * R; }
    mm.fillStyle = far ? 'rgba(255,43,214,0.55)' : '#ff2bd6';
    mm.shadowColor = '#ff2bd6'; mm.shadowBlur = far ? 0 : 6;
    mm.beginPath(); mm.arc(c + x, c + y, far ? 2.2 : 3, 0, Math.PI * 2); mm.fill();
  }
  mm.shadowColor = '#00f0ff'; mm.shadowBlur = 10;
  mm.fillStyle = '#00f0ff';
  mm.beginPath(); mm.arc(c, c, 4.5, 0, Math.PI * 2); mm.fill();
  mm.shadowBlur = 0;
}

// ---------- Main loop ----------
const clock = new THREE.Clock();
const camTarget = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (state === 'playing' || state === 'clearing') updateGame(dt);
  if (state !== 'menu') updateParticles(dt);

  if (state === 'menu') {
    const t = performance.now() / 1000;
    player.rotation.y += dt; player.rotation.x += dt * 0.5;
    camTarget.set(Math.sin(t * 0.15) * 6, 0, Math.cos(t * 0.15) * 6);
    camera.position.set(Math.sin(t * 0.15) * 10, 12, Math.cos(t * 0.15) * 10 + 12);
    camera.lookAt(0, 0, 0);
  } else {
    camTarget.copy(player.position).add(CAM_OFFSET);
    camera.position.lerp(camTarget, Math.min(1, dt * 6));
    camera.lookAt(player.position.x, 0, player.position.z);
    updateHud();
  }

  grid.position.x = Math.round(player.position.x / GRID_CELL) * GRID_CELL;
  grid.position.z = Math.round(player.position.z / GRID_CELL) * GRID_CELL;
  composer.render();
}

// ---------- Menu wiring ----------
function start() {
  ui.menu.classList.add('hidden');
  ui.gameover.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  resetGame();
}
$('start').addEventListener('click', start);
$('restart').addEventListener('click', start);
window.addEventListener('keydown', (e) => {
  if ((e.code === 'Enter') && (state === 'menu' || state === 'gameover')) start();
});

stats = newStats();
wave = 1; waveTotal = 0; waveKilled = 0;
$('start').focus();
frame();
