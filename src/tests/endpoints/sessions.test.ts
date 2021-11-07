import { expect } from "chai";
import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import { createSandbox } from "sinon";
import { createServer } from "../../server";
import { SERVICE_PORT } from "../../configs";
import * as dbUtils from "../../utils/database";
import { Session } from "../../queries";

const sandbox = createSandbox();

const BASE_URL = `http://localhost:${SERVICE_PORT}`;

describe("Endpoint: sessions", () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = createServer();
  });

  afterEach(done => {
    sandbox.restore();
    server.close(() => done());
  });

  describe("GET /courses/:course_id/sessions/:session_id", () => {

    describe("should return status 400 when", () => {
      it("no `x-user-id` header is given", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
          }
        });

        expect(res.status).to.equal(400);
      });

      it("the `x-user-id` header is not uuid format", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": "invalid",
          }
        });

        expect(res.status).to.equal(400);
      });

      it("no `course_id` param is given", async () => {
        const course_id = "";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });

      it("the `course_id` param is not uuid format", async () => {
        const course_id = "invalid";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });

      it("no `session_id` param is given", async () => {
        const session_id = "";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });

      it("the `session_id` param is not uuid format", async () => {
        const session_id = "invalid";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(400);
      });
    });

    describe("should return status 404 when", () => {
      it("no entry for `sessionId` exists", async () => {
        // Mock database response
        sandbox.stub(dbUtils, 'sql').resolves([]);

        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
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
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        expect(res.status).to.equal(500);
      });
    });

    describe("should return status 200 when", () => {
      it("session exists for user in course", async () => {
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";

        // Mock database response
        const mock: Session = {
          session_id,
          course_id,
          user_id,
          total_modules_studied: 3,
          average_score: 2,
          time_studied: 123456
        };
        sandbox.stub(dbUtils, 'sql').resolves([mock]);

        const res = await fetch(`${BASE_URL}/courses/${course_id}/sessions/${session_id}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          }
        });

        const payload = await res.json();

        expect(res.status).to.equal(200);
        expect(payload).to.eql({
          sessionId: mock.session_id,
          totalModulesStudied: mock.total_modules_studied,
          averageScore: mock.average_score,
          timeStudied: mock.time_studied,
        });
      });
    });

  });

  describe("POST /courses/:course_id", () => {

    describe("should return status 400 when", () => {
      it("no `x-user-id` header is given", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `x-user-id` header is not uuid format", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": "invalid",
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("no `course_id` param is given", async () => {
        const course_id = "";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `course_id` param is not uuid format", async () => {
        const course_id = "invalid";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the request body does not contain a `session_id` property", async () => {
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `session_id` body property is not uuid format", async () => {
        const session_id = "invalid";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the request body does not contain a `totalModulesStudied` property", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `totalModulesStudied` body property is not a number", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: "not a number",
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the request body does not contain a `averageScore` property", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `averageScore` body property is not a number", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: "not a number",
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the request body does not contain a `averageScore` property", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0
          })
        });

        expect(res.status).to.equal(400);
      });

      it("the `averageScore` body property is not a number", async () => {
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: "not a number"
          })
        });

        expect(res.status).to.equal(400);
      });
    });

    describe("should return status 500 when", () => {
      it("querying database fails", async () => {
        // Mock database response
        sandbox.stub(dbUtils, 'sql').throws();

        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(500);
      });
    });

    describe("should return status 201 when", () => {
      it("successful request", async () => {
        const user_id = "e014e4fd-db94-440a-b437-8f8eed897c20";
        const course_id = "460ec7f6-eed6-41fa-ba9c-7ae80b239484";
        const session_id = "c425ad42-4f13-4d98-a3c5-f2ad8efe32ed";

        // Mock database response
        sandbox.stub(dbUtils, 'sql').resolves();

        const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user_id,
          },
          body: JSON.stringify({
            sessionId: session_id,
            totalModulesStudied: 0,
            averageScore: 0,
            timeStudied: 0
          })
        });

        expect(res.status).to.equal(201);
      });
    });
  });

});
