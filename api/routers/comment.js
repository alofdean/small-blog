const express = require('express');
const { addNewCommentToArticle, getAllCommentsByArticle } = require('../controllers/comment');
const {getAccessToRoute, getAnswerOwnerAccess} = require('../middlewares/authorization/auth');
const { checkCommentExist } = require('../middlewares/database/existHelpers');
const router = express.Router(
    {mergeParams:true}
);

router.post("/", getAccessToRoute,addNewCommentToArticle);
router.get("/",getAllCommentsByArticle);

module.exports = router;
