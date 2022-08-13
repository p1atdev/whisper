import { assertEquals, assertExists, assertNotEquals } from "../deps.ts";
import { Bearer, TwitterAPI } from "../src/mod.ts";

Deno.test("Create Twitter API client", () => {
  const client = new TwitterAPI(Bearer.Web);

  assertExists(client.auth.token);
});

Deno.test("Refrech client guest token", async () => {
  const client = new TwitterAPI(Bearer.Web);

  const before = client.guestToken;

  assertEquals(before, undefined);

  await client.refreshGuestToken();

  const after = client.guestToken;

  assertNotEquals(before, after);
});
