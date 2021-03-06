export type GameEventNames = "state" | "collision";

export type GameActionNames = "move-up" | "move-down" | "move-left" | "move-right";

export interface Position {
  x: number;
  y: number;
}

export interface GameEvent {
  type: GameEventNames;
  data?: object;
}

export interface GameAction {
  type: GameActionNames;
  data?: object;
}

export interface Player {
  size: number;
  name: string;
  position: Position;
}

export interface GameState {
  players: Player[];
}

export const sleep = (ms: number) =>
  new Promise(
    (res) => setTimeout(res, ms),
  );

export const times = (retries: number) => Array.from({ length: retries });

export const MAX_RETRIES = 30;
