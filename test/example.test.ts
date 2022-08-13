import { assertEquals, assertExists } from "../deps.ts";
import { Bearer, RequestQuery, TwitterAPI } from "../src/mod.ts";

Deno.test("Search typehead", async () => {
  const client = new TwitterAPI(Bearer.Web, await TwitterAPI.getGuestToken());

  const query = new RequestQuery({
    q: "@deno_land",
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

  assertEquals(json.users[0].screen_name, "deno_land");

  assertExists(json.users[0].profile_image_url_https);
});

Deno.test("User By Screen Name", async () => {
  const client = new TwitterAPI(
    Bearer.Web,
    await TwitterAPI.getGuestToken(),
  );

  const query = new RequestQuery({
    variables: {
      screen_name: "deno_land",
      withSafetyModeUserFields: true,
      withSuperFollowsUserFields: true,
    },
  });

  const res = await client.request({
    method: "GET",
    urlType: "gql",
    path: "UserByScreenName",
    query: query,
  });

  const json = await res.json();

  assertEquals(json.data.user.result.rest_id, "1108769816230293504");
});

Deno.test("User Tweets", async () => {
  const client = new TwitterAPI(Bearer.Web, await TwitterAPI.getGuestToken());

  const query = new RequestQuery({
    variables: {
      userId: "1108769816230293504",
      count: 4,
      includePromotedContent: false,
      withVoice: false,
      withDownvotePerspective: true,
      withReactionsMetadata: false,
      withReactionsPerspective: false,
      withSuperFollowsTweetFields: false,
      withSuperFollowsUserFields: false,
    },
    features: {
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        false,
      interactive_text_enabled: true,
      standardized_nudges_misinfo: true,
      responsive_web_edit_tweet_api_enabled: true,
      responsive_web_enhance_cards_enabled: false,
      vibe_api_enabled: true,
      dont_mention_me_view_api_enabled: true,
      responsive_web_uc_gql_enabled: true,
    },
  });

  const res = await client.request({
    method: "GET",
    urlType: "gql",
    path: "UserTweets",
    query: query,
  });

  const json = await res.json();

  const timeline = json.data.user.result.timeline;

  //   console.dir(timeline, { depth: 10 });

  assertExists(timeline);
});
