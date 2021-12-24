
const express = require('express');
const comment = require('./comment')
const { createNewArticle, likeArticle, undoLikeArticle, getAllArticle, getSingleArticle, editArticle, deleteArticle,imageUpload, addList, removeFromList } = require('../controllers/article');
const { getAccessToRoute,getArticleOwnerAccess} = require('../middlewares/authorization/auth');
const {checkArticleExist} = require('../middlewares/database/existHelpers');
const articleImageUpload = require("../middlewares/libraries/articleImageUpload");
const articleQueryMiddleware = require('../middlewares/query/articleQueryMiddleware');
const Article = require('../models/Article');
const router = express.Router();

router.post("/create",getAccessToRoute,createNewArticle);
router.post("/:id/upload",[getAccessToRoute,checkArticleExist,articleImageUpload.single("article_image")],imageUpload);
router.get("/",articleQueryMiddleware(
    Article,
    {
        population: {
            path : "user",
            select : "name profile_image"
        }
    }),getAllArticle);
router.get("/:id/like",[getAccessToRoute,checkArticleExist],likeArticle);
router.get("/:id/undo_like",[getAccessToRoute,checkArticleExist],undoLikeArticle);
router.get("/:id/add",[getAccessToRoute,checkArticleExist],addList);
router.get("/:id/remove",[getAccessToRoute,checkArticleExist],removeFromList);
router.get("/:slug",checkArticleExist,getSingleArticle);
router.put("/:id/edit",[getAccessToRoute,checkArticleExist,getArticleOwnerAccess],editArticle);
router.delete("/:id/delete",[getAccessToRoute,checkArticleExist,getArticleOwnerAccess],deleteArticle);
 
router.use("/:id/comment",checkArticleExist,comment);
module.exports = router;