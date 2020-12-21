import React, { KeyboardEvent } from "https://esm.sh/react";
import { useGameClient } from "../../components/shared/gameClient.ts";
import { Player } from "../../server/shared.ts";

export default function StartGame() {
  const { gameState, actions } = useGameClient("ws://localhost:8081");
  const players: Player[] = Object.values(gameState?.players ?? {}).filter(
    (i) => i,
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        actions?.moveUp && actions.moveUp()
        break
      case "ArrowDown":
        actions?.moveDown && actions.moveDown()
        break
      case "ArrowLeft":
        actions?.moveLeft && actions.moveLeft()
        break
      case "ArrowRight":
        actions?.moveRight && actions.moveRight()
        break
    }
  }

  return (
    <div onKeyDown={e => handleKeyDown(e)} tabIndex={1}>
      <p>{`positions: ${JSON.stringify(gameState?.players)}`}</p>

      <div style={{ display: "flex" }}>
        {players.map((player, index) => {
          const colorVariant = (n: number) =>
            n + index * (255 - n) / players.length;
          const color = `rgb(${colorVariant(120)}, ${colorVariant(100)}, ${
            colorVariant(170)
          })`;

          return (
            <div
              key={player.name}
              style={{
                position: 'absolute',
                top: 10 + (player.position.y * 50),
                left: 10 + (player.position.x * 50),
                width: 30 * player.size,
                height: 30 * player.size,
                marginLeft: 10,
                backgroundColor: color,
              }}
            >
              {player.name}
            </div>
          );
        })}
      </div>
      <canvas></canvas>
    </div>
  );
}
