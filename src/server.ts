import fastify from "fastify";
import { SERVICE_PORT } from "./configs";
import { logger } from "./utils";
import {
  getSessionHandler,
  GET_SESSION_SCHEMA,
} from "./endpoints";

export const createServer = async () => {
  const server = fastify({ logger });

  server.get("/healthcheck", { logLevel: "error" }, (_, res) => {
    res.code(200).send("OK");
  });

  server.get(
    "/courses/:courseId/sessions/:sessionId",
    {
      schema: GET_SESSION_SCHEMA,
    },
    getSessionHandler
  );

  server.listen(SERVICE_PORT, "::", (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
};
