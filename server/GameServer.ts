import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.0.5/mod.ts";
import * as log from "https://deno.land/std@0.81.0/log/mod.ts";
import { GameEvent, GameState } from "./shared.ts";

const logger = log.getLogger();

export class GameServer {
  private wss: WebSocketServer;
  private gameState: GameState;

  constructor(private port: number) {
    this.wss = new WebSocketServer(port);
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
      ws.on("close", this.updateState(ws));
    });
  };

  private newConnectionHandler = (ws: WebSocket) => {
    logger.info("New connection");
  }

  private messageHandler = (ws: WebSocket) =>
    (message: string) => {
      logger.info(message);
      this.generateNewState()
      this.broadcastMessage(this.getStateMessage())
    };

  private updateState = (ws: WebSocket) =>
    () => {
      logger.info("state update", ws.state);
    }

  private broadcastMessage(message: string) {
    [...this.wss.clients].map(ws => {
      ws.send(message)
    })
  }

  private generateNewState() {
    // TODO: Generate new state
  }

  private getStateMessage = () => {
    const event: GameEvent = {
      type: "state",
      data: this.gameState
    }
    return JSON.stringify(event)
  }
}
