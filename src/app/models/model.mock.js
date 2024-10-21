import { Types } from "mongoose";

// Facade
const ModelMock = {};

/*
 *  STUBS
 */
ModelMock.collection = {};

/*
 * MONGOOSE_MODEL CLASS
 */
ModelMock.GooseModel = class {
    findById = jest.fn(async (id) => {
        if (id) {
            return ModelMock.collection[id];
        }

        return {};
    });
};

/*
 * MODEL OBJECT
 */
ModelMock.object = {
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
};

/*
 * MODEL CLASS
 */
ModelMock.Class = jest.fn(async (id) => {
    // All models have an async constructor
    const _model = new ModelMock.GooseModel();
    const _doc = await _model.findById(id);

    for (let k in _doc) {
        ModelMock.object[k] = _doc[k];
    }

    return ModelMock.object;
});

/*
 * HELPERS
 */
ModelMock.clearModelObject = (clearSpies = true) => {
    if (clearSpies) {
        ModelMock.object = {
            save: jest.fn(() => {
                ModelMock.object._id = ModelMock.object._id ? ModelMock.object._id : new Types.ObjectId();
                ModelMock.addDocToCollection(ModelMock.object._id, ModelMock.object);
            }),

            delete: (deleteSpy = jest.fn(() => {
                if (ModelMock.collection[ModelMock.object._id]) {
                    delete ModelMock.collection[ModelMock.object._id];
                }

                // When deleting a doc, clears the model's properties but keep the state of the spies
                ModelMock.clearModelObject(false);
            })),

            find: jest.fn(async (query) => {
                return Object.values(ModelMock.collection);
            }),
        };
    } else {
        ModelMock.object = {
            save: ModelMock.object.save,
            delete: ModelMock.object.delete,
        };
    }

    return ModelMock;
};

ModelMock.addDocToCollection = (id, doc) => {
    if (typeof id == "undefined") {
        throw "An ID must be given";
    }

    if (typeof doc !== "object") {
        throw "Doc must be an object";
    }

    ModelMock.collection[id] = doc;
    ModelMock.collection[id]._id = id;

    return ModelMock;
};

ModelMock.clearCollection = (id, doc) => {
    ModelMock.collection = {};

    return ModelMock;
};

ModelMock.clearModelObject();

/*
 *  IMPORTS
 *  See: https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
jest.unstable_mockModule("@models/model.js", () => ({
    default: ModelMock.Class,
}));

const mongoose = (await import("mongoose")).default;
mongoose.model = jest.fn(() => ModelMock.GooseModel);

export default ModelMock;
