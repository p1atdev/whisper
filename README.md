# Whisper

A client that wraps the API behind Twitter.

[![deno module](https://shield.deno.dev/x/whisper)](https://deno.land/x/whisper)
![deno compatibility](https://shield.deno.dev/deno/^1.24)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![codecov](https://codecov.io/gh/p1atdev/whisper/branch/main/graph/badge.svg?token=S37OD55SBF)](https://codecov.io/gh/p1atdev/whisper)
![Testing](https://github.com/p1atdev/whisper/actions/workflows/test.yaml/badge.svg)
![Lint](https://github.com/p1atdev/whisper/actions/workflows/lint.yaml/badge.svg)

## Features

- You can use endpoints not officially provided
  - GraphQL endpoint (`UserByScreenName`, `UserTweets`, etc...)
  - "i" endpoint (`/users/email_available.json`, etc...)
- You can use the hidden api without any tokens
  - Whisper uses the official web client's token

## Example

Full example code can be seen on `/test/example.test.ts`

### User By Screen Name (GraphQL endpoint)

```ts
const client = new TwitterAPI(Bearer.Web);

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
```

### Search Adaptive (v2 endpoint)

```ts
const client = new TwitterAPI(Bearer.Web);

const query = new RequestQuery({
  q: "from:@deno_land",
  count: 3,
});

const res = await client.request({
  method: "GET",
  urlType: "i/api/2",
  path: "/search/adaptive.json",
  query: query,
});

const json = await res.json();

assertExists(json.globalObjects.users["1108769816230293504"]);
```

### User Tweets (GraphQL endpoint)

```ts
const client = new TwitterAPI(Bearer.Web);

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

console.dir(timeline, { depth: 10 });

// Output:
//
// {
//   timeline: {
//     instructions: [
//       { type: "TimelineClearCache" },
//       {
//         type: "TimelineAddEntries",
//         entries: [
//           {
//             entryId: "tweet-1558145641565474816",
//             sortIndex: "1558145641565474816",
//             content: {
//               entryType: "TimelineTimelineItem",
//               __typename: "TimelineTimelineItem",
//               itemContent: {
//                 itemType: "TimelineTweet",
//                 __typename: "TimelineTweet",
//                 tweet_results: {
//                   result: {
//                     __typename: "Tweet",
//                     rest_id: "1558145641565474816",
//                     core: [Object],
//                     card: [Object],
//                     unmention_info: [Object],
//                     unified_card: [Object],
//                     edit_control: [Object],
//                     legacy: [Object]
//                   }
//                 },
//                 tweetDisplayType: "Tweet",
//                 ruxContext: "HHwWgMCqnZTN0p8rAAAA"
//  ...
```

### Email Available (i endpoint)

```ts
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

const json = await res.json();

assertEquals(json.valid, false);
assertEquals(json.taken, false);
```

## Note

Request parameters and response types are not supported in this module due to
the rapidly changing unofficial API specifications. Beware that Twitter will
change its API specification without notice.
