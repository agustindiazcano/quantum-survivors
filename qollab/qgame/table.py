"""Exact table of every card sequence up to MAX_CARDS quantum cards (consumed by the game)."""
from itertools import product

from .weapon import N_QUBITS, simulate

MAX_CARDS = 5
CARD_CODES = {"mirror": "M", "shotgun": "S", "phantom": "P", "link": "L"}
CODE_TO_CARD = {v: k for k, v in CARD_CODES.items()}
DECIMALS = 6


def card_key(cards):
    return ",".join(CARD_CODES[c] for c in cards)


def _round(r):
    out = dict(r)
    for k in ("probs", "classical"):
        out[k] = [round(x, DECIMALS) for x in r[k]]
    for k in ("gain", "entropy"):
        out[k] = round(r[k], DECIMALS)
    return out


def build_table(max_cards=MAX_CARDS):
    builds = {}
    for n in range(max_cards + 1):
        for seq in product(CARD_CODES, repeat=n):
            builds[card_key(seq)] = _round(simulate(list(seq)))
    return {
        "version": 1,
        "qubits": N_QUBITS,
        "sectors": 2**N_QUBITS,
        "max_cards": max_cards,
        "cards": CARD_CODES,
        "builds": builds,
    }
