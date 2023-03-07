import { TwitterURL } from "./mod.ts";
import { UserAgent } from "./static.ts";

interface GraphQueryIdResponse {
  queryId: string;
  operationName: string;
  operationType: "mutations" | "queries";
}

export type GraphQueryIds = Map<string, string>;

export class GraphQuery {
  /**
   * Get graphql endpoint random ids
   * @returns Promise<GraphQueryId[]>
   */
  static getIds = async (): Promise<GraphQueryIds> => {
    const html = await fetch(TwitterURL.WebClient.value, {
      headers: {
        "User-Agent": UserAgent.Firefox,
      },
    });

    const htmlText = await html.text();
    // console.log(htmlText)

    // get api.*..js from html
    // the format is `api:"9eacf99",`
    const apiJsId = htmlText.match(/api:"([^"]+)",/);
    if (apiJsId === null) {
      throw new Error("Cannot get api.*.js id");
    }
    // console.log(apiJsId)

    const link = `https://abs.twimg.com/responsive-web/client-web/api.${
      apiJsId[1]
    }a.js`;
    // console.log(link)

    const mainJs = await fetch(link);

    // get all query ids from main.js
    const mainJsText = await mainJs.text();
    // console.log(mainJsText)
    const queryIds = mainJsText.match(
      /{queryId:"([^"]+)",operationName:"([^"]+)",operationType:"([^"]+)"/g,
    ) || [];
    const patchedQueryArray = queryIds.map((query) => query + "}");

    const queries = patchedQueryArray.map((query) => {
      const correctQuery = query.replace(
        /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
        '"$2": ',
      );
      const queryJson = JSON.parse(correctQuery);
      const queryData: GraphQueryIdResponse = {
        queryId: queryJson.queryId,
        operationName: queryJson.operationName,
        operationType: queryJson.operationType,
      };
      return queryData;
    });

    const queryIdsMap = new Map<string, string>();
    for (const query of queries) {
      queryIdsMap.set(query.operationName, query.queryId);
    }

    return queryIdsMap;
  };
}
