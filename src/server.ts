import app from "./app.js";
import env from "./lib/env.schema.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on prot ${PORT}`);
});
