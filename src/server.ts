import app from "./app.js";
import env from "./lib/env.js";

app.listen(env.PORT, () => {
  console.log(`Server is listening on prot ${env.PORT}`);
});
