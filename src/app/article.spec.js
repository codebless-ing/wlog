import { BaseOutputDto } from "@common/dto/dto.js";

const ModelMock = (await import("@models/model.mock.js")).default;

const ArticleModel = (await import("@models/article.model.js")).default;
const ArticleService = (await import("./article.js")).default;

afterEach(() => {
    ArticleModel.mockClear();
    ModelMock.clearModelObject().clearCollection();
});

describe("Article Service", () => {
    // CREATE
    describe("when creating a new article", () => {
        describe("with valid data", () => {
            let validData = {};

            beforeEach(() => {
                validData = {
                    title: "Valid title",
                    body: "Valid body",
                    tags: ["Tag 1", "200"],
                    // TODO: properties below must be tested after authentication is implemented
                    // user_id: "66a592332b7a5264ab6ebfed",
                    // timezone: "-500"
                };
            });

            test("should have an Article Model with said data", async () => {
                await ArticleService.create(validData);
                expect(ArticleModel).toHaveBeenCalledTimes(1); // Same as instantiating an object

                expect(ModelMock.object).toMatchObject(validData);
            });

            test("should request the data to be saved through db lib", async () => {
                await ArticleService.create(validData);
                expect(ModelMock.object.save).toHaveBeenCalledTimes(1);
            });

            test("should return data in a standard output dto, with success", () => {
                const result = ArticleService.create(validData);
                expect(result).resolves.toMatchObject({ success: true });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });
    });

    // READ
    describe("when reading an article", () => {
        describe("when given id exists", () => {
            test("should return the article in a standard output dto, with success", () => {
                ModelMock.addDocToCollection(123, {
                    title: "title",
                    body: "body",
                    tags: ["tag1", "tag2"],
                });
                const result = ArticleService.read({ id: "123" });

                expect(result).resolves.toMatchObject({
                    info: ["Article found"],
                    success: true,
                    data: ModelMock.collection[123],
                });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });

        describe("when given id DOES NOT exist", () => {
            test("should return a standard output dto, with success = false", () => {
                const result = ArticleService.read({ id: "321" });

                expect(result).resolves.toMatchObject({
                    info: ["Article not found"],
                    success: false,
                });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });
    });

    // UPDATE
    describe("when updating an article", () => {
        describe("when given id exists", () => {
            const id = "66a941da61910f79bb7e22c7";
            let data = {};

            beforeEach(() => {
                data = {
                    title: "Big titley",
                    body: "Bodey",
                    tags: ["uiop", "jklc"],
                };
                ModelMock.addDocToCollection(id, { title: "a", body: "b" });
            });

            describe("with valid data", () => {
                test("should have an Article Model with said data", async () => {
                    // Make sure the doc is in the collection and that it's different from req
                    const oldModel = await new ArticleModel(id);
                    expect(oldModel).not.toMatchObject(data);

                    await ArticleService.update({ id: id, ...data });
                    expect(ArticleModel).toHaveBeenCalledTimes(2); // Same as instantiating an object

                    expect(ModelMock.object).toMatchObject({ _id: id, ...data });
                });

                test("should request the new data to be saved through db lib", async () => {
                    await ArticleService.update({ id: id, ...data });
                    expect(ModelMock.object.save).toHaveBeenCalledTimes(1);
                });

                // Bonus step, since there's no garantee the db mock behaves like the actual db engine
                test("should update the data", async () => {
                    // Make sure the doc is in the collection and that it's different from params
                    expect(ModelMock.collection[id]).not.toMatchObject(data);

                    await ArticleService.update({ id: id, ...data });

                    expect(ModelMock.collection[id]).toMatchObject(data);
                });

                test("should return data in a standard output dto, with success", () => {
                    const result = ArticleService.update({ id: id, ...data });
                    expect(result).resolves.toMatchObject({ success: true });
                    expect(result).resolves.toBeInstanceOf(BaseOutputDto);
                });
            });
        });

        describe("when given id DOES NOT exist", () => {
            test("should return a standard output dto, with success = false", () => {
                const result = ArticleService.update({ id: "nonexistent id" });

                expect(result).resolves.toMatchObject({
                    info: ["Article not found"],
                    success: false,
                });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });
    });

    // DELETE
    describe("when deleting an article", () => {
        describe("when given id exists", () => {
            const id = "66a941da61910f79bb7e22c7";

            beforeEach(() => {
                ModelMock.addDocToCollection(id, {});
            });

            test("should have an Article Model with said data", async () => {
                await ArticleService.delete({ id: id });
                expect(ArticleModel).toHaveBeenCalledTimes(1);
            });

            test("should request the new data to be deleted through db lib", async () => {
                await ArticleService.delete({ id: id });
                expect(ModelMock.object.delete).toHaveBeenCalledTimes(1);
            });

            test("should delete the data", async () => {
                await ArticleService.delete({ id: id });
                expect(ModelMock.collection[id]).toBeUndefined();
            });

            test("should return data in a standard output dto, with success", () => {
                const result = ArticleService.delete({ id: id });
                expect(result).resolves.toMatchObject({ success: true });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });

        describe("when given id DOES NOT exist", () => {
            const id = "66a941da61910f79bb7e22c7";

            beforeEach(() => {
                ModelMock.addDocToCollection(id, {});
            });

            test("should return a standard output dto, with success = false", () => {
                const result = ArticleService.delete({ id: "0709" });

                expect(result).resolves.toMatchObject({
                    info: ["Article not found"],
                    success: false,
                });
                expect(result).resolves.toBeInstanceOf(BaseOutputDto);
            });
        });
    });

    // LIST
    describe("when listing articles", () => {
        test("should return an array of articles in a standard output dto, with success", () => {
            // Create true articles expecting them to be retrieved by list()
            ModelMock.addDocToCollection(124, {
                title: "vey",
                body: "fi",
                tags: ["dum", "uber"],
            });
            ModelMock.addDocToCollection(125, {
                title: "gib",
                body: "ber",
                tags: [],
            });

            const result = ArticleService.list({ title: "search-text", tags: [] });

            expect(result).resolves.toMatchObject({
                info: ["Articles fetched"],
                success: true,
                data: [ModelMock.collection[124], ModelMock.collection[125]],
            });
            expect(result).resolves.toBeInstanceOf(BaseOutputDto);
        });
    });
});
