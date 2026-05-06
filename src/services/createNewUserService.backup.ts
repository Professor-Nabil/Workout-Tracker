import { type User } from "../models/User.js";
import { database } from "../repository/database.js";
import { view } from "../views/view.js";

interface Request_Create_New_User {
  method: "POST";
  url: "/user";
  body: Pick<User, "name">;
}

interface Response_Create_New_User {
  status: 201 | 400;
  body: {
    user: User;
    msg: string;
  };
}

export function createNewUser(request: Request_Create_New_User): void {
  const { name } = request.body;

  const generateId = database.User.length + 1;
  const newUser: User = { id: generateId, name: name };

  database.User.push(newUser);

  const response: Response_Create_New_User = {
    status: 201,
    body: {
      user: newUser,
      msg: "Success: Create new user",
    },
  };

  view(request, response);
}
