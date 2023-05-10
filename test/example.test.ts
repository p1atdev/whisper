import { assertEquals, assertExists } from "../deps.ts";
import { Bearer, RequestQuery, TwitterAPI } from "../src/mod.ts";

Deno.test("Search typehead", async () => {
  const client = new TwitterAPI(Bearer.Web);

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

  assertEquals(res.status, 200);

  const json = await res.json();

  assertEquals(json.users[0].screen_name, "deno_land");

  assertExists(
    json.users[0].profile_image_url_https,
    "profile image url should exist",
  );
});

Deno.test("User By Screen Name", async () => {
  const client = new TwitterAPI(Bearer.Web);

  const query = new RequestQuery({
    variables: {
      screen_name: "deno_land",
      withSafetyModeUserFields: true,
    },
    features: {
      blue_business_profile_image_shape_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      highlights_tweets_tab_ui_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: false,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    },
  });

  const res = await client.request({
    method: "GET",
    urlType: "gql",
    path: "UserByScreenName",
    query: query,
  });

  // console.log(res.status)

  assertEquals(res.status, 200);

  const json = await res.json();

  assertEquals(json.data.user.result.rest_id, "1108769816230293504");
});

Deno.test("User Tweets", async () => {
  const client = new TwitterAPI(Bearer.Web);

  const query = new RequestQuery({
    variables: {
      userId: "1108769816230293504",
      count: 4,
      includePromotedContent: true,
      withQuickPromoteEligibilityTweetFields: true,
      withVoice: true,
    },
    features: {
      rweb_lists_timeline_redesign_enabled: false,
      blue_business_profile_image_shape_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      tweetypie_unmention_optimization_enabled: true,
      vibe_api_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        false,
      interactive_text_enabled: true,
      responsive_web_text_conversations_enabled: false,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: false,
      responsive_web_enhance_cards_enabled: false,
    },
  });

  const res = await client.request({
    method: "GET",
    urlType: "gql",
    path: "UserTweets",
    query: query,
  });

  assertEquals(res.status, 200);

  const json = await res.json();

  const timeline = json.data.user.result.timeline;

  console.dir(timeline, { depth: 10 });

  assertExists(timeline, "timeline should exist");
});

Deno.test("Email available", async () => {
  const client = new TwitterAPI(Bearer.Web);

  const query = new RequestQuery({
    email: "twitter@example.com",
  });

  const res = await client.request({
    method: "GET",
    urlType: "i/api/i",
    path: "/users/email_available.json",
    query: query,
  });

  assertEquals(res.status, 200);

  const json = await res.json();

  assertEquals(json.valid, false, "valid should false");
  assertEquals(json.taken, true, "taken should true");
});

// // deprecated by twitter...
// Deno.test("Search adaptive", async () => {
//     const client = new TwitterAPI(Bearer.Web)

//     const query = new RequestQuery({
//         q: "from:@deno_land",
//         count: 10,
//     })

//     const res = await client.request({
//         method: "GET",
//         urlType: "i/api/2",
//         path: "/search/adaptive.json",
//         query: query,
//     })

//     assertEquals(res.status, 200)

//     const json = await res.json()

//     // console.dir(json, { depth: 10 });

//     assertExists(json.globalObjects.users["1108769816230293504"], "deno_land should exist")
// })
