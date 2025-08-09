# Rogue Manager

Simple prototype demonstrating a save feature for game state.

## Usage

```python
from rogue_manager.game import Game

game = Game("Hero")
# modify game state
loaded_game = Game.load()  # loads from savegame.json if it exists
```
