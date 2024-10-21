import mongoose from "mongoose";
import { BootException } from "@common/exceptions/coreException.js";
import { newLogger } from "@common/utils/logger.js";
const logger = newLogger("Model|index");

async function connectToDatabase(uri, user, pass, database, options) {
    const defaultOptions = {};

    try {
        mongoose.connect(uri, {
            ...defaultOptions,
            ...options,
            user: user,
            pass: pass,
            dbName: database,
        });

        /* Mongoose events */
        mongoose.connection.on("connected", () => logger.info(`Successfully connected to database "${database}"`));
        mongoose.connection.on("open", () => logger.info("MongoDB open"));
        mongoose.connection.on("disconnected", () => logger.info("MongoDB disconnected"));
        mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));
        mongoose.connection.on("disconnecting", () => logger.info("MongoDB disconnecting"));
        mongoose.connection.on("close", () => {
            throw new BootException("MongoDB connection closed");
        });

        process.on("SIGINT", () => {
            mongoose.connection.close();
        });
    } catch (error) {
        throw new BootException(error);
    }
}

export { connectToDatabase };
