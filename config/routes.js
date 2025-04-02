const express = require('express');
const router = express.Router();
const articleController = require("../controllers/controller");

router.get("/", articleController.homePage);

router.get("/new/article", articleController.renderArticlePage);
router.get("/article/:articleId", articleController.renderDetailsPage);

router.post("/new/article", articleController.addNewArticle);
router.get("/edit/article/:articleId", articleController.editArticlePage);
router.post("/edit/article/:articleId", articleController.editArticleForm);
router.get("/article/delete/:articleId", articleController.deleteArticle);

 


router.get("/", articleController.notFoundPage);

module.exports = router;