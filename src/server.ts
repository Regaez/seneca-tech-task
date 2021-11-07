import fastify, { FastifyInstance } from "fastify";
import { SERVICE_PORT } from "./configs";
import { logger } from "./utils";
import {
  getCourseHandler,
  GET_COURSE_SCHEMA,
  getSessionHandler,
  GET_SESSION_SCHEMA,
  postSessionHandler,
  POST_SESSION_SCHEMA,
} from "./endpoints";

export const createServer = (): FastifyInstance => {
  const server = fastify({ logger });

  server.get("/healthcheck", { logLevel: "error" }, async (_, res) => {
    return res.code(200).send("OK");
  });

  server.get(
    "/courses/:courseId",
    {
      schema: GET_COURSE_SCHEMA,
    },
    getCourseHandler
  );

  server.post(
    "/courses/:courseId",
    {
      schema: POST_SESSION_SCHEMA,
    },
    postSessionHandler
  );

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

  return server;
};
