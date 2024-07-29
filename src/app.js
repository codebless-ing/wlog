import express from "express";

import config from "./config.js";
import { connectToDatabase } from "@models/index.js";
import { errorHandler, xhrErrorHandler, logErrors } from "@middlewares/errorHandler.js";
import { consoleLogger } from "@common/utils/logger.js";

import routes from '@routes/index.js';

/* Model */
await connectToDatabase(
  config.db.uri,
  config.db.user,
  config.db.pass,
  config.db.database
)

/* HTTP */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.statusCode = 404;
  next(error);
});

app.use(logErrors)
app.use(xhrErrorHandler)
app.use(errorHandler)

// Spin up the HTTP server
app.listen(config.app.port, async () => {
  consoleLogger.info(`App listening on port ${config.app.port}`);
})