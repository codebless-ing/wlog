import express from "express";
import ArticleController from "@controllers/article.controller.js";

const router = express.Router();

const controller = new ArticleController();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.read);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
