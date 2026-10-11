# Pending Tasks

Legend: 🔴 blocking/urgent · 🟡 next · 🟢 later · ⚪ backlog. `[x]` done, `[ ]` open.

## Done
1. [x] Repository linked to https://github.com/agustindiazcano/quantum-survivors and MIT `LICENSE` pulled from it.
2. [x] Old QWind/Qollab project removed (`qollab/`, old notes).
3. [x] `AGENTS.md`, `CONTEXT.md`, `LASTCONTEXT.md`, `PENDING.md` rewritten for the game.

## Open
4. [x] Vite setup: `npm run dev` opens the browser on its own, `npm run build` outputs a single `dist/index.html` (vite-plugin-singlefile).
5. [x] 3D with three.js chosen for the PoC (WebGL, bloom glow).
6. [x] PoC on branch `feat/poc-3d`: menu, WASD/arrows, waves, HP/XP/level, 3 cards per wave, orbiting orbs that shoot, minimap, explosions.
6b. [x] Qiskit plan decided: calculations in `qollab/` (Python + Qiskit) generate a table the game consumes. See `docs/WEAPON_SYSTEM.md`.
6c. [x] Quantum card art (CSS) and notes, visible with `?preview`.
7. [x] Tests first for the weapon (`tests/test_weapon.py`), then `qollab/qgame/` (rules, Statevector, classical model, entropy).
7b. [x] 🔴 `qollab/main.py` (demo builds, `--export`, checksum, script guard) and generate `qollab/data/weapon_table.json`.
7c. [x] 🔴 Wire the game: quantum cards in the pool, build key, table lookup, sample a sector per shot.
7d. [x] Laser beam, Link echo shot and weapon-lab HUD done; needs play-testing and balance.
7e. [ ] 🟡 Publish on Qollab (page, MIT, run on simulator) and record the 2-3 minute demo video.
7f. [ ] 🟢 Accessibility pass.
8. [ ] ⚪ Rewrite `README.md` sections that still describe the old project, if any remain.
