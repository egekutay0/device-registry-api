import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/errors.js";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new NotFoundError(`Böyle bir endpoint yok: ${req.method} ${req.originalUrl}`));
}