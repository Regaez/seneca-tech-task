import pino from "pino";
import { NODE_ENV, LOG_LEVEL } from "../configs";

export const logger = pino({
  // Prettify logging for non-production environments
  ...(NODE_ENV !== "production" && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l"
      }
    }
  }),
  level: LOG_LEVEL
});
