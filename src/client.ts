import {
  APIRequest,
  APIRequestHeader,
  APIURLType,
  Authorization,
  Bearer,
  GraphQueryIds,
  GuestToken,
  TwitterURL,
} from "./mod.ts";

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  urlType: APIURLType;
  path: string;
  cookie?: Map<string, string> | string;
  query?: Map<string, JSON>;
  body?: Map<string, JSON>;
}

export class TwitterAPI {
  auth: Authorization;
  graphQueryIds: GraphQueryIds = new Map();

  guestToken: GuestToken;

  constructor(
    private _auth: Authorization = Bearer.Web,
    private _guestToken: GuestToken,
  ) {
    this.auth = _auth;
    this.guestToken = _guestToken;
  }

  /**
   * Refresh the guest token.
   */
  async refreshGuestToken() {
    this.guestToken = await GuestToken.getToken();
  }

  async request(options: RequestOptions): Promise<Response> {
    const header = APIRequestHeader({
      cookie: options.cookie,
      guestToken: this.guestToken.token,
      auth: {
        type: this.auth.type,
        token: this.auth.token,
      },
    });

    const path: string = (() => {
      if (options.urlType == "gql") {
        const id = this.graphQueryIds.get(options.path);
        return `${id}/${options.path}`;
      } else {
        return options.path;
      }
    })();

    const res = await APIRequest({
      method: options.method,
      url: TwitterURL.API(options.urlType),
      path: path,
      headers: header,
      query: options.query,
      body: options.body,
    });

    return res;
  }

  static async getGuestToken(): Promise<GuestToken> {
    return await GuestToken.getToken();
  }
}
