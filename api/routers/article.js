
const express = require('express');
const comment = require('./comment')
const { createNewArticle, likeArticle, undoLikeArticle, getAllArticle, getSingleArticle, editArticle, deleteArticle } = require('../controllers/article');
const { getAccessToRoute,getArticleOwnerAccess} = require('../middlewares/authorization/auth');
const {checkArticleExist} = require('../middlewares/database/existHelpers');
const router = express.Router();

router.post("/create",getAccessToRoute,createNewArticle);
router.get("/",getAllArticle);
router.get("/:id/like",[getAccessToRoute,checkArticleExist],likeArticle);
router.get("/:id/undo_like",[getAccessToRoute,checkArticleExist],undoLikeArticle);
router.get("/:id",checkArticleExist,getSingleArticle);
router.put("/:id/edit",[getAccessToRoute,checkArticleExist,getArticleOwnerAccess],editArticle);
router.delete("/:id/delete",[getAccessToRoute,checkArticleExist,getArticleOwnerAccess],deleteArticle);
 
router.use("/:id/comment",checkArticleExist,comment);
module.exports = router;