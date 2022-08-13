import { assertExists } from "../deps.ts";
import { Bearer, RequestQuery, TwitterAPI } from "../src/mod.ts";

Deno.test("Search typehead", async () => {
  const client = new TwitterAPI(Bearer.Web, await TwitterAPI.getGuestToken());

  const query = new RequestQuery({
    q: "denoland",
    src: "search_box",
    result_type: ["events", "users", "topics"],
  });

  const res = await client.request({
    method: "GET",
    urlType: "api/1.1",
    path: "/search/typeahead.json",
    query: query,
  });

  const json = await res.json();

  assertExists(json.num_results);
});
