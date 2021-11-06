import { RouteHandler } from "fastify";
import { getSession } from '../queries/sessions';
import { assertUnreachable, isOk, unwrap, FromFastifySchema } from '../utils';

export const SESSION_HEADERS_SCHEMA = {
  type: "object",
  required: ["x-user-id"],
  properties: {
    "x-user-id": { type: "string", format: "uuid" },
  },
  additionalProperties: false
} as const;

export const SESSION_BODY_SCHEMA = {
  type: "object",
  required: ["sessionId", "totalModulesStudied", "averageScore", "timeStudied"],
  properties: {
    sessionId: { type: "string", format: "uuid" },
    totalModulesStudied: { type: "number" },
    averageScore: { type: "number" },
    timeStudied: { type: "number" },
  },
  additionalProperties: false
} as const;

export const SESSION_PARAMS_SCHEMA = {
  type: "object",
  required: ["courseId", "sessionId"],
  properties: {
    courseId: { type: "string", format: "uuid" },
    sessionId: { type: "string", format: "uuid" },
  },
  additionalProperties: false
} as const;

export const GET_SESSION_SCHEMA = {
  headers: SESSION_HEADERS_SCHEMA,
  params: SESSION_PARAMS_SCHEMA,
  reply: SESSION_BODY_SCHEMA,
} as const;

export type GetSessionHandler = RouteHandler<FromFastifySchema<typeof GET_SESSION_SCHEMA>>;

export const getSessionHandler: GetSessionHandler = async (request, response) => {
  const userId = request.headers['x-user-id'];
  const { sessionId, courseId } = request.params;
  const result = await getSession({ sessionId, courseId, userId });

  if (isOk(result)) {
    const session = unwrap(result);
    return response.code(200).send({
      sessionId: session.session_id,
      totalModulesStudied: session.total_modules_studied,
      averageScore: session.average_score,
      timeStudied: session.time_studied,
    });
  }

  const error = unwrap(result);

  switch (error) {
    case "NOT_FOUND":
      response.code(404);
      throw new Error("No session exists for given parameters.");
    case "QUERY_FAILED": {
      response.code(500);
      throw new Error("Internal server error.");
    }
    default:
      assertUnreachable(error);
  }
};
