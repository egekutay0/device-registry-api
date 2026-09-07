import { Router } from "express";
import { createDevice, listDevices } from "../controllers/device.controller.js";

const deviceRouter = Router();

deviceRouter.post("/", createDevice);
deviceRouter.get("/", listDevices);

export { deviceRouter };