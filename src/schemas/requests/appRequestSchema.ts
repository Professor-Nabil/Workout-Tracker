export interface appRequestSchema {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body: Object | undefined;
}
