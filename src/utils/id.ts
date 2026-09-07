import { randomUUID } from "node:crypto";

export function generateDeviceId(): string {
  return randomUUID();
}