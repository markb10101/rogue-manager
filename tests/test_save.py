import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from rogue_manager.game import Game


def test_save_and_load(tmp_path):
    save_path = tmp_path / "test_save.json"
    game = Game("Hero", level=3, inventory=["sword", "potion"])
    game.save(save_path)
    assert save_path.exists()

    loaded_game = Game.load(save_path)
    assert loaded_game.player_name == "Hero"
    assert loaded_game.level == 3
    assert loaded_game.inventory == ["sword", "potion"]
