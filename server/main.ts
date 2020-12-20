import * as log from "https://deno.land/std/log/mod.ts";
import { GameServer } from "./GameServer.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

const server = new GameServer(8081);
server.start();
