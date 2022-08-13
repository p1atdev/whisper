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

/**
 * URL search query parameters
 */
export class RequestQuery {
  data: Record<string, string> = {};

  constructor(data?: Record<string, unknown>) {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this.data[key] = JSON.stringify(value);
      });
    }
  }
}

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  urlType: APIURLType;
  path: string;
  cookie?: Map<string, string> | string;
  query?: RequestQuery;
  body?: Record<string, unknown>;
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

  /**
   * Send HTTP request.
   * @param options
   * @returns
   * @example await request({
   *  method: "GET",
   *  urlType: "api/1.1",
   *  path: "/search/typeahead.json",
   * })
   */
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
      query: options.query?.data,
      body: options.body,
    });

    return res;
  }

  static async getGuestToken(): Promise<GuestToken> {
    return await GuestToken.getToken();
  }
}
