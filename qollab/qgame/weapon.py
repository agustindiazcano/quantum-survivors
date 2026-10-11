"""Weapon = 3-qubit direction register. Sector k = 4*q2 + 2*q1 + q0, each sector is 45 degrees.

Cards are gates appended in pick order; their target qubits follow fixed rules (docs/WEAPON_SYSTEM.md, section 3).
Every build is simulated twice: exactly with Qiskit (Statevector) and with a classical stochastic model, so the
effect of interference can be measured as the difference between them.
"""
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import DensityMatrix, Statevector, entropy, partial_trace

N_QUBITS = 3
N_SECTORS = 2**N_QUBITS
BACK = 2  # q2 = 180 degrees: the "turn around" bit
LASER_MIN_GAIN = 0.25
LASER_MIN_PROB = 0.9
EPS = 1e-9


def resolve(cards):
    """Turn a list of card ids into a list of (gate name, qubits) using the auto-target rules."""
    gates = []
    used_h = []          # qubits already hit by a Shotgun
    last_h = None        # qubit of the most recent Shotgun
    last_touched = None  # qubit of the most recent quantum card
    prev_card, prev_q = None, None
    for card in cards:
        if card == "shotgun":
            if prev_card == "phantom":
                q = prev_q  # completes the H-Z-H sandwich
            else:
                free = [i for i in range(N_QUBITS) if i not in used_h]
                q = free[0] if free else len(used_h) % N_QUBITS
            used_h.append(q)
            last_h = q
            gates.append(("h", (q,)))
        elif card == "phantom":
            q = last_h if last_h is not None else 0
            gates.append(("z", (q,)))
        elif card == "mirror":
            q = last_touched if last_touched is not None else BACK
            gates.append(("x", (q,)))
        elif card == "link":
            q = last_h if last_h is not None else 0
            t = BACK if q != BACK else 0
            gates.append(("cx", (q, t)))
        else:
            raise ValueError(f"unknown card: {card}")
        last_touched, prev_card, prev_q = q, card, q
    return gates


def build_circuit(cards):
    qc = QuantumCircuit(N_QUBITS)
    for name, qubits in resolve(cards):
        getattr(qc, name)(*qubits)
    return qc


def classical_probs(cards):
    """Same cards as a classical stochastic model: X, CNOT permute; H randomizes a bit 50/50; Z does nothing."""
    p = np.zeros(N_SECTORS)
    p[0] = 1.0
    for name, qubits in resolve(cards):
        idx = np.arange(N_SECTORS)
        if name == "x":
            p = p[idx ^ (1 << qubits[0])]
        elif name == "h":
            p = 0.5 * (p + p[idx ^ (1 << qubits[0])])
        elif name == "cx":
            c, t = qubits
            src = np.where((idx >> c) & 1, idx ^ (1 << t), idx)
            p = p[src]
    return p


def simulate(cards):
    qc = build_circuit(cards)
    sv = Statevector(qc)
    probs = sv.probabilities()
    classical = classical_probs(cards)
    gain = float(probs.max() - classical.max())
    laser = bool(gain >= LASER_MIN_GAIN - EPS and probs.max() >= LASER_MIN_PROB)

    links = [q for name, q in resolve(cards) if name == "cx"]
    ent = 0.0
    echo_mask = 0
    if links:
        rho = partial_trace(DensityMatrix(sv), [i for i in range(N_QUBITS) if i != BACK])
        ent = float(entropy(rho, base=2))
        if ent > EPS:
            c, t = links[-1]
            echo_mask = (1 << c) | (1 << t)
    return {
        "gates": [f"{n}({','.join(map(str, q))})" for n, q in resolve(cards)],
        "probs": [float(x) for x in probs],
        "classical": [float(x) for x in classical],
        "gain": gain,
        "laser": laser,
        "entropy": ent,
        "echo_mask": echo_mask,
    }
