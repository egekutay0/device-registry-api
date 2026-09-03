import type { Request, Response } from "express";
import { config } from "../config/env.js";

export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
    environment: config.appEnv,
    timestamp: new Date().toISOString(),
  });
}