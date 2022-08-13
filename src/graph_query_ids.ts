import { TwitterURL } from "./mod.ts";

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
    const html = await fetch(TwitterURL.WebClient.value);

    const htmlText = await html.text();

    // get main.js from html
    // const links = htmlText.match(/https:\/\/abs\.twimg\.com\/responsive-web\/client-web([^\/]+|)\/main\.[^.]+\.js/g)
    const links = htmlText.match(
      /https:\/\/abs\.twimg\.com\/responsive-web\/client-web([^\/]+|)\/main\.[^.]+\.js/g,
    );

    // if mainJsURLs is null, return empty array
    if (links === null) {
      return new Map();
    }

    // get main.js from mainJsURLs[0]
    const link = links[0];
    const mainJs = await fetch(link);

    // get all query ids from main.js
    const mainJsText = await mainJs.text();
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
