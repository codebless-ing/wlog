import Joi from "joi";
import { BaseOutputDto } from "../dto.js";

class CreateArticleInputDto {
    static SCHEMA = Joi.object({
        title: Joi.string().min(3).max(250).required(),
        body: Joi.string().max(500000).required(),
        tags: Joi.array().items(Joi.string().min(2).max(30).pattern(new RegExp("^[A-z0-9 _-]*$")).allow('')),
        // Regex: alphanum + whitespace + underscore + dash
    }).options({ abortEarly: false });

    constructor(data) {
        if (typeof data.tags == "string" && data.tags != '') {
            data.tags = data.tags.split(',');
        } else {
            data.tags = Array.isArray(data.tags) ? data.tags : [];
        }

        data = Joi.attempt(data, this.constructor.SCHEMA);

        this.title = data.title;
        this.body = data.body;
        this.tags = data.tags;
    }
}

class CreateArticleOutputDto extends BaseOutputDto {
    data;

    constructor({ _id, title, body, tags }, success = true, info) {
        super(success, info);

        this.data = {
            _id: _id,
            title: title,
            body: body,
            tags: tags,
        };
    }
}

export { CreateArticleInputDto, CreateArticleOutputDto };
