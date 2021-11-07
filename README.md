# Seneca Tech Task

This project was built as a "solution" for a tech interview task.

- The assigned task is described in the [task.md](task.md) file
- The swagger file that was provided is located in [spec.yaml](spec.yaml)
## Tech stack

- NodeJS v16.13.0 with Typescript
- Postgres
- Fastify web framework
- Docker + Docker Compose

## Getting started

- Install dependencies such as Node and Docker
- Run `npm install`
- Then `npm run start` to launch local web server at http://localhost:3000

### Scripts

- `npm run start`: run local dev server in docker
- `npm run start:clean`: rebuilds and runs local dev server (run when npm dependencies change)
- `npm run lint`: lint project files
- `npm run test`: runs the project test suite
- `npm run test:coverage`: view test suite coverage in web browser
- `npm run build:production`: build and tag docker image for production deploy

## Assumptions, TODOs, thoughts

Assume that:

- `course_id` and `user_id` would be foreign keys, likely with their own tables. For this exercise, with the scope of the API spec, it didn't seem necessary to make more tables.
- CI/CD pipeline would handle database migrations.

Some future TODOs that could improve the project:

- Set up a CI/CD pipeline.
  - Run tests/linting/code coverage checks automatically for PRs.
  - Publish Docker images for immutable deployments.
  - Deploy on merge to main branch.
- Instrument application with open tracing (instead of relying on logs)
- Adjust test suite to test database integration instead of mocking DB calls
- Add git hooks to lint on commit, run tests before push.

Thoughts regarding the service's API:

- Personally, I don't like that sessions are created under `POST /course/:courseId`. If it were possible to change the spec, I would change this to `POST /course/:courseId/sessions`.
- Without knowing more about the service, I wonder whether it would make more sense to persist `started_at` and `ended_at` timestamps for sessions, instead of a single millisecond `timeStudied` value.

