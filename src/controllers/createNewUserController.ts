import { type createNewUserSchemaRequest } from "../schemas/createNewUserSchema.js";

type Body = Pick<createNewUserSchemaRequest, "body">;

export const createNewUserController = (body: Body) => {
  console.log(body);
};
