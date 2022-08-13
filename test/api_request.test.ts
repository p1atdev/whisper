import { assertExists } from "../deps.ts";
import {
  APIRequest,
  APIRequestHeader,
  Bearer,
  TwitterURL,
} from "../src/mod.ts";

Deno.test("APIRequest: get guest token", async () => {
  const res = await APIRequest({
    method: "POST",
    url: TwitterURL.API("api/1.1"),
    path: "/guest/activate.json",
    headers: APIRequestHeader({
      auth: Bearer.Web,
    }),
  });

  const json = await res.json();

  assertExists(json.guest_token);
});
