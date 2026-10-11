# Project
**Quantum Survivors**: a simple web game in the style of Vampire Survivors (auto-firing character, hordes of enemies, chests that give upgrade cards). The "quantum" part is hidden under the game mechanics: the player never sees a math symbol, only weapons, monsters and power cards.

Repository: https://github.com/agustindiazcano/quantum-survivors (MIT).

> **Read [CONTEXT.md](CONTEXT.md) for the original brainstorm.** It is NOT a final version and NOT a set of decisions; it only conveys what the author wants. Things will change.

## Stack
- Plain JavaScript, HTML and CSS. No framework.
- Either 2D (Canvas) or 3D. If 3D: WebGL through [three.js](https://threejs.org/) for rendering and models. The 2D vs 3D choice is still open.
- Vite for the dev server (opens the browser on its own) and the build.
- The game ships as a single monolithic HTML file to keep the work simple (one `index.html` entry point; the build inlines JS and CSS).

## Visual direction
- Neon colors with glow.
- For now the enemies are plain geometric shapes.
- When an enemy dies it explodes with a particle/visual effect.

## Game design guidelines (from the brainstorm, subject to change)
- The character fires automatically. It starts weak and inefficient (small bullets in every direction) and improves by picking up chests that give "cards".
- The player must never see equations, matrices or quantum jargon. Cards have friendly names and visible effects (direction changes, spread shots, combos).
- Under the hood the effects may be driven by a real small quantum-state simulation (2x2 gate matrices applied each frame) instead of ad-hoc `if/else` percentages. See CONTEXT.md.

## Workflow
- One branch per task. Never commit directly to `main` (exception: the initial scaffold).
- Every change goes through a pull request; a human approves every PR. Do not merge on your own.
- Keep it simple: prefer small, readable modules over abstractions.

## AI Agent Protocols
- **Context Initialization**: At the beginning of a new session, agents MUST read `LASTCONTEXT.md` and `PENDING.md` to understand the recent progress and current task list.
- **Environment Awareness**: Always check the git status, current branch, and worktree before proceeding. Multiple people and agents may be collaborating on this repository; never take the local state for granted.
- Update `LASTCONTEXT.md` and `PENDING.md` when you finish meaningful work.

## Notes
- The repository was started from a different project (a Qollab quantum hackathon entry, QWind). That code was removed. Only the credits and the MIT license were kept.
