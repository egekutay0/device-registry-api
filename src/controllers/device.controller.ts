import type { Request, Response } from "express";
import type { CreateDeviceInput } from "../models/device.js";
import * as deviceService from "../services/device.service.js";

export async function createDevice(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateDeviceInput;

  const device = await deviceService.createDevice(input);

  res.status(201).json(device);
}