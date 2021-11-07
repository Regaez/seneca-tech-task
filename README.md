# Seneca Tech Task

## Tech stack

- NodeJS v16.13.0 with Typescript
- Postgres
- Fastify web framework
- Docker + Docker Compose

## Getting started

- Install dependencies such as Node and Docker
- Run `npm install`

### Scripts

- `npm run start`: run local dev server in docker
- `npm run start:clean`: rebuilds and runs local dev server (use when npm dependencies change)
- `npm run lint`: lint project files
- `npm run test`: run test suite
- `npm run test:coverage`: view test suite coverage in web browser

## Assumptions, TODOs, thoughts

Assume that:

- `course_id` and `user_id` would be foreign keys, likely with their own tables. For this exercise, with the scope of the API spec, it didn't seem necessary to make more tables.
- CI/CD pipeline would handle database migrations.

Some future TODOs that would improve the codebase:

- Set up a CI/CD pipeline.
  - Run tests automatically as PR checks.
  - Publish Docker images for immutable deployments.
  - Deploy on merge to main branch.
- Adjust test suite to test database integration instead of mocking DB calls

Thoughts regarding the service's API:

- Personally, I don't like that sessions are created under `POST /course/:courseId`. If it were possible to change the spec, I would change this to `POST /course/:courseId/sessions`.
- Without knowing more about the service, I wonder whether it would make more sense to persist `started_at` and `ended_at` timestamps for sessions, instead of a single millisecond `timeStudied` value.

