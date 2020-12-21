import {
  GameAction,
  GameEvent,
  GameEventNames,
  MAX_RETRIES,
  Position,
  sleep,
  times,
} from "./shared.ts";

export class GameClient {
  private socket: WebSocket;
  private eventHandlers: Partial<Record<GameEventNames, Function>>;

  constructor(private url: string) {
    this.socket = new WebSocket(this.url);
    this.eventHandlers = {};

    this.registerHandlers();
  }

  /**
   * close client
   */
  public close = () => {
    this.socket.close();
  }

  /**
   * set event handler
   */
  public on = (eventName: GameEventNames, handler: Function) => {
    this.eventHandlers[eventName] = handler;
  }

  /**
   * move down
   */
  public moveDown = () => {
    const event: GameAction = { type: "move-down" };
    this.sendMessage(event);
  }

  /**
   * move up
   */
  public moveUp = () => {
    const event: GameAction = { type: "move-up" };
    this.sendMessage(event);
  }

  /**
   * move left
   */
  public moveLeft = () => {
    const event: GameAction = { type: "move-left" };
    this.sendMessage(event);
  }

  /**
   * move right
   */
  public moveRight = () => {
    const event: GameAction = { type: "move-right" };
    this.sendMessage(event);
  }

  private sendMessage = async (event: object) =>{
    for (const i in times(MAX_RETRIES)) {
      if (this.socket.readyState === 1) {
        // if connection is open, send the message
        this.socket.send(JSON.stringify(event));
        return;
      }
      await sleep(100);
    }
  }

  private registerHandlers = () => {
    this.socket.addEventListener("message", (event: MessageEvent) => {
      this.messageHandler(event.data);
    });
  };

  private messageHandler = (rawMessage: string) => {
    const parsedMessage: GameEvent = JSON.parse(rawMessage);

    // send event to handler
    const handler = this.eventHandlers[parsedMessage.type];
    if (!handler) return;
    handler(parsedMessage.data);
  };
}
