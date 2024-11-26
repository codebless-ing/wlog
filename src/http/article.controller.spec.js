import { CreateArticleInputDto } from "@common/dto/article/create.dto.js";
import { ReadArticleInputDto } from "@common/dto/article/read.dto.js";
import { UpdateArticleInputDto } from "@common/dto/article/update.dto.js";
import { DeleteArticleInputDto } from "@common/dto/article/delete.dto.js";
import { ListArticleInputDto } from "@common/dto/article/list.dto.js";
import { HttpException } from "@common/exceptions/appExceptions.js";
import { routes } from "reversical";

const ModelMock = (await import("@models/model.mock.js")).default;
const controller = new (await import("@controllers/article.controller.js")).default();
const service = (await import("@services/article.js")).default;

/*
 * RESPONSE STUB
 */
const res = {
    send: jest.fn(() => res),
    status: jest.fn(() => res),
    render: jest.fn(() => res),
    redirect: jest.fn(() => res),
};

routes.articleRead = jest.fn((data) => `fictional/path/${data.id}`);

/*
 * SERVICE SPIES
 */
const spies = {
    create: jest.spyOn(service, "create"),
    read: jest.spyOn(service, "read"),
    update: jest.spyOn(service, "update"),
    delete: jest.spyOn(service, "delete"),
    list: jest.spyOn(service, "list"),
};

afterEach(() => {
    res.status.mockClear();
    res.render.mockClear();
    ModelMock.clearModelObject().clearCollection();

    for (const k in spies) {
        if (Object.prototype.hasOwnProperty.call(spies, k)) {
            spies[k].mockClear();
        }
    }
});

describe("Article controller", () => {
    // CREATE
    describe("when creating a new article", () => {
        describe("with valid data", () => {
            let req = {};

            beforeEach(() => {
                req = {
                    body: {
                        title: "Titley title",
                        body: "Post body",
                        tags: ["asdf", "qwert", "zxcv"],
                    },
                };

                routes.articleRead.mockClear();
                res.redirect.mockClear();
            });

            test.skip("should return a view", () => {});

            test("should communicate with service layer through the use of dto", async () => {
                await controller.create(req, res);
                expect(spies.create).toBeCalledWith(expect.any(CreateArticleInputDto));
            });

            test("should redirect", async () => {
                // Make sure there are no article saved before the operation
                expect(ModelMock.collection).toMatchObject({});

                await controller.create(req, res);
                const savedArticle = Object.values(ModelMock.collection)[0];

                // Expect the articleRead path to be generated during the execution
                expect(routes.articleRead).toBeCalledWith({ id: savedArticle._id.toString() });
                expect(res.redirect).toBeCalledWith(routes.articleRead({ id: savedArticle._id.toString() }));
            });

            // TODO Create more tests when validation, view engine and contracts are implemented
        });

        describe("with invalid or NO data", () => {
            let empty = { body: {} };
            let invalid = { body: {} };

            beforeEach(() => {
                invalid.body = { title: 3, tags: "" };
            });

            test("should throw a 400 HTTPException", () => {
                expect(controller.create(invalid, res)).rejects.toThrow(HttpException);
                expect(controller.create(empty, res)).rejects.toThrow(HttpException);
            });

            // TODO Create more tests when validation, view engine and contracts are implemented
        });
    });

    // READ
    describe("when reading an article", () => {
        describe("with valid data", () => {
            const req = {
                params: {
                    id: "66a941da61910f79bb7e22c7",
                },
            };

            test("should communicate with service layer through the use of dto", async () => {
                ModelMock.addDocToCollection("66a941da61910f79bb7e22c7", {});

                await controller.read(req, res);
                expect(spies.read).toBeCalledWith(expect.any(ReadArticleInputDto));
            });

            test("should respond with 200", async () => {
                ModelMock.addDocToCollection("66a941da61910f79bb7e22c7", {});

                await controller.read(req, res);
                expect(res.status).toBeCalledWith(200);
            });
        });

        describe("with invalid data", () => {
            const req = {
                params: {
                    id: false,
                },
            };

            test("should throw a 404 HTTPException", () => {
                expect(controller.read(req, res)).rejects.toThrow(HttpException);
            });
        });
    });

    // UPDATE
    describe("when updating an article", () => {
        describe("with valid data", () => {
            let req = {};

            beforeEach(() => {
                req = {
                    params: {
                        id: "66a941da61910f79bb7e22c7",
                    },
                    body: {
                        title: "Big titley",
                        body: "Bodey",
                        tags: ["uiop", "jklc"],
                    },
                };
                ModelMock.addDocToCollection(req.params.id, { title: "a", body: "b" });
            });

            test("should communicate with service layer through the use of dto", async () => {
                await controller.update(req, res);
                expect(spies.update).toBeCalledWith(expect.any(UpdateArticleInputDto));
            });

            test("should respond with 200", async () => {
                await controller.update(req, res);

                expect(res.status).toBeCalledWith(200);
            });
        });

        describe("with invalid data", () => {
            const req = {
                params: {
                    id: false,
                },
            };

            test("should throw a 404 HTTPException", () => {
                expect(controller.update(req, res)).rejects.toThrow(HttpException);
            });
        });
    });

    // DELETE
    describe("when deleting an article", () => {
        describe("with valid data", () => {
            let req = {};

            beforeEach(() => {
                req = {
                    params: {
                        id: "66a941da61910f79bb7e22c7",
                    },
                };
                ModelMock.addDocToCollection(req.params.id, {});
            });

            test("should communicate with service layer through the use of dto", async () => {
                await controller.delete(req, res);
                expect(spies.delete).toBeCalledWith(expect.any(DeleteArticleInputDto));
            });

            test("should respond with 200", async () => {
                await controller.delete(req, res);

                expect(res.status).toBeCalledWith(200);
            });
        });

        describe("with invalid data", () => {
            const req = {
                params: {
                    id: false,
                },
            };

            test("should throw a 404 HTTPException", () => {
                expect(controller.delete(req, res)).rejects.toThrow(HttpException);
            });
        });
    });

    // LIST
    describe("when listing articles", () => {
        let req = {};

        beforeEach(() => {
            req.query = {
                title: "magic",
                tags: "key,word",
            };
        });

        test("should communicate with service layer through the use of dto", async () => {
            await controller.list(req, res);
            expect(spies.list).toBeCalledWith(expect.any(ListArticleInputDto));
        });

        test("should respond with 200", async () => {
            await controller.list(req, res);
            expect(res.status).toBeCalledWith(200);
        });
    });
});
