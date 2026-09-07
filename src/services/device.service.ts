import { MongoServerError, type Collection, type Filter } from "mongodb";
import { getDb } from "../config/database.js";
import { generateDeviceId } from "../utils/id.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";
import {
  toDevice,
  type CreateDeviceInput,
  type Device,
  type DeviceDocument,
  type DeviceType,
  type UpdateDeviceInput,
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
export interface DeviceFilters {
  type?: DeviceType;
  online?: boolean;
  enabled?: boolean;
}

export async function listDevices(filters: DeviceFilters): Promise<Device[]> {
  const query: Filter<DeviceDocument> = {};

  if (filters.type !== undefined) {
    query.type = filters.type;
  }

  if (filters.enabled !== undefined) {
    query.enabled = filters.enabled;
  }

  if (filters.online !== undefined) {
    query["status.online"] = filters.online;
  }

  const documents = await devicesCollection().find(query).toArray();

  return documents.map(toDevice);
}
export async function getDeviceById(id: string): Promise<Device> {
  const document = await devicesCollection().findOne({ _id: id });

  if (document === null) {
    throw new NotFoundError(`Cihaz bulunamadı: ${id}`);
  }

  return toDevice(document);
}
export async function replaceDevice(
  id: string,
  input: UpdateDeviceInput
): Promise<Device> {
  const existing = await devicesCollection().findOne({ _id: id });

  if (existing === null) {
    throw new NotFoundError(`Cihaz bulunamadı: ${id}`);
  }

  const replacement = {
    ...input,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  };

  try {
    await devicesCollection().replaceOne({ _id: id }, replacement);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError(
        "Bu deviceCode veya serialNumber başka bir cihazda kayıtlı"
      );
    }
    throw error;
  }

  return toDevice({ _id: id, ...replacement });
}