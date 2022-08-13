import { TwitterURL } from "./mod.ts";

export interface APIRequestHeaderOptions {
  cookie?: Map<string, string> | string;
  guestToken?: string;
  auth: {
    type: "Bearer" | "OAuth";
    token: string;
  };
}

/**
 * Options of twitter API request.
 */
export interface APIRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: TwitterURL;
  path: string;
  headers: Headers;
  query?: Map<string, JSON>;
  body?: Map<string, JSON>;
}

export const APIRequestHeader = (options: APIRequestHeaderOptions): Headers => {
  const headers = new Headers();
  if (options.cookie) {
    if (typeof options.cookie === "string") {
      headers.set("Cookie", options.cookie);
    } else {
      options.cookie.forEach((value, key) => {
        headers.set("Cookie", `${key}=${value}`);
      });
    }
  }

  if (options.guestToken) {
    headers.set("x-guest-token", options.guestToken);
  }

  headers.set("authorization", `${options.auth.type} ${options.auth.token}`);

  return headers;
};

export const APIRequest = async (
  options: APIRequestOptions,
): Promise<Response> => {
  const url = new URL(`${options.url.value}${options.path}`);

  if (options.query) {
    options.query.forEach((value, key) => {
      url.searchParams.append(key, JSON.stringify(value));
    });
  }

  const headers = options.headers || new Headers();

  const res = await fetch(url.toString(), {
    method: options.method,
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return res;
};
