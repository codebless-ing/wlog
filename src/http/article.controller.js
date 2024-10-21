import { CreateArticleInputDto } from "@common/dto/article/create.dto.js";
import { ReadArticleInputDto } from "@common/dto/article/read.dto.js";
import { UpdateArticleInputDto } from "@common/dto/article/update.dto.js";
import { DeleteArticleInputDto } from "@common/dto/article/delete.dto.js";
import { ListArticleInputDto } from "@common/dto/article/list.dto.js";
import { HttpException } from "@common/exceptions/appExceptions.js";

import BaseController from "@controllers/controller.js";
import service from "@services/article.js";

class ArticleController extends BaseController {
    create = async (req, res) => {
        try {
            const dto = new CreateArticleInputDto(req.body);
            const result = await service.create(dto);

            if (!result.success) {
                throw new HttpException(400, result.info);
            }

            return res.status(200).send(`Article [${result._id}] created successfully!`);
        } catch (error) {
            this.reportBadData(error, req.body);
        }
    };

    read = async (req, res) => {
        try {
            const dto = new ReadArticleInputDto({ id: req.params.id });
            const result = await service.read(dto);

            if (!result.success) {
                throw new HttpException(404, result.info);
            }

            return res.status(200).render("article/index", result.data);
        } catch (error) {
            this.reportBadData(error, req.body);
        }
    };

    update = async (req, res) => {
        try {
            const dto = new UpdateArticleInputDto({ id: req.params.id, ...req.body });
            const result = await service.update(dto);

            if (!result.success) {
                throw new HttpException(404, result.info);
            }

            return res
                .status(200)
                .render("article/index", { title: result.title, body: result.body, tags: result.tags });
        } catch (error) {
            this.reportBadData(error, req.body);
        }
    };

    delete = async (req, res) => {
        try {
            const dto = new DeleteArticleInputDto({ id: req.params.id });
            const result = await service.delete(dto);

            if (!result.success) {
                throw new HttpException(404, result.info);
            }

            return res.status(200).render("article/index", { title: result.info });
        } catch (error) {
            this.reportBadData(error, req.body);
        }
    };

    list = async (req, res) => {
        try {
            if (req.query.tags) {
                req.query.tags = req.query.tags.split(",");
            } else {
                req.query.tags = [];
            }

            const dto = new ListArticleInputDto(req.query);
            const result = await service.list(dto);

            return res.status(200).render("article/list", { body: result.data });
        } catch (error) {
            this.reportBadData(error, req.body);
        }
    };
}

export default ArticleController;
