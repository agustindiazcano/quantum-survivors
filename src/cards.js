// Upgrade cards offered at the end of each wave. `apply` mutates the player's build (stats).
export const CARDS = [
  { id: 'orb', name: 'EXTRA ORB', icon: '◉', color: '#00f0ff', desc: 'Adds one more orb orbiting you.', max: 8,
    apply: (s) => { s.orbs += 1; } },
  { id: 'rate', name: 'RAPID FIRE', icon: '≫', color: '#ffe94d', desc: 'Orbs shoot 25% faster.', max: 8,
    apply: (s) => { s.fireRate *= 1.25; } },
  { id: 'dmg', name: 'OVERCHARGE', icon: '✸', color: '#ff2bd6', desc: 'Shots deal 30% more damage.', max: 8,
    apply: (s) => { s.damage *= 1.3; } },
  { id: 'pierce', name: 'PIERCING', icon: '➤', color: '#39ff88', desc: 'Shots pass through 1 more enemy.', max: 4,
    apply: (s) => { s.pierce += 1; } },
  { id: 'speed', name: 'AFTERBURNER', icon: '⚡', color: '#7aa2ff', desc: 'Move 12% faster.', max: 5,
    apply: (s) => { s.moveSpeed *= 1.12; } },
  { id: 'spin', name: 'WIDE ORBIT', icon: '◌', color: '#ff9a3c', desc: 'Orbit wider and spin faster.', max: 4,
    apply: (s) => { s.orbitRadius += 0.6; s.orbitSpeed *= 1.15; } },
  { id: 'hp', name: 'SHIELD CORE', icon: '✚', color: '#ff4d6d', desc: '+25 max health and heal 40.', max: 6,
    apply: (s) => { s.maxHp += 25; s.hp = Math.min(s.maxHp, s.hp + 40); } },
  { id: 'magnet', name: 'MAGNET', icon: '⌖', color: '#b36bff', desc: 'Pick up XP from further away.', max: 4,
    apply: (s) => { s.magnet += 2.5; } },
];

// Quantum cards (see docs/WEAPON_SYSTEM.md). `art` is a CSS-only illustration (.art.<name> in style.css) and
// `qnote` is the short plain-language quantum explanation. Not wired to the Qiskit table yet, so they only
// appear with ?preview in the URL and have no effect on the weapon.
export const QUANTUM_CARDS = [
  { id: 'mirror', name: 'MIRROR', art: 'mirror', color: '#00f0ff', max: 1, wip: true,
    desc: 'Flips your fire direction: front becomes back.',
    qtag: 'NOT gate (X)',
    qnote: 'Swaps 0 and 1 on one direction bit, so a shot aimed one way is now aimed the opposite way.',
    apply: () => {} },
  { id: 'shotgun', name: 'SHOTGUN', art: 'shotgun', color: '#ffe94d', max: 1, wip: true,
    desc: 'Spreads one shot into a cone of pellets.',
    qtag: 'Hadamard gate (H)',
    qnote: 'Superposition: the shot is in two directions at once, and only picks one when it is measured as it fires.',
    apply: () => {} },
  { id: 'phantom', name: 'PHANTOM', art: 'phantom', color: '#b36bff', max: 1, wip: true,
    desc: 'Does nothing by itself. Or does it?',
    qtag: 'Phase gate (Z)',
    qnote: 'Flips the sign of a wave, not a probability, so alone it is invisible. Between two Shotguns the waves cancel and add: interference.',
    apply: () => {} },
  { id: 'link', name: 'LINK', art: 'link', color: '#ff2bd6', max: 1, wip: true,
    desc: 'Each shot is paired with an echo shot, double damage.',
    qtag: 'CNOT gate',
    qnote: 'Entanglement: two direction bits become one linked pair. Measuring one tells you the other, even when they point apart.',
    apply: () => {} },
];

const PREVIEW = new URLSearchParams(location.search).has('preview');

export function pickCards(taken, n = 3) {
  const all = PREVIEW ? [...CARDS, ...QUANTUM_CARDS] : CARDS;
  const pool = all.filter((c) => (taken[c.id] || 0) < c.max);
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}
