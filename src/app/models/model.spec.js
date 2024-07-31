import Model from './model.js';
import { Schema, mongoose } from 'mongoose'

// Mongoose mocking
const mockDeleteOne = jest.fn(() => {})
const mockSave = jest.fn(() => {})
const docStub = {
    _id: "62261a65d66c6be0a63c051f",
    key: "value"
}

class mockModel {
    static findById(id) {
        if (!mongoose.isValidObjectId(id)) {
            throw "Invalid object id"
        }

        if (id == "62261a65d66c6be0a63c051f") {
            return { _doc: docStub, deleteOne: mockDeleteOne, save: mockSave }
        }

        return null
    }
}

mongoose.model = jest.fn(() => mockModel);

describe('Base model layer', () => {
    // CONSTRUCTOR
    describe('when instantiating a new model', () => {
        describe('with SCHEMA property NOT defined', () => {
            const model = new Model()

            test("should throw an exception", () => {
                expect(model).rejects.toThrow()
            })
        })

        describe('with SCHEMA property defined', () => {
            Model.SCHEMA = new Schema({})
            const model = new Model()

            test("should NOT throw an exception", () => {
                expect(model).resolves.not.toThrow()
            })

            describe('WITHOUT id or with a non existing id', () => {
                const noIDModel = new Model();
                const validNoExistingIDModel = new Model("507f191e810c19729de860ea");
                const invalidIDModel = new Model("invalidId");

                test("should return a new model", () => {
                    expect(model).resolves.toBeInstanceOf(Model);
                    expect(noIDModel).resolves.toEqual({});
                    expect(validNoExistingIDModel).resolves.toEqual({});
                    expect(invalidIDModel).resolves.toEqual({});
                })
            })

            describe('with a valid id', () => {
                const model = new Model("62261a65d66c6be0a63c051f")

                test("should get a copy of the values", () => {
                    expect(model).resolves.toMatchObject(docStub)
                })
            })
        })
    })

    // DELETE
    describe('when calling delete()', () => {
        mockDeleteOne.mockClear()
        let model = new Model("62261a65d66c6be0a63c051f")

        test("should clear itself", async () => {
            model = await model
            await model.delete()
            expect(model).toEqual({})
        })

        test("should delete the data from db", () => {
            expect(mockDeleteOne).toHaveBeenCalled();
        })
    })

    // SAVE
    describe('when calling save()', () => {
        mockSave.mockClear()
        let model = new Model("62261a65d66c6be0a63c051f")

        test("should save the data in db", async () => {
            model = await model
            await model.save()

            expect(mockSave).toHaveBeenCalled();
        })
    })
})
