import { RouteHandler } from "fastify";
import { getCourse } from "../queries";
import { assertUnreachable, isOk, unwrap, FromFastifySchema } from "../utils";

export const COURSE_HEADERS_SCHEMA = {
  type: "object",
  required: ["x-user-id"],
  properties: {
    "x-user-id": { type: "string", format: "uuid" },
  },
  additionalProperties: false
} as const;

export const COURSE_BODY_SCHEMA = {
  type: "object",
  required: ["totalModulesStudied", "averageScore", "timeStudied"],
  properties: {
    totalModulesStudied: { type: "number" },
    averageScore: { type: "number" },
    timeStudied: { type: "number" },
  },
  additionalProperties: false
} as const;

export const COURSE_PARAMS_SCHEMA = {
  type: "object",
  required: ["courseId"],
  properties: {
    courseId: { type: "string", format: "uuid" },
  },
  additionalProperties: false
} as const;

export const GET_COURSE_SCHEMA = {
  headers: COURSE_HEADERS_SCHEMA,
  params: COURSE_PARAMS_SCHEMA,
  reply: COURSE_BODY_SCHEMA,
} as const;

export type GetCourseHandler = RouteHandler<FromFastifySchema<typeof GET_COURSE_SCHEMA>>;

export const getCourseHandler: GetCourseHandler = async (request, response) => {
  const result = await getCourse({
    courseId: request.params.courseId,
    userId: request.headers["x-user-id"],
  });

  if (isOk(result)) {
    const course = unwrap(result);
    return response.code(200).send({
      totalModulesStudied: course.total_modules_studied,
      averageScore: course.average_score,
      timeStudied: course.time_studied,
    });
  }

  const error = unwrap(result);

  switch (error) {
    case "NOT_FOUND":
      response.code(404);
      throw new Error("No course exists for given parameters.");
    case "QUERY_FAILED":
      response.code(500);
      throw new Error("Internal server error.");
    default:
      assertUnreachable(error);
  }
};
