import { FastifySchema } from 'fastify';
import { FromSchema } from "json-schema-to-ts";

export type FromFastifySchema<T extends FastifySchema> = {
  [K in keyof T as `${Capitalize<string & K>}`]: FromSchema<T[K]>;
}
