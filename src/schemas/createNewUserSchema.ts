import { type User } from "../models/User.js";

export interface createNewUserSchemaRequest {
  method: "POST";
  url: "/user";
  body: Pick<User, "name">;
}

export interface createNewUserSchemaResponse {
  status: 201 | 400;
  body: {
    user: User;
    msg: string;
  };
}
