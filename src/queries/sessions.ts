import { logger, sql, err, Result, ok } from "../utils";

export type GetSessionError =
  | "NOT_FOUND"
  | "QUERY_FAILED";

export interface Session {
  session_id: string;
  course_id: string;
  user_id: string;
  total_modules_studied: number;
  average_score: number;
  time_studied: number;
}

export const getSession = async (params: {
  sessionId: string;
  courseId: string;
  userId: string;
}): Promise<Result<Session, GetSessionError>> => {
  try {
    const [session] = await sql<Session[]>`
      SELECT
        session_id,
        course_id,
        user_id,
        total_modules_studied,
        average_score,
        time_studied
      FROM
        sessions
      WHERE
        session_id = ${params.sessionId}
      AND
        course_id = ${params.courseId}
      AND
        user_id = ${params.userId}
    `;

    if (!session) {
      return err("NOT_FOUND");
    }

    return ok(session);
  } catch (e) {
    logger.error(e);
    return err("QUERY_FAILED");
  }
};
