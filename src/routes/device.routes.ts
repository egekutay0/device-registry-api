import { Router } from "express";
import {
  createDevice,
  listDevices,
  getDeviceById,
  replaceDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/device.controller.js";

const deviceRouter = Router();

deviceRouter.post("/", createDevice);
deviceRouter.get("/", listDevices);
deviceRouter.get("/:id", getDeviceById);
deviceRouter.put("/:id", replaceDevice);
deviceRouter.patch("/:id", updateDevice);
deviceRouter.delete("/:id", deleteDevice);

export { deviceRouter };