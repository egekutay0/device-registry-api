import express from "express";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };