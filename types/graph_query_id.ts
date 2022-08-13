export interface GraphQueryIdResponse {
    queryId: string
    operationName: string
    operationType: "mutations" | "queries"
}

export type GraphQueryIds = Map<string, string>
