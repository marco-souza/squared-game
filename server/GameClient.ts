import * as log from "https://deno.land/std@0.81.0/log/mod.ts";
import { WebSocketState } from "https://deno.land/x/websocket@v0.0.5/lib/websocket.ts";
import {
  GameAction,
  GameEvent,
  GameEventNames,
  MAX_RETRIES,
  Position,
  sleep,
  times,
} from "./shared.ts";

const logger = log.getLogger();

export class GameClient {
  private socket: WebSocket;
  private eventHandlers: Partial<Record<GameEventNames, Function>>;

  constructor(private url: string) {
    this.socket = new WebSocket(this.url);
    this.eventHandlers = {};

    this.registerHandlers();
  }

  /**
   * set event handler
   */
  public on(eventName: GameEventNames, handler: Function) {
    this.eventHandlers[eventName] = handler;
  }

  /**
   * send player position
   */
  public async sendPosition(pos: Position) {
    const event: GameAction = { type: "position", data: pos };
    await this.sendMessage(event);
  }

  private async sendMessage(event: object) {
    for (const i in times(MAX_RETRIES)) {
      if (this.socket.readyState === WebSocketState.OPEN) {
        // if connection is open, send the message
        this.socket.send(JSON.stringify(event));
        return;
      }
      await sleep(100);
    }
    log.error("Error on send message");
    log.error(event);
  }

  private registerHandlers = () => {
    this.socket.addEventListener("message", (event: MessageEvent) => {
      logger.info("Message received");
      logger.info(event.data);
      this.messageHandler(event.data);
    });
  };

  private messageHandler = (rawMessage: string) => {
    const parsedMessage: GameEvent = JSON.parse(rawMessage);
    logger.debug(parsedMessage);

    // send event to handler
    const handler = this.eventHandlers[parsedMessage.type];
    if (!handler) return;
    handler(parsedMessage.data);
  };
}
