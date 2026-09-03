import { app } from "./app.js";
import { config } from "./config/env.js";

for (const host of config.hosts) {
  app.listen(config.port, host, () => {
    console.log(`[${config.appEnv}] Server dinlemede: http://${host}:${config.port}`);
  });
}