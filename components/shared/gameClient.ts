import { useEffect, useState } from "https://esm.sh/react";
import { GameClient } from "../../server/GameClient.ts";
import { GameState } from "../../server/shared.ts";

interface Actions {
  moveUp?: Function;
  moveDown?: Function;
  moveLeft?: Function;
  moveRight?: Function;
}

export function useGameClient(url: string) {
  const [gameState, setGameState] = useState<GameState>();
  const [actions, setActions] = useState<Actions>()

  useEffect(() => {
    const client = new GameClient(url);
    client.on("state", setGameState);
    setActions({
      moveUp: client.moveUp,
      moveDown: client.moveDown,
      moveLeft: client.moveLeft,
      moveRight: client.moveRight,
    })

    return () => {
      client.close();
    };
  }, []);

  return {
    gameState,
    actions,
  };
}
