# Weapon system: design and plan (v0, to be corrected by the owner)

Based on the brainstorm in [CONTEXT.md](../CONTEXT.md) (the "Gemini text"). Enemies are normal (geometric shapes that chase you). **The quantum part is the weapon and the powers.** All quantum calculations must be done by the code we deliver to Qollab (Python + Qiskit), see [RULES.md](RULES.md).

> This is a first proposal. Nothing here is final. Decisions marked **DECISION** are my choice and are easy to change.

## 1. Core idea
Your weapon is a small quantum register that decides **in which direction each shot goes**.

- Register of **3 qubits = 8 sectors** of 45 degrees. Sector 0 = toward the nearest enemy (the aim), sector 1 = 45 degrees, ..., sector 4 = straight behind.
- Sector index `k = 4*q2 + 2*q1 + q0`. Each qubit adds an angle: q0 = 45 degrees, q1 = 90, q2 = 180.
- The state of the register gives a probability for each sector. **Firing = measuring**: each shot picks a sector with that probability.
- Cards are quantum gates appended to the weapon circuit, in the order you pick them. The order matters, which is what makes the combos possible.

The player never sees formulas. They see: bullets, a direction fan, a laser. Each card carries a short plain-language "quantum note" for the curious (see section 6).

## 2. Cards (gates)
| Card | Gate | What the player sees | What happens in the circuit |
|---|---|---|---|
| Mirror | X (NOT) | The shot turns around | Flips one direction bit: sector k becomes the one opposite or rotated by that bit's angle |
| Shotgun | H (Hadamard) | One shot becomes a spread of pellets | Puts a direction bit in superposition: two sectors at once, 50/50 |
| Phantom | Z (phase) | Nothing happens (looks useless) | Changes only the sign of a wave, so probabilities do not change on their own |
| Link | CNOT | Each shot is paired with an echo shot in a linked direction, double damage | Entangles a direction bit with the back bit |

**Combo (the hackathon trick):** Shotgun, then Phantom, then Shotgun on the same qubit. `H Z H = X`: the two spreads interfere and the wave collapses into one sector with 100% probability. The pellets fuse into a **Death Laser** that pierces everything in a line.

Plain Shotgun + Shotgun on the same qubit would cancel (`H H = I`), so the auto-target rules below send a second Shotgun to the *next* qubit instead, unless a Phantom sits in between.

## 3. Auto-target rules (DECISION)
So the player never chooses a qubit. Cards are applied in pick order:

| Card | Target |
|---|---|
| Shotgun (H) | If the previous quantum card was a Phantom: the same qubit as that Phantom (completes the sandwich). Otherwise the next qubit not yet used by a Shotgun: q0, q1, q2 |
| Phantom (Z) | The qubit of the most recent Shotgun |
| Mirror (X) | The qubit of the most recent quantum card, or q2 (turn around) if there is none |
| Link (CNOT) | Control = qubit of the most recent Shotgun (q0 if none); target = q2 (q0 if the control is q2). The echo sector is `k XOR (bit of control, bit of q2)` |

Puzzle detail: after the laser combo the beam points 45 degrees off (sector 1). A Mirror right after it flips q0 back, so the beam points at the aim.

## 4. Laser and "not just randomness" (DECISION)
The rules ask for quantum effects that go beyond generating randomness. For every build the Qiskit code computes **two** distributions:

- **quantum**: the real statevector probabilities.
- **classical**: the same cards applied as a classical stochastic model (X and CNOT permute sectors, H "randomizes" that bit 50/50, Z does nothing).

`interference_gain = max(quantum) - max(classical)`. Examples: Shotgun alone: gain 0 (quantum = classical). Shotgun, Phantom, Shotgun: quantum 1.0, classical 0.5, gain 0.5. **If `gain >= 0.25` and the best sector has probability >= 0.9, the weapon fires a Death Laser** (beam, damage x3, pierces all). Only interference can do that; a classical random weapon cannot.

Entanglement: for Link builds the code computes the entropy of the reduced state of q2 (`qiskit.quantum_info.partial_trace` and `entropy`). If it is above 0, the shot and its echo are correlated.

## 5. Where the calculation runs (DECISION)
The web game (JS) cannot call Qollab while playing. So:

1. `qollab/` (Python + Qiskit, self-contained, exactly what is uploaded to Qollab) simulates every card sequence up to **5 quantum cards** with `Statevector` (1,364 sequences, exact, no randomness, a few seconds) and writes `qollab/data/weapon_table.json`.
2. The game imports that JSON. It only concatenates card ids into a key such as `S,P,S`, looks up the entry, and samples a sector from `probs` when firing. It does not re-implement the gate rules.
3. Running `main.py` on Qollab recomputes the table, prints demo builds (circuit drawing, probability bars, quantum vs classical, gain, entropy) and checks that the result matches the table shipped with the game (checksum). That is the quantum work the judges see on Qollab.

Honest limit to state in the README: the game does not run Qiskit live in the browser; the table is generated by the Qiskit code and consumed by the game.

Table entry: `key`, `gates` (resolved gate list, text), `probs[8]`, `classical[8]`, `gain`, `laser` (bool), `entropy`, `echo_mask` (0 if no Link).

## 6. Card art and quantum notes
Each quantum card has a CSS-only illustration (`.art.mirror`, `.art.shotgun`, `.art.phantom`, `.art.link` in `src/style.css`) and a small "quantum note" under the description. The note names the concept (superposition, interference, entanglement) in plain words, with the gate name as a tag. They are implemented in `src/cards.js` as `QUANTUM_CARDS`. They are visible only with `?preview` in the URL until the Qiskit table is wired (they have no effect yet).

## 7. Starting weapon (DECISION)
The brainstorm says the character starts weak and shoots in all directions. For the gates to make sense (Mirror needs a focused shot to flip), I start in `|000>`: all shots go toward the aim, with low damage. The all-direction feel comes from the existing orbs and from the Shotgun cone. Alternative to discuss: start in a diffuse state and let cards focus it.

## 8. Plan
Time is tight (deadline Sunday 2026-10-11 19:00 ET = 20:00 Argentina). Order is by priority; cut from the bottom.

| # | Priority | Task | Depends on | Output |
|---|---|---|---|---|
| 1 | 🔴 | Tests first (`tests/test_weapon.py`): `H Z H = X`, probabilities sum to 1, quantum vs classical for S,P,S (gain 0.5) and S alone (gain 0), Mirror on q2 gives sector 4, Link gives entropy > 0 | none | failing tests |
| 2 | 🔴 | `qollab/qgame/`: gate rules (section 3), `Statevector` simulation, classical model, entropy | 1 | passing tests |
| 3 | 🔴 | `qollab/main.py`: demo builds, `--export`, checksum check, script guard `if __name__ == "__main__": main()` | 2 | runs on Qollab |
| 4 | 🔴 | Generate `qollab/data/weapon_table.json` (5 cards max, 1,364 entries) | 2 | JSON |
| 5 | 🔴 | Game: card pool with the 4 quantum cards (remove `?preview` gate), build key, table lookup, sample sector per shot, rotate shot by sector | 4 | weapons driven by Qiskit |
| 6 | 🟡 | Laser visual (thick neon beam, pierces all, x3 damage) and Link echo shot | 5 | combo visible |
| 7 | 🟡 | HUD "weapon lab": direction fan showing the probabilities of the current build and the card sequence | 5 | player sees the effect |
| 8 | 🟡 | Publish on Qollab (project page, MIT), run once on the Qollab simulator | 3 | page |
| 9 | 🟡 | Demo video 2 to 3 minutes (public link) | 6 | video |
| 10 | 🟢 | Accessibility pass (contrast, keyboard, focus, alt text) | 5 | checklist |
| 11 | ⚪ | Optional: one real `backend.run` shot of a build on the Qollab backend | 3 | extra |

## 9. Open questions for the owner
| Question | My default |
|---|---|
| Start focused (`|000>`) or diffuse? | Focused, low damage |
| Should the player choose the qubit of a card? | No, auto-target (section 3) |
| Laser threshold (gain 0.25, probability 0.9) | As written |
| Cap of 5 quantum cards in the table | 5 (1,364 entries) |
| Do stat cards (more orbs, fire rate, etc.) stay next to the quantum cards? | Yes, they stay |
