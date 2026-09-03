import dotenv from "dotenv";

const appEnv = process.env.APP_ENV ?? "development";

dotenv.config({ path: `.env.${appEnv}` });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Zorunlu environment değişkeni eksik: ${key}`);
  }
  return value;
}

const port = Number(requireEnv("PORT"));

if (Number.isNaN(port)) {
  throw new Error("PORT değeri sayı olmalıdır");
}

const hosts =
  appEnv === "production"
    ? ["127.0.0.1", requireEnv("DEVICE_IP")]
    : [requireEnv("BIND_HOST")];

export const config = {
  appEnv,
  port,
  hosts,
};