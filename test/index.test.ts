import { test, assert } from "vitest";
import { name } from "../src";

test("simple", () => {
  assert.equal(name, "json-configure");
});
