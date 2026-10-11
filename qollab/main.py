"""Quantum Survivors: quantum weapon system (Qiskit).

Every card of the game is a quantum gate on a 3-qubit direction register. This script simulates the example
builds below with Qiskit, compares them with a classical (no interference) model, rebuilds the full table of
card sequences that the game uses and checks it against the table shipped with the game.

Run: python main.py            (the demo)
     python main.py --export   (rewrite data/weapon_table.json)
"""
import json
import sys
import time
from pathlib import Path

from qgame.table import MAX_CARDS, build_table, card_key
from qgame.weapon import simulate

try:
    HERE = Path(__file__).resolve().parent
except NameError:  # Qollab runs the file with exec(): __file__ is not defined
    HERE = Path.cwd()
TABLE_PATH = HERE / "data" / "weapon_table.json"
ANGLES = [f"{45 * k:3d}" for k in range(8)]

DEMOS = [
    ("Base weapon", []),
    ("Mirror: turn around", ["mirror"]),
    ("Shotgun: cone of pellets (superposition)", ["shotgun"]),
    ("Shotgun + Shotgun: wider cone", ["shotgun", "shotgun"]),
    ("Phantom alone: nothing happens", ["phantom"]),
    ("Shotgun + Phantom + Shotgun: DEATH LASER (interference)", ["shotgun", "phantom", "shotgun"]),
    ("Laser + Mirror: laser back on the aim", ["shotgun", "phantom", "shotgun", "mirror"]),
    ("Shotgun + Link: shot with a linked echo (entanglement)", ["shotgun", "link"]),
]


def say(text=""):
    print(text, flush=True)


def bars(label, probs):
    say(f"  {label}")
    for k, p in enumerate(probs):
        if p > 1e-9:
            say(f"    sector {k} ({ANGLES[k]} deg) {p:5.1%} " + "#" * int(round(p * 30)))


def demo():
    for title, cards in DEMOS:
        r = simulate(cards)
        say(f"== {title}")
        say(f"  cards: {card_key(cards) or '(none)'}   gates: {' '.join(r['gates']) or '(none)'}")
        say("  circuit: q0,q1,q2 = 45/90/180 deg bits  " + " -> ".join(r["gates"] or ["(nothing)"]))
        bars("quantum (Qiskit Statevector):", r["probs"])
        bars("classical model (no interference):", r["classical"])
        extra = f"interference gain {abs(r['gain']) + 0.0:.2f}"
        if r["laser"]:
            extra += "  -> DEATH LASER"
        if r["echo_mask"]:
            extra += f"  | entanglement entropy {r['entropy']:.2f} bit, echo shot at sector XOR {r['echo_mask']}"
        say(f"  {extra}")
        say()


def check_table(table):
    if not TABLE_PATH.exists():
        say("No shipped table found (data/weapon_table.json).")
        return
    shipped = json.loads(TABLE_PATH.read_text())
    same_keys = shipped["builds"].keys() == table["builds"].keys()
    diff = 0.0
    flags = True
    if same_keys:
        for k, v in table["builds"].items():
            s = shipped["builds"][k]
            diff = max(diff, max(abs(a - b) for a, b in zip(s["probs"], v["probs"])))
            flags = flags and s["laser"] == v["laser"] and s["echo_mask"] == v["echo_mask"]
    ok = same_keys and flags and diff < 1e-6
    say(f"Matches the table used by the game: {'YES' if ok else 'NO'} (max probability difference {diff:.1e})")


_skip_next = None  # arguments of a call to ignore once: the platform's repeat of the automatic run


def main(export=False):
    global _skip_next
    if _skip_next == (export,):
        _skip_next = None
        return
    t0 = time.time()
    say("QUANTUM SURVIVORS - quantum weapon system")
    say("3 qubits = 8 firing sectors of 45 degrees. Cards are gates. Firing = measuring.")
    say()
    demo()
    say(f"Building the table of every card sequence up to {MAX_CARDS} cards...")
    table = build_table()
    lasers = sum(1 for b in table["builds"].values() if b["laser"])
    links = sum(1 for b in table["builds"].values() if b["echo_mask"])
    say(f"{len(table['builds'])} builds simulated exactly; {lasers} fire a Death Laser, {links} have an entangled echo.")
    if export:
        TABLE_PATH.parent.mkdir(exist_ok=True)
        TABLE_PATH.write_text(json.dumps(table, sort_keys=True, separators=(",", ":")))
        say(f"Table written to {TABLE_PATH}")
    else:
        check_table(table)
    say(f"Done in {time.time() - t0:.1f} s")


if __name__ == "__main__":
    main(export="--export" in sys.argv)
    _skip_next = main.__defaults__  # Qollab may call main() again with the defaults: run only once
