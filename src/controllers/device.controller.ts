import type { Request, Response } from "express";
import { DEVICE_TYPES, type CreateDeviceInput, type DeviceType, type UpdateDeviceInput, type PatchDeviceInput } from "../models/device.js";
import type { DeviceFilters } from "../services/device.service.js";
import { ValidationError } from "../utils/errors.js";
import * as deviceService from "../services/device.service.js";
import { sendSuccess } from "../utils/response.js";

export async function createDevice(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateDeviceInput;

  const device = await deviceService.createDevice(input);

  sendSuccess(res, 201, device);
}
export async function listDevices(req: Request, res: Response): Promise<void> {
  const filters: DeviceFilters = {};

  const { type, online, enabled } = req.query;

  if (typeof type === "string") {
    if (!(DEVICE_TYPES as readonly string[]).includes(type)) {
      throw new ValidationError(`Geçersiz type değeri: ${type}`);
    }
    filters.type = type as DeviceType;
  }

  if (typeof online === "string") {
    filters.online = online === "true";
  }

  if (typeof enabled === "string") {
    filters.enabled = enabled === "true";
  }

  const devices = await deviceService.listDevices(filters);

  sendSuccess(res, 200, devices, { count: devices.length});
}
export async function getDeviceById(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new ValidationError("id parametresi eksik");
  }

  const device = await deviceService.getDeviceById(id);

  sendSuccess(res, 200, device);
}
export async function replaceDevice(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new ValidationError("id parametresi eksik");
  }

  const input = req.body as UpdateDeviceInput;

  const device = await deviceService.replaceDevice(id, input);

  sendSuccess(res, 200, device);
}
export async function updateDevice(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new ValidationError("id parametresi eksik");
  }

  const input = req.body as PatchDeviceInput;

  if (Object.keys(input).length === 0) {
    throw new ValidationError("Güncellenecek en az bir alan gönderilmelidir");
  }

  const device = await deviceService.updateDevice(id, input);

  sendSuccess(res, 200, device);
}
export async function deleteDevice(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new ValidationError("id parametresi eksik");
  }

  await deviceService.deleteDevice(id);

  res.status(204).end();
}
export async function bulkCreateDevices(req: Request, res: Response): Promise<void> {
  const { devices } = req.body as { devices: CreateDeviceInput[] };

  const created = await deviceService.createManyDevices(devices);

    sendSuccess(res, 201, created, { count: created.length });
}