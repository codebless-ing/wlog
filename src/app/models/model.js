import { Schema, mongoose } from "mongoose";
import { ModelException } from "@common/exceptions/appExceptions.js";
import { newLogger } from "@common/utils/logger.js";
const logger = newLogger("Model|BaseModel");

// This class and all its children are instantiated as a promise
export default class BaseModel {
    #model; // Mongoose Model class      see: https://mongoosejs.com/docs/models.html
    #doc; // Mongoose Document class     see: https://mongoosejs.com/docs/documents.html

    constructor(id) {
        // Immediately Invoked Async Function Expression ;)
        return (async () => {
            // Throw an exception for models without schema
            if (!(this.constructor.SCHEMA instanceof Schema)) {
                throw new ModelException({ message: `Model "${this.constructor.name}" must have a valid schema` });
            }

            // Create and store the Mongoose model for this collection
            this.#model = mongoose.model(this.constructor.name, this.constructor.SCHEMA);

            // Existing document
            if (id) {
                if (mongoose.isValidObjectId(id)) {
                    // Don't try to find if it's not even a validObjectId
                    this.#doc = await this.#model.findById(id);
                }

                // Copy the properties from the Mongoose doc to the model object
                if (this.#doc) {
                    for (let k in this.#doc._doc) {
                        this[k] = this.#doc._doc[k];
                    }

                    return this;
                }

                logger.info("Document not found. Creating a new one.");
            }

            // New document
            this.#doc = new this.#model();

            return this;
        })().catch((err) => {
            logger.error(err);
            throw new ModelException({ message: err });
        });
    }

    async save() {
        // Copy the model object properties back to Moongose doc
        for (let k in this) {
            this.#doc[k] = this[k];
        }

        await this.#doc.save();
        this._id = this.#doc._id;
    }

    async delete() {
        await this.#doc.deleteOne();
        for (let k in this) {
            delete this[k];
        }
        this.#doc = this.#model = null;
    }

    async find(filter) {
        return await this.#model.find(filter);
    }

    // Returns all distinct data in the specified field and returns in an array
    async distinct(field) {
        return await this.#model.distinct(field);
    }
}
