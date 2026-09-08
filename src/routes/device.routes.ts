import { Router } from "express";
import {
  createDevice,
  listDevices,
  getDeviceById,
  replaceDevice,
  updateDevice,
  deleteDevice,
  bulkCreateDevices,
} from "../controllers/device.controller.js";
import { validateBody } from "../middleware/validate.js";
import {
  createDeviceSchema,
  updateDeviceSchema,
  patchDeviceSchema,
  bulkCreateDeviceSchema,
} from "../validation/device.schema.js";

const deviceRouter = Router();

deviceRouter.post("/", validateBody(createDeviceSchema), createDevice);
deviceRouter.get("/", listDevices);
deviceRouter.get("/:id", getDeviceById);
deviceRouter.put("/:id", validateBody(updateDeviceSchema), replaceDevice);
deviceRouter.patch("/:id", validateBody(patchDeviceSchema), updateDevice);
deviceRouter.delete("/:id", deleteDevice);
deviceRouter.post("/bulk", validateBody(bulkCreateDeviceSchema), bulkCreateDevices);

export { deviceRouter };