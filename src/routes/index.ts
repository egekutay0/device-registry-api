import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { deviceRouter } from "./device.routes.js";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/devices", deviceRouter);

export { apiRouter };