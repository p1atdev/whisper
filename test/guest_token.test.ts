import { assertExists } from "../deps.ts";
import { GuestToken } from "../src/mod.ts";

Deno.test("Get guest token", async () => {
  const token = await GuestToken.getToken();

  assertExists(token.token);
});
