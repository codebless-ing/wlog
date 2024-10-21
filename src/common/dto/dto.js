import { newLogger } from "@common/utils/logger.js";

const logger = newLogger("Dto|BaseDto");

/*
 * Properties:
 *      success: <boolean>
 *      info: [<string>]
 */
class BaseOutputDto {
    success;

    constructor(success, info = []) {
        info = Array.isArray(info) ? info : [info];
        let dtoInfo = [];

        // Save only the string values to a temporary array (dtoInfo)
        for (const k in info) {
            if (typeof info[k] !== "string") {
                logger.warn(`Info #${k} (${info[k]}: ${typeof info[k]}) must be a string.`);
            } else {
                dtoInfo.push(info[k]);
            }
        }

        // Check whether any value made it to the temporary array by checking if the first index is defined
        if (typeof dtoInfo[0] == "string") {
            this.info = dtoInfo;
        }

        this.success = Boolean(success);

        return this;
    }
}

export { BaseOutputDto };
