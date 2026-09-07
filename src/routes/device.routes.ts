import { Router } from "express";
import {
  createDevice,
  listDevices,
  getDeviceById,
  replaceDevice,
} from "../controllers/device.controller.js";

const deviceRouter = Router();

deviceRouter.post("/", createDevice);
deviceRouter.get("/", listDevices);
deviceRouter.get("/:id", getDeviceById);
deviceRouter.put("/:id", replaceDevice);
export { deviceRouter };
deviceRouter.put("/:id", replaceDevice);