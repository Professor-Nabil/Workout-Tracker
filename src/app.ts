import { type appRequestSchema } from "./schemas/requests/appRequestSchema.js";
import { userRoute } from "./routes/userRoute.js";

export const app = (request: appRequestSchema) => {
  if (request.url === "/user")
    if (request.method === "POST")
      if (request.body)
        if ("user" in request.body)
          if (typeof request.body.user === "object")
            if (request.body.user)
              if ("name" in request.body.user) {
                console.log("hi");
                userRoute(request);
              }
};

// app({ method: "POST", url: "/user", body: { user: { name: "Nabil" } } });
