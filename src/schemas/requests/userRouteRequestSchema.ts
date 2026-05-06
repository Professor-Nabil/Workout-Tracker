export interface userRouteRequestSchema {
  method: "POST" | "GET";
  url: "/user";
  body: {
    user: Object;
  };
}
