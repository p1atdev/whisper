import { assertEquals } from "../deps.ts";
import { add } from "../utils/mod.ts";

Deno.test("1 + 1 = ?", () => {
  const ans = add(1, 1);
  assertEquals(ans, 2);
});
