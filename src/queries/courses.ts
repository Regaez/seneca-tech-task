import { logger, sql, err, Result, ok } from "../utils";

export type GetCourseError =
  | "NOT_FOUND"
  | "QUERY_FAILED";

export interface Course {
  total_modules_studied: number;
  average_score: number;
  time_studied: number;
}

export const getCourse = async (params: {
  courseId: string;
  userId: string;
}): Promise<Result<Course, GetCourseError>> => {
  try {
    const [course] = await sql<Course[]>`
      SELECT
        course_id,
        user_id,
        SUM(total_modules_studied)::int as total_modules_studied,
        SUM(average_score)::int as average_score,
        SUM(time_studied)::int as time_studied
      FROM
        sessions
      WHERE
        course_id = ${params.courseId}
      AND
        user_id = ${params.userId}
      GROUP BY
        course_id, user_id
    `;

    if (!course) {
      return err("NOT_FOUND");
    }

    logger.debug({ course });

    return ok(course);
  } catch (e) {
    logger.error(e);
    return err("QUERY_FAILED");
  }
};
