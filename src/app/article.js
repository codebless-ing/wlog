import Article from "@models/article.model.js";
import { CreateArticleOutputDto } from "@common/dto/article/create.dto.js";
import { ReadArticleOutputDto } from "@common/dto/article/read.dto.js";
import { UpdateArticleOutputDto } from "@common/dto/article/update.dto.js";
import { DeleteArticleOutputDto } from "@common/dto/article/delete.dto.js";
import { ListArticleOutputDto } from "@common/dto/article/list.dto.js";
import ArticleRepository from "@repositories/article.repository.js";

const repository = new ArticleRepository();

export default {
    create: async ({ title, body, tags }) => {
        const article = await new Article();

        article.title = title;
        article.body = body;
        article.tags = tags;

        // TODO: user_id and timezone must be included after authentication is implemented
        try {
            await article.save();
        } catch (error) {
            //error.errors.properties.message
            return new CreateArticleOutputDto({}, false, JSON.stringify(error.errors));
        }

        return new CreateArticleOutputDto(article);
    },

    read: async ({ id }) => {
        const article = await new Article(id);

        if (!article._id) {
            return new ReadArticleOutputDto({}, false, "Article not found");
        }

        return new ReadArticleOutputDto(article, true, "Article found");
    },

    // Receives object with id, title, body and tags
    // If id exists: returns object with data (_id, title, body and tags) and a feedback message
    // If id doesn't exist: returns object with data (false) and a feedback message
    update: async ({ id, title, body, tags }) => {
        const article = await new Article(id);

        if (!article._id) {
            return new UpdateArticleOutputDto({}, false, "Article not found");
        }

        article.title = title;
        article.body = body;
        article.tags = tags;

        try {
            await article.save();
        } catch (error) {
            //error.errors.properties.message
            return new CreateArticleOutputDto({}, false, JSON.stringify(error.errors));
        }

        return new UpdateArticleOutputDto(article, true, "Article updated successfully");
    },

    delete: async ({ id }) => {
        const article = await new Article(id);

        if (!article._id) {
            return new DeleteArticleOutputDto({}, false, "Article not found");
        }

        article.delete();

        return new DeleteArticleOutputDto({}, true, "Article deleted successfully");
    },

    list: async ({ title, tags }) => {
        const articles = await repository.filter(title, tags);

        return new ListArticleOutputDto(articles, true, "Articles fetched");
    },

    distinct: async(field) => {
        const result = await new Article();

        return result.distinct(field);
    },
};
