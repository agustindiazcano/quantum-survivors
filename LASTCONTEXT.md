# Last Context
- The repository was repurposed. It used to hold QWind (a Qollab x IonQ quantum hackathon entry); that code was removed. It is now **Quantum Survivors**, a neon, Vampire Survivors-style web game in JS/HTML/CSS (2D Canvas or 3D with three.js, still open).
- Git: `origin` = https://github.com/agustindiazcano/quantum-survivors, local `main` tracks `origin/main`. `LICENSE` (MIT) comes from that repo.
- `CONTEXT.md` holds the original brainstorm (not final, not decisions). `AGENTS.md` holds the project rules.
- Vite is configured (`vite.config.js`, `src/main.js`, `src/style.css`, root `index.html`); `npm run build` produces a single-file `dist/index.html`. Nothing committed yet.
- `docs/RULES.md` holds the hackathon rules (referenced from `AGENTS.md`).
- Branch `feat/poc-3d`: 3D PoC (three.js + bloom). Files: `src/main.js` (game), `src/cards.js` (upgrade cards), `src/style.css`, `index.html` (menu, HUD, cards, game over). Single weapon: orbs around the player that shoot the nearest enemy. Waves of tetra/cube/octa enemies, XP gems, levels, 3 cards after every wave, minimap with off-screen enemy edge dots.
- Next: connect the quantum layer (Qiskit is required by the rules), tune balance.
- Weapon system designed (not implemented on the Qiskit side yet): `docs/WEAPON_SYSTEM.md` has the design, auto-target rules, laser rule (interference gain, quantum vs classical), architecture (Qiskit in `qollab/` generates `weapon_table.json`, the game consumes it) and a prioritized plan.
- Cards: `src/cards.js` has `QUANTUM_CARDS` (Mirror, Shotgun, Phantom, Link) with CSS-only art (`.art.*` in `src/style.css`) and a quantum note each. They show only with `?preview` in the URL and have no effect yet.
