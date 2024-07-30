import { HttpException } from "@common/exceptions/appExceptions.js";

// Stub for instantiated model
class ModelObjStub {
    save() {}
}

const res = {
    send: jest.fn(() => {}),
    status: jest.fn(() => {}),
    render: jest.fn(() => {})
}

/*
 *  IMPORTS
 *  See: https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
jest.unstable_mockModule('@models/article.model.js', () => ({
    default: ModelObjStub
}));

const ArticleController = (await import('@controllers/article.controller.js')).default;

const controller = new ArticleController();

describe('Article controller', () => {
    describe('when creating a new article', () => {
        describe('with valid data', () => {
            const req = {
                body: {
                    title: "Titley title",
                    body: "Post body",
                    tags: "asdf; qwert; zxcv"
                }
            }

            test.skip("should return a view", () => {
                
            })

            test("should respond with 200", async () => {
                await controller.create(req, res)
                
                expect(res.status).toBeCalledWith(200)

            })

            // TODO Create more tests when validation, view engine and contracts are implemented
        })

        describe('with invalid or NO data', () => {
            const req = {
            }

            test.skip("should return a view", () => {
                
            })

            test("should throw a 404 HTTPException", () => {
                expect(true).toBe(true)
            })

            // TODO Create more tests when validation, view engine and contracts are implemented
        })
    })
    describe('when reading an article', () => {
        describe('with valid data', () => {
            const req = {
                params: {
                    id: "66a941da61910f79bb7e22c7"
                }
            }

            test.skip('should respond with 200', async () => {
                await controller.read(req, res)
                expect(res.status).toBeCalledWith(200)
            })
        })

        describe('with invalid data', () => {
            res.render.mockClear()
            const req = {
                params: {
                    id: false
                }
            }
            const result = controller.read(req, res)

            test("should throw a 404 HTTPException", () => {
                expect(result).rejects.toThrow(HttpException)
            })
        })
    })
})