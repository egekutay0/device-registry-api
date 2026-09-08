import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors.js";

function isJsonParseError(error: unknown): boolean {
  return (
    error instanceof SyntaxError &&
    "type" in error &&
    (error as { type?: unknown }).type === "entity.parse.failed"
  );
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isJsonParseError(error)) {
    res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "İstek gövdesi geçerli bir JSON değil",
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  console.error("Beklenmeyen hata:", error);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Sunucuda beklenmeyen bir hata oluştu",
    },
  });
};