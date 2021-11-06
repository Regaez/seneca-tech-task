export type Ok<T> = {
  data: T;
  err?: never;
};

export type Err<U> = {
  data?: never;
  err: U;
}

export type Result<T, U> = NonNullable<Ok<T> | Err<U>>;

export const unwrap = <T, U>({ data, err }: Result<T, U>): NonNullable<T | U> => {
  if (data !== undefined && err !== undefined) {
    throw new Error(`Received both data dn err values at runtime when opening a Result\nData: ${JSON.stringify(data)}\nRight: ${JSON.stringify(err)}`);
  }

  if (data !== undefined) {
    return data as NonNullable<T>;
  }

  if (err !== undefined) {
    return err as NonNullable<U>;
  }

  throw new Error(`Recieved no data or err values at runtime when opening Result.`);
};

export const isOk = <T, U>(r: Result<T, U>): r is Ok<T> => {
  return r.data !== undefined;
};

export const isErr = <T, U>(r: Result<T, U>): r is Err<U> => {
  return r.err !== undefined;
};

export const ok = <T>(value: T): Ok<T> => ({ data: value });
export const err = <U>(value: U): Err<U> => ({ err: value });

export const assertUnreachable = (x: never): never => {
  throw new Error(`Never case reached with unexpected value ${x}`);
};
