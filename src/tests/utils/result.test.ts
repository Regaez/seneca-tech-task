import { expect } from "chai";
import { unwrap, isOk, ok, isErr, err, Result, assertUnreachable } from "../../utils";

describe("Utils: result", () => {

  describe("unwrap()", () => {
    it("should return the `data`", () => {
      const mock = "foo";
      const data = unwrap<string, Error>({ data: mock });
      expect(data).to.equal(mock);
    });

    it("should return the `err`", () => {
      const mock = new Error();
      const err = unwrap<string, Error>({ err: mock });
      expect(err).to.eql(mock);
    });

    it("should throw an error when both values exist", () => {
      // @ts-ignore
      const result: Result<string, Error> = { data: "foo", err: new Error() };
      const fn = () => unwrap(result);
      expect(fn).to.throw();
    });

    it("should throw an error when no values exist", () => {
      // @ts-ignore
      const result: Result<string, Error> = {};
      const fn = () => unwrap(result);
      expect(fn).to.throw();
    });
  });

  describe("isOk()", () => {
    it("should return `true` when data is defined", () => {
      const result: Result<string, Error> = { data: "foo" };
      expect(isOk(result)).to.be.true;
    });

    it("should return `false` when data is undefined", () => {
      const result: Result<string, Error> = { err: new Error() };
      expect(isOk(result)).to.be.false;
    });
  });

  describe("isErr()", () => {
    it("should return `true` when err is defined", () => {
      const result: Result<string, Error> = { err: new Error() };
      expect(isErr(result)).to.be.true;
    });

    it("should return `false` when err is undefined", () => {
      const result: Result<string, Error> = { data: "foo" };
      expect(isErr(result)).to.be.false;
    });
  });

  describe("ok()", () => {
    it("should return object with `data` property", () => {
      expect(ok("foo")).to.eql({ data: "foo" });
    });
  });

  describe("err()", () => {
    it("should return object with `err` property", () => {
      expect(err("foo")).to.eql({ err: "foo" });
    });
  });

  describe("assertUnreachable()", () => {
    it("should always throw an error when given any value", () => {
      [0, 1, true, false, "foo", {}, [], () => {}, undefined, null]
        .forEach(value => {
          // @ts-ignore
          const fn = () => assertUnreachable(value);
          expect(fn).to.throw();
        });
    });
  });

});
