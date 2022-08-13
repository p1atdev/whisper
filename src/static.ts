export class Authorization {
    type: "Bearer" | "OAuth"
    token: string

    constructor(type: "Bearer" | "OAuth", token: string) {
        this.type = type
        this.token = token
    }
}

/**
 * Class of bearer token.
 */
export class Bearer extends Authorization {
    private constructor(token: string) {
        super("Bearer", token)
    }

    /**
     * The official web client bearer token. (Recommended)
     */
    static Web: Bearer = new Bearer(
        "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
    )

    /**
     * Use your own bearer token if you want to use.
     * @param token
     * @returns
     */
    static Own(token: string): Bearer {
        return new Bearer(token)
    }
}

export type APIURLType = "gql" | "api/1.1" | "i/api/1.1" | "i/api/2" | "i/api/i"

export class TwitterURL {
    value: string

    private constructor(link: string) {
        this.value = link
    }

    static WebClient = new TwitterURL("https://twitter.com")

    static API(urlType: APIURLType): TwitterURL {
        switch (urlType) {
            case "gql": {
                return new TwitterURL("https://api.twitter.com/graphql")
            }
            case "api/1.1": {
                return new TwitterURL("https://api.twitter.com/1.1")
            }
            case "i/api/1.1": {
                return new TwitterURL("https://api.twitter.com/i/api/1.1")
            }
            case "i/api/2": {
                return new TwitterURL("https://api.twitter.com/i/api/2")
            }
            case "i/api/i": {
                return new TwitterURL("https://api.twitter.com/i/api/i")
            }
        }
    }
}
