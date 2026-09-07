import type { Request, Response } from "express";
import { DEVICE_TYPES, type CreateDeviceInput, type DeviceType } from "../models/device.js";
import type { DeviceFilters } from "../services/device.service.js";
import { ValidationError } from "../utils/errors.js";
import * as deviceService from "../services/device.service.js";

export async function createDevice(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateDeviceInput;

  const device = await deviceService.createDevice(input);

  res.status(201).json(device);
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

  res.status(200).json(devices);
}