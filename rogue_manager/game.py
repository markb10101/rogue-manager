from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import List


@dataclass
class Game:
    """Simple game state container with save and load support."""

    player_name: str
    level: int = 1
    inventory: List[str] = field(default_factory=list)

    def save(self, path: str = "savegame.json") -> None:
        """Save the current game state to *path* as JSON."""
        data = {
            "player_name": self.player_name,
            "level": self.level,
            "inventory": self.inventory,
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f)

    @classmethod
    def load(cls, path: str = "savegame.json") -> Game:
        """Load game state from *path* and return a :class:`Game` instance."""
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)


if __name__ == "__main__":
    game = Game(player_name="Hero")
    game.inventory.append("rusty sword")
    game.save()
    print("Game saved to savegame.json")
