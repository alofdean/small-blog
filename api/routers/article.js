
const express = require('express');
const { createNewArticle, likeArticle, undoLikeArticle, getAllArticle, getSingleArticle } = require('../controllers/article');
const { getAccessToRoute} = require('../middlewares/authorization/auth');
const {checkArticleExist} = require('../middlewares/database/existHelpers');
const router = express.Router();

router.post("/create",getAccessToRoute,createNewArticle);
router.get("/",getAllArticle);
router.get("/:id/like",[getAccessToRoute,checkArticleExist],likeArticle);
router.get("/:id/undo_like",[getAccessToRoute,checkArticleExist],undoLikeArticle);
router.get("/:id",checkArticleExist,getSingleArticle);
module.exports = router;