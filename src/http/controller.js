import Joi from "joi";
const ValidationError = Joi.ValidationError;

import { newLogger } from "@common/utils/logger.js";
const logger = newLogger("Controller|BaseController");

import { HttpException } from "@common/exceptions/appExceptions.js";

class BaseController {
    reportBadData(error, req, res) {
        if (!(error instanceof ValidationError)) {
            throw error;
        }

        // Softly check if res is a response object
        if (typeof res == "undefined" || typeof res.app == "undefined" || typeof res.locals == "undefined") {
            throw new HttpException(500, "Response is required for reporting a Validation Error");
        }

        // Softly check if req is a request object
        if (typeof req == "undefined" || typeof req.app == "undefined" || typeof req.method == "undefined") {
            throw new HttpException(500, "Request is required for reporting a Validation Error");
        }

        // Copy the validation errors, if any, to the list of flash messages
        if (Array.isArray(error.details)) {
            const validation = [];

            for (const d of error.details) {
                validation.push({
                    message: d.message,
                    layer: "validation",
                    type: "info"
                })
            }

            req.flash('validation', validation);
        }

        if (req.body) {
            const content = {};

            for (const d in req.body) {
                if (d != "tags") {
                    content[d] = req.body[d];
                    continue
                }

                content[d] = req.body[d].join(",");
            }

            req.flash('content', content);
        }

        logger.info("Invalid data (%j): %s", req.body, error);
        return res.status(400);
    }
}

export default BaseController;
