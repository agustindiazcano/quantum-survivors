**This effort is supported by Qollab & IonQ**

# Quantum Survivors

A neon, Vampire Survivors-style web game where quantum ideas (superposition, entanglement, interference) show up as weapon cards and combos, never as equations.

**Status:** work in progress · Hackathon submission (Qollab)

## How the quantum part works

Enemies are ordinary. **The weapons and powers are quantum.** Your weapon is a small 3-qubit register that decides the direction of each shot (8 sectors of 45 degrees); firing is a measurement. Cards are quantum gates added to the weapon in the order you pick them:

| Card | Gate | Quantum idea |
|---|---|---|
| Mirror | NOT (X) | Flips a direction bit |
| Shotgun | Hadamard (H) | Superposition: a spread of directions |
| Phantom | Phase (Z) | Invisible alone, but changes interference |
| Link | CNOT | Entanglement: a shot and its linked echo |

Combo: Shotgun, Phantom, Shotgun fuses the pellets into a Death Laser by interference, something a classical random weapon cannot do (the code computes both and reports the difference). The calculations are done with Qiskit in `qollab/` and exported as a table that the game reads. The game does not run Qiskit live. Design and plan: [docs/WEAPON_SYSTEM.md](docs/WEAPON_SYSTEM.md). Hackathon rules: [docs/RULES.md](docs/RULES.md).

Status: the 3D game (PoC) works; the Qiskit side is planned, not built yet.

## Stack

Plain JavaScript, HTML and CSS, 3D with three.js (WebGL, bloom glow). Vite for development, built as a single HTML file. Quantum calculations: Python with Qiskit in `qollab/` (planned).

## How to run

```
npm install
npm run dev
```

Add `?preview` to the URL to see the quantum cards (not wired to the weapon yet).

## Hackathon node and team

Competing at the **UNICEN** node (Universidad Nacional del Centro de la Provincia de Buenos Aires, Argentina): https://exa.unicen.edu.ar/ · Track: *Professional*

**Team Salta**
- Agustin Diaz-Cano, MS Candidate, Information Systems Engineering (UTN)
- Baltazar Salerno, Frontend Developer

## Disclosure

- AI tools used: Claude (chat: planning, review) and Claude Code (coding agent, code and documentation assistance), Gemini Antigravity (planning, coding agent and brainstorming, web search), Grok (brainstorming, web search).
- Libraries: Vite, three.js, @fontsource/orbitron (font); Qiskit and NumPy for the quantum side.

## License

MIT. See [LICENSE](LICENSE).
