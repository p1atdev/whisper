import { assertExists } from "../deps.ts";
import { GraphQuery } from "../src/mod.ts";

Deno.test("Get graph query ids", async () => {
  const graphQueryIds = await GraphQuery.getIds();

  assertExists(graphQueryIds);
});
