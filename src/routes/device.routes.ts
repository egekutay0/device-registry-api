import { Router } from "express";
import { createDevice } from "../controllers/device.controller.js";

const deviceRouter = Router();

deviceRouter.post("/", createDevice);

export { deviceRouter };