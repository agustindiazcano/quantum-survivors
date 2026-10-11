"""Weapon system tests (written first). See docs/WEAPON_SYSTEM.md."""
import numpy as np
import pytest

from qgame.weapon import N_SECTORS, build_circuit, resolve, simulate

M, S, P, L = "mirror", "shotgun", "phantom", "link"


def probs(cards):
    return np.array(simulate(cards)["probs"])


def test_base_weapon_fires_forward():
    p = probs([])
    assert p[0] == pytest.approx(1.0)
    assert simulate([])["laser"] is False


@pytest.mark.parametrize("cards", [[], [S], [S, S], [S, P, S], [M], [S, L], [S, S, L, P, M]])
def test_probabilities_sum_to_one(cards):
    p = probs(cards)
    assert len(p) == N_SECTORS
    assert p.sum() == pytest.approx(1.0)


def test_mirror_alone_turns_around():
    assert probs([M])[4] == pytest.approx(1.0)


def test_shotgun_is_a_50_50_cone():
    p = probs([S])
    assert p[0] == pytest.approx(0.5) and p[1] == pytest.approx(0.5)


def test_second_shotgun_widens_the_cone():
    p = probs([S, S])
    assert p[[0, 1, 2, 3]] == pytest.approx([0.25] * 4)


def test_phantom_alone_changes_nothing():
    assert probs([P]) == pytest.approx(probs([]))
    assert probs([S, P]) == pytest.approx(probs([S]))


def test_h_z_h_equals_x_interference():
    # Shotgun, Phantom, Shotgun on the same qubit fuses the cone into one sector (HZH = X).
    r = simulate([S, P, S])
    assert r["probs"][1] == pytest.approx(1.0)
    assert r["classical"][0] == pytest.approx(0.5)
    assert r["gain"] == pytest.approx(0.5)
    assert r["laser"] is True


def test_plain_shotgun_has_no_interference_gain():
    r = simulate([S])
    assert r["gain"] == pytest.approx(0.0)
    assert r["laser"] is False


def test_mirror_after_combo_points_laser_back_at_aim():
    r = simulate([S, P, S, M])
    assert r["probs"][0] == pytest.approx(1.0)
    assert r["laser"] is True


def test_resolve_targets():
    assert resolve([S, P, S]) == [("h", (0,)), ("z", (0,)), ("h", (0,))]
    assert resolve([S, S]) == [("h", (0,)), ("h", (1,))]
    assert resolve([M]) == [("x", (2,))]
    assert resolve([S, L]) == [("h", (0,)), ("cx", (0, 2))]


def test_link_entangles_and_has_echo():
    r = simulate([S, L])
    assert r["entropy"] == pytest.approx(1.0)
    assert r["echo_mask"] == 0b101
    support = [k for k, v in enumerate(r["probs"]) if v > 1e-9]
    assert all((k ^ r["echo_mask"]) in support for k in support)


def test_link_without_superposition_is_not_entangled():
    r = simulate([L])
    assert r["entropy"] == pytest.approx(0.0)
    assert r["echo_mask"] == 0


def test_circuit_is_a_real_qiskit_circuit():
    qc = build_circuit([S, P, S])
    assert qc.num_qubits == 3
    assert [i.operation.name for i in qc.data] == ["h", "z", "h"]
