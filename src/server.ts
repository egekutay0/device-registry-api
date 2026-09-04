import { app } from "./app.js";
import { config } from "./config/env.js";
import { connectToDatabase } from "./config/database.js";

async function startServer(): Promise<void> {
  await connectToDatabase();

  for (const host of config.hosts) {
    app.listen(config.port, host, () => {
      console.log(`[${config.appEnv}] Server dinlemede: http://${host}:${config.port}`);
    });
  }
}

startServer().catch((error) => {
  console.error("Uygulama başlatılamadı:", error);
  process.exit(1);
});