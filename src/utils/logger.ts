import pino from "pino";
import { NODE_ENV, LOG_LEVEL } from "../configs";

export const logger = pino({
  prettyPrint: NODE_ENV === "production" ? false : {
    colorize: true,
    ignore: "pid,hostname",
    translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l"
  },
  level: LOG_LEVEL
});
