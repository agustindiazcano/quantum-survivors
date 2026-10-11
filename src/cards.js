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

export function pickCards(taken, n = 3) {
  const pool = CARDS.filter((c) => (taken[c.id] || 0) < c.max);
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}
