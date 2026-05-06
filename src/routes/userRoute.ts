import { type userRouteRequestSchema } from "../schemas/requests/userRouteRequestSchema.js";

export const userRoute = (request: userRouteRequestSchema) => {
  console.log(request.body.user);
};
