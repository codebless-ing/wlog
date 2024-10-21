import express from "express";

import articleRoutes from "@routes/article.js";

const router = express.Router();

router.use("/article", articleRoutes);

export default router;
