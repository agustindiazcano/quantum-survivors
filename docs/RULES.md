# Hackathon rules and terms (Qollab x IonQ)

Reference copy of the official rules. Source: the hackathon website (Qollab.xyz and IonQ). Saved on 2026-10-11.

## What this means for Quantum Survivors (our reading, not official)
- **Deadline: Sunday 2026-10-11, 19:00 ET (20:00 Argentina).** Build window: 2026-10-09 19:00 ET to that deadline.
- **Qiskit is mandatory.** Every project must use Qiskit and run on Qollab's free simulators. Our game is JS/three.js, so the Qiskit part has to exist and be runnable on Qollab (Python); the web game can live as an outside frontend, which must also be MIT. How the two connect is an open decision.
- **Theme fit: Quantum Playground** (a game where superposition, interference or entanglement is essential, beyond generating randomness). See `CONTEXT.md` for the card ideas.
- **Beyond the tutorial bar:** needs a novel application, a technical extension, or an original educational contribution, otherwise the panel may score Novelty/Technical at 0.
- **Required:** project page on Qollab, MIT license, demo video of 2 to 3 minutes at a public link (no sign-in), accessibility best practices on the UI, the exact line `This effort is supported by Qollab & IonQ`.
- **Disclose** AI tools, libraries, templates and prior code (Originality section). Undisclosed use can mean disqualification.
- Rubric: Novelty & Creativity, Technical Execution, Impact Potential, Documentation Quality.

---

## Official text

### Rules & terms
Qollab.xyz and IonQ will run a distributed global hackathon on October 9th to 11th, 2026. During the hackathon, participants will build quantum applications that are published on Qollab on an MIT license, enabling others to find them, fork them and build on them.

All submitted projects will be evaluated by judging panels based on a common rubric focused on Novelty & Creativity, Technical Execution, Impact Potential and Documentation Quality. The projects that receive the highest evaluations based on the rubric will be eligible for cash and other awards as stipulated in the Judging section of the website.

### Eligibility & team structure
**Teams and tracks**
- Team size: participants can compete solo or in teams of up to 4 members.
- Teams register in one of two tracks, student or professional:
  - To register as a student team, every member must be enrolled in an undergraduate or graduate program at the university identified in the registration form as the team's "university hackathon node".
  - All other teams register as professionals, including teams that combine students and professionals. During registration, professional teams also associate themselves with a "university hackathon node". Recommended: one close geographically or one by which they are affiliated (e.g. being alumni).
- Everyone on a team competes at the same node. Mixed node teams are not accommodated.
- Both tracks are scored on the same rubric and compete for the same awards. Tracks let university nodes run student-only events and add student-specific awards at their discretion.
- Participants may submit multiple projects. Awards are per project, not per person or team.
- No prior quantum computing experience is needed.
- Participants need to be at least 18 years old.

**Eligible countries:** Argentina, Australia, Austria, Barbados, Belgium, Brazil, Bulgaria, Canada, Chile, Colombia, Cyprus, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, India, Indonesia, Ireland, Israel, Italy, Japan, Latvia, Lithuania, Luxembourg, Malaysia, Malta, Mexico, Netherlands, New Zealand, Norway, Poland, Portugal, Romania, Singapore, Slovakia, South Korea, Spain, Sweden, Switzerland, the United Kingdom, and the United States.

### Timeline
| Date | Event |
|---|---|
| Sept 28, 11:00 ET | Registration opens |
| Sept 29, 13:00 ET | Optional AMA with the hackathon committee |
| Oct 08, 11:00 ET | Registration closes |
| Oct 09, 19:00 ET | Build window starts |
| Oct 11, 19:00 ET | Build window ends, submission deadline |
| Week of Oct 12 | Local judging complete (nodes may hold in-person events at their discretion) |
| Week of Oct 19 | Global judging complete; global and local winners announced |

### Submission requirements
Every project must:
- Use the Qiskit framework.
- Follow industry best practices on UI accessibility.
- Run on Qollab's free simulators, including IonQ's quantum simulator. Judges run every project on a free local simulator, and results from IonQ's simulators or hardware neither add nor subtract points.
- Be published and runnable on Qollab.xyz on an MIT license before the submission deadline.
- Use an MIT license for any outside repo the project relies on, such as a frontend or backend hosted elsewhere.
- Have a project page on Qollab.xyz covering what the submission does, what problem it explores, how to run it, and other information to enable others to understand, replicate, or extend it.
- Be built during the hackathon window. Existing code, templates and forks are fine as a starting point when disclosed (see Originality); judging is based on what the team adds during the window.
- Include a demo video of 2 to 3 minutes, at a public link that opens without signing in.

### Themes
Projects should leverage quantum computing's unique attributes and cover one or more of the following themes:

- **Quantum Impact**: solve real-world problems with quantum + classical computing. Take on a real challenge in logistics, manufacturing, space, finance, energy, or another industry using a hybrid quantum-classical approach. Choose a relevant public dataset, build a strong classical baseline, then identify where a quantum subroutine can make a difference. Show the impact: better solution quality, improved efficiency, accuracy, or other measurable gains.
- **Quantum Playground**: use quantum computing to build something playful, artistic, or unexpected. Turn quantum mechanics into a creative medium. Build a game, compose music, generate art, design an interactive experience, or invent something not yet imagined. The challenge: make quantum science an essential part of the experience, using concepts such as superposition, interference, entanglement, or measurement in a way that goes beyond simply generating randomness.
- **Quantum Unlocked**: make the hardest ideas in quantum computing click. Pick a timely topic, such as quantum error correction, fault tolerance, quantum networking, or algorithms, and find a creative way to teach it. Build an interactive demo, game, animation, visualization, or GUI that turns a complex concept into something intuitive, engaging, and memorable.

Projects that don't fall under one of these themes are still welcome and eligible for placement awards (1st/2nd/3rd and node-level prizes), but not for Theme specialty awards.

### Beyond the tutorial bar
Each submission must go beyond a standard reference implementation or tutorial-level exercise and demonstrate at least one of:
- A novel application or problem context (e.g., applying an existing technique to a specific domain).
- A technical extension (e.g., noise/error mitigation, parameter optimization, comparative benchmarking).
- An original analytical or educational contribution (e.g., a genuinely new way of visualizing or explaining a quantum phenomenon).

The judging panel assesses these traits under Novelty & Creativity and Technical Execution. Panels may score a submission at 0 on these criteria, independent of other scores, if it fails to meet this bar.

### Award structure
The judging panel of each university node scores all relevant submissions using a global rubric.

**Local judging**
- Fewer than 10 projects: the panel evaluates all node entries and advances the top 3 to global judging.
- 10 or more projects: awards below, and all three advance to global judging.

| Place | Cash | Compute |
|---|---|---|
| 1st | $500 | $5,000 |
| 2nd | $300 | $3,000 |
| 3rd | $200 | $2,000 |

- Regardless of the number of projects, each node's panel may advance up to one project for each specialized global award: Most Novel / Creative, Best of Theme, Most Impact, Best Documentation. A project can advance both for overall placement and as a candidate for a specialized award.

**Global judging**: the global panel scores all advanced submissions with the same rubric.

| Place | Cash | Compute |
|---|---|---|
| 1st | $10,000 | $20,000 |
| 2nd | $5,000 | $15,000 |
| 3rd | $2,500 | $10,000 |
| Specialty | $500 | $5,000 |

Specialty awards: Most Novel / Creative, Best of each of the three themes, Most Impact, Best Documentation. A project can win both a placement prize and a specialty award. Select teams may receive additional funds, computing resources and other awards at the discretion of Qollab, IonQ and/or other sponsors. Nodes are encouraged to add supplemental prizes for student-specific effort.

### Originality & code of conduct
- Projects must be substantially new work built during the hackathon window. Using AI, open-source libraries, prior tutorials, or Qollab-hosted templates as a starting point is fine and encouraged. The differentiator is what teams build on top of them.
- Plagiarism, misrepresented authorship, or submitting someone else's unmodified work results in disqualification, including:
  - Submitting a pre-existing project (in whole or substantial part) as new work.
  - Copying code, circuit designs, or written explanations from external sources (papers, repos, tutorials, other participants) without disclosure and attribution.
  - Using a Qollab-hosted template or open-source library as a starting point without disclosure.
  - Two or more teams submitting substantially identical projects without independent development.
- Standard hackathon code of conduct at every node: harassment-free environment, respectful collaboration, no discrimination. Local organizers enforce on-site; Qollab handles platform-level and cross-node issues.

### Disputes & appeals
- All scoring and award determinations are final and not subject to appeal.
- Sole exception: disqualification under Originality & Code of Conduct. A written appeal may be sent within 24 hours of notification to hello@qollab.xyz, limited to disputing the factual basis. A reviewer separate from the original panel decides within 5 business days; that decision is final.
- **No reallocation:** a disqualified team's award or advancement slot is withdrawn and not reassigned or backfilled.
- **Return of awards:** if disqualification comes after payout or compute issuance, the full cash award must be returned and unused compute forfeited within 30 days. Qollab may pursue recovery and bar the individuals from future Qollab hackathons.

### Platform availability & force majeure
Qollab and IonQ make reasonable efforts to keep the platform and IonQ simulator available, but are not responsible for outages or degraded performance, including force majeure.

Outages over 12 hours during the build window:
- Qollab communicates the outage and expected resolution time via Slack.
- At Qollab's discretion, the build window and/or deadline may be extended proportionally, uniformly across all nodes.
- If an extension is not feasible, Qollab may accept late submissions with a documented outage-impact statement, without penalty to the team's score.
- No obligation to extend for shorter or intermittent outages, or problems isolated to a single participant's local setup.

### Participant obligations
Participants agree to:
- Release code and documentation under an MIT license.
- Make their projects available on Qollab for 12 months.
- Include the attribution: "This effort is supported by Qollab & IonQ".
- Provide a payment method in case they win a monetary award.

Award winners additionally agree to:
- Allow Qollab and IonQ to feature their work and profile, and to name the university hackathon node, in press releases and marketing.
- Be solely responsible for tax reporting.
- Post at least once on their social channels about their participation.

### Questions
- Node-level logistics: the local organizing team on the Slack channel assigned after registration.
- Platform, submission, or hardware access issues: the global support channel.
- Privacy, data or deletion requests: privacy@qollab.xyz. Registration data is handled under the Qollab Privacy Policy and used only to run the hackathon and operate the platform. Node organizers and judges see team, name, Qollab username and email.
