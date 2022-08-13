import { APIRequest, TwitterURL, APIRequestHeader, Bearer } from "./mod.ts"

export class GuestToken {
    token: string

    private constructor(token: string) {
        this.token = token
    }

    // FIXME: Add response type
    static async getToken(): Promise<GuestToken> {
        const res = await APIRequest({
            method: "POST",
            url: TwitterURL.API("api/1.1"),
            path: "/guest/activate.json",
            headers: APIRequestHeader({
                auth: Bearer.Web,
            }),
        })

        const json = await res.json()

        return new GuestToken(json.guest_token)
    }
}
