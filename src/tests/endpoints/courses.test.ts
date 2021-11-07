import { expect } from "chai";
import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import { createSandbox } from "sinon";
import { createServer } from "../../server";
import { SERVICE_PORT } from "../../configs";
import * as dbUtils from "../../utils/database";
import { Course } from "../../queries";

const sandbox = createSandbox();

const BASE_URL = `http://localhost:${SERVICE_PORT}`;

describe("Endpoint: courses", () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = createServer();
  });

  afterEach(done => {
    sandbox.restore();
    server.close(() => done());
  });

  describe("GET /courses/:course_id", () => {

    describe("should return status 400 when", () => {
      it("no `x-user-id` header is given", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
          }
        });

        expect(res.status).to.equal(400);
      });

      it("the `x-user-id` header is not uuid format", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": "invalid",
          }
        });

        expect(res.status).to.equal(400);
      });

      it("no `course_id` param is given", async () => {
        const course_id = "";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });

      it("the `course_id` param is not uuid format", async () => {
        const course_id = "invalid";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });
    });

    describe("should return status 404 when", () => {
      it("no entry for `courseId` and `userId` exists", async () => {
        // Mock database response
        sandbox.stub(dbUtils, 'sql').resolves([]);

        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(404);
      });
    });

    describe("should return status 500 when", () => {
      it("querying database fails", async () => {
        // Mock database response
        sandbox.stub(dbUtils, 'sql').throws();

        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(500);
      });
    });

    describe("should return status 200 when", () => {
      it("course stats exist for user", async () => {
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";

        // Mock database response
        const mock: Course = {
          course_id,
          user_id,
          total_modules_studied: 3,
          average_score: 2,
          time_studied: 123456
        };
        sandbox.stub(dbUtils, 'sql').resolves([mock]);

        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        const payload = await res.json();

        expect(res.status).to.equal(200);
        expect(payload).to.eql({
          totalModulesStudied: mock.total_modules_studied,
          averageScore: mock.average_score,
          timeStudied: mock.time_studied,
        });
      });
    });

  });

});
