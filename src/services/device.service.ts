import { MongoServerError, type Collection } from "mongodb";
import { getDb } from "../config/database.js";
import { generateDeviceId } from "../utils/id.js";
import { ConflictError } from "../utils/errors.js";
import {
  toDevice,
  type CreateDeviceInput,
  type Device,
  type DeviceDocument,
} from "../models/device.js";

function devicesCollection(): Collection<DeviceDocument> {
  return getDb().collection<DeviceDocument>("devices");
}

export async function createDevice(input: CreateDeviceInput): Promise<Device> {
  const now = new Date();

  const document: DeviceDocument = {
    _id: generateDeviceId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await devicesCollection().insertOne(document);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError("Bu deviceCode veya serialNumber zaten kayıtlı");
    }
    throw error;
  }

  return toDevice(document);
}