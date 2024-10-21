import Joi from "joi";
import { BaseOutputDto } from "../dto.js";

class ListArticleInputDto {
    static SCHEMA = Joi.object({
        title: Joi.string().allow(""),
        tags: Joi.array().items(Joi.string().allow("")),
    }).options({ abortEarly: false });

    constructor(data) {
        data = Joi.attempt(data, this.constructor.SCHEMA);

        this.title = data.title;
        this.tags = data.tags;
    }
}

class ListArticleOutputDto extends BaseOutputDto {
    data = [];

    constructor(articles, success = true, info) {
        super(success, info);

        for (let k in articles) {
            this.data[k] = {
                _id: articles[k]._id,
                title: articles[k].title,
                body: articles[k].body,
                tags: articles[k].tags,
            };
        }
    }
}

export { ListArticleInputDto, ListArticleOutputDto };
