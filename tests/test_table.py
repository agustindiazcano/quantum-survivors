import json
from pathlib import Path

import pytest

from qgame.table import MAX_CARDS, build_table, card_key

SHIPPED = Path(__file__).resolve().parents[1] / "qollab" / "data" / "weapon_table.json"


def test_card_key():
    assert card_key([]) == ""
    assert card_key(["shotgun", "phantom", "shotgun"]) == "S,P,S"


def test_table_size_and_keys():
    t = build_table(max_cards=2)
    assert len(t["builds"]) == 1 + 4 + 16
    assert "S,P" in t["builds"] and "" in t["builds"]


def test_full_table_size():
    t = build_table()
    assert len(t["builds"]) == sum(4**n for n in range(MAX_CARDS + 1))
    assert t["builds"]["S,P,S"]["laser"] is True


def test_shipped_table_matches_recomputation():
    if not SHIPPED.exists():
        pytest.skip("table not generated yet")
    shipped = json.loads(SHIPPED.read_text())
    fresh = build_table()
    assert shipped["builds"].keys() == fresh["builds"].keys()
    for k, v in fresh["builds"].items():
        assert shipped["builds"][k]["probs"] == pytest.approx(v["probs"], abs=1e-6)
        assert shipped["builds"][k]["laser"] == v["laser"]
