import { MongoClient, type Db } from "mongodb";
import { config } from "./env.js";

const client = new MongoClient(config.mongoUri, {
  serverSelectionTimeoutMS: 5000,
});

let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  await client.connect();
  await client.db(config.mongoDbName).command({ ping: 1 });

  db = client.db(config.mongoDbName);
  await db.collection("devices").createIndex({ deviceCode: 1 }, { unique: true });
  await db.collection("devices").createIndex({ serialNumber: 1 }, { unique: true });
  console.log(`MongoDB bağlantısı kuruldu: ${config.mongoDbName}`);

  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Veritabanı bağlantısı henüz kurulmadı");
  }
  return db;
}