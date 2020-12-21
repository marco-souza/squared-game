import {
  WebSocket,
  WebSocketServer,
  WebSocketState,
} from "https://deno.land/x/websocket@v0.0.5/mod.ts";
import * as log from "https://deno.land/std@0.81.0/log/mod.ts";
import { GameAction, GameEvent, GameState, Player } from "./shared.ts";

const logger = log.getLogger();

export class GameServer {
  private wss: WebSocketServer;
  private gameState: GameState;
  private clients: WebSocket[];

  constructor(private port: number) {
    this.wss = new WebSocketServer(port);
    this.clients = [];
    this.gameState = {
      players: [],
    };
  }

  /**
   * start game server
   */
  public start = () => {
    logger.info(`Running websocket server at http://localhost:${this.port}`);
    this.setupListeners();
  };

  private setupListeners = () => {
    this.wss.on("connection", (ws: WebSocket) => {
      this.newConnectionHandler(ws);

      // Register all event handlers
      ws.on("message", this.messageHandler(ws));
      ws.on("close", this.closeHandler(ws));
    });
  };

  private newConnectionHandler = (ws: WebSocket) => {
    logger.info("New connection");
    this.addNewPlayer(ws);
    this.broadcastMessage(this.getStateMessage());
  };

  private messageHandler = (ws: WebSocket) =>
    (message: string) => {
      logger.info(`New message: ${message}`);
      this.eventHandler(ws, message)
      this.broadcastMessage(this.getStateMessage());
    };

  private eventHandler = (ws: WebSocket, message: string) => {
    const parsedMessage: GameAction = JSON.parse(message)
    const playerIndex = this.clients.indexOf(ws);

    switch (parsedMessage.type) {
      case "move-up":
        this.gameState.players[playerIndex].position.y--
        break
      case "move-down":
        this.gameState.players[playerIndex].position.y++
        break
      case "move-left":
        this.gameState.players[playerIndex].position.x--
        break
      case "move-right":
        this.gameState.players[playerIndex].position.x++
        break
    }
  }

  private closeHandler = (ws: WebSocket) =>
    () => {
      logger.info("Closing connection");
      this.removePlayer(ws);
      this.broadcastMessage(this.getStateMessage());
    };

  private broadcastMessage(message: string) {
    this.clients.map((ws) => {
      !ws.isClosed && ws.send(message);
    });
  }

  private removePlayer(ws: WebSocket) {
    const playerIndex = this.clients.indexOf(ws);
    delete this.gameState.players[playerIndex];
    delete this.clients[playerIndex];
  }

  private addNewPlayer(ws: WebSocket) {
    this.clients.push(ws)
    const newIndex = this.gameState.players.length
    const newPlayer: Player = {
      name: `P-${newIndex}`,
      size: 1,
      position: { x: 1, y: 1 + newIndex },
    }
    this.gameState.players.push(newPlayer)
  }

  private getStateMessage() {
    const event: GameEvent = {
      type: "state",
      data: this.gameState,
    };
    return JSON.stringify(event);
  }
}
