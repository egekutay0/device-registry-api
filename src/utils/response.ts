import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: Record<string, unknown>
): void {
  if (meta === undefined) {
    res.status(statusCode).json({ data });
    return;
  }

  res.status(statusCode).json({ data, meta });
}