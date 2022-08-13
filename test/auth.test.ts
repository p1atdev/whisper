import { Bearer, OAuth } from "../src/mod.ts";
import { assertEquals } from "../deps.ts";

Deno.test("Web client bearer", () => {
  const bearer = Bearer.Web;

  assertEquals(bearer.type, "Bearer");
  assertEquals(
    bearer.token,
    "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  );
});

Deno.test("Own bearer", () => {
  const token = "MY_TOKEN";
  const bearer = Bearer.Own(token);

  assertEquals(bearer.type, "Bearer");
  assertEquals(bearer.token, token);
});

Deno.test("Own oauth", () => {
  const token = "MY_TOKEN";
  const oauth = OAuth.Own(token);

  assertEquals(oauth.type, "OAuth");
  assertEquals(oauth.token, token);
});
