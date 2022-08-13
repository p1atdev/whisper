import { assertExists, assertNotEquals } from "../deps.ts"
import { TwitterAPI, Bearer } from "../src/mod.ts"

Deno.test("Create Twitter API client: should success", async () => {
    const client = new TwitterAPI(Bearer.Web, await TwitterAPI.getGuestToken())

    assertExists(client.guestToken.token)
})

Deno.test("Refrech client guest token: should success", async () => {
    const client = new TwitterAPI(Bearer.Web, await TwitterAPI.getGuestToken())

    const before = client.guestToken

    await client.refreshGuestToken()

    const after = client.guestToken

    assertNotEquals(before, after)
})
