// ./src/server.ts
import app from "./app.js";
import { env } from "./schemas/env.schema.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
