const request = (await import("supertest")).default;
const ModelMock = (await import("@models/model.mock.js")).default;
const ArticleRoute = (await import("@routes/article.js")).default;

const app = (await import("../app.mock.js")).default;
import "express-async-errors";

afterEach(() => {
    ModelMock.clearModelObject().clearCollection();
});

describe("Article Controller", () => {
    // CREATE
    describe("when creating an article", () => {
        describe("receiving appropriate data", () => {
            test("should return a page with 200", (done) => {
                const res = request(app)
                    .post("/article")
                    .type("form")
                    .send({
                        title: "Titley title",
                        body: "Post body",
                        tags: ["asdf", "qwert", "zxcv"],
                    });

                res.expect(302, done);
            });
        });

        describe.skip("when receiving no data", () => {
            test("should return a page with 400", (done) => {
                const res = request(app).post("/article");

                res.expect("Content-Type", /html/).expect(400, done);
            });
        });

        describe.skip("when receiving invalid data", () => {
            test("should return a page with 400", (done) => {
                const res = request(app).post("/article").send({ title: "h" });

                res.expect("Content-Type", /html/).expect(400, done);
            });
        });
    });

    // READ
    describe("when getting an article", () => {
        describe("receiving a valid id", () => {
            beforeEach(() => {
                ModelMock.addDocToCollection("SuperCoolIdColonCapitalDee", {
                    title: "Super interesting article (:",
                    body: "Super-duper uber computer ruler o' Vancouver",
                    tags: ["tag", "you're it!"],
                });
            });

            test("should return a page with 200", (done) => {
                const res = request(app).get("/article/SuperCoolIdColonCapitalDee").send();

                res.expect("content-type", /html/).expect(200, done);
            });
        });

        describe("when receiving a non-existent id", () => {
            test("should return a page with 404", (done) => {
                const res = request(app).get("/article/NotSoCoolId").send();

                res.expect("Content-Type", /html/).expect(404, done);
            });
        });
    });

    // UPDATE
    describe("when updating an article", () => {
        beforeEach(() => {
            ModelMock.addDocToCollection("601060106010601060106010", {
                title: "How to exist",
                body: "Step 1: Be born. \n There you are, you're done!",
                tags: ["tutorial"],
            });
        });

        describe("receiving a valid id", () => {
            test("should return a page with 200", (done) => {
                const res = request(app)
                    .put("/article/601060106010601060106010")
                    .type("form")
                    .send({
                        title: "New title",
                        body: "New body",
                        tags: ["New tag"],
                    });

                res.expect("content-type", /html/).expect(200, done);
            });
        });

        describe("receiving invalid data", () => {
            test.skip("should return a page with 400", (done) => {
                // TODO: This one depends on a view being returned with 400
                const res = request(app).put("/article/6010").type("form").send({
                    title: "",
                    tags: 1,
                });

                res.expect("Content-Type", /html/).expect(400, done);
            });
        });

        describe("receiving a non-existent id", () => {
            test("should return a page with 404", (done) => {
                const res = request(app)
                    .put("/article/070907090709070907090709")
                    .type("form")
                    .send({
                        title: "My experiences with marketing my game",
                        body: "Basically, I just put 'featuring AsbelianKeys' on the cover and we were sold out of physical (and digital) medias in 9 hours.",
                        tags: ["gamedev", "marketing"],
                    });

                res.expect("Content-Type", /html/).expect(404, done);
            });
        });
    });

    describe("when deleting an article", () => {
        beforeEach(() => {
            ModelMock.addDocToCollection("6010", {});
        });

        describe("receiving a valid id", () => {
            test("should return a page with 200", (done) => {
                const res = request(app).delete("/article/6010").send();

                res.expect("Content-Type", /html/).expect(200, done);
            });
        });

        describe("receiving a non-existent id", () => {
            test("should return a page with 404", (done) => {
                const res = request(app).delete("/article/0709").send();

                res.expect("Content-Type", /html/).expect(404, done);
            });
        });
    });

    // LIST
    describe("when listing articles", () => {
        test("should return a page with 200", (done) => {
            const res = request(app).get("/article/").send();

            res.expect("content-type", /html/).expect(200, done);
        });
    });
});
