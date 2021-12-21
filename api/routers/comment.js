const express = require('express');
const { addNewCommentToArticle, getAllCommentsByArticle, getSingleComment,deleteComment } = require('../controllers/comment');
const {getAccessToRoute,getCommentOwnerAccess} = require('../middlewares/authorization/auth');
const { checkCommentExist } = require('../middlewares/database/existHelpers');
const router = express.Router(
    {mergeParams:true}
);

router.post("/", getAccessToRoute,addNewCommentToArticle);
router.get("/",getAllCommentsByArticle);
router.get("/:comment_id",checkCommentExist,getSingleComment);
router.delete("/:comment_id/delete",[checkCommentExist,getAccessToRoute,getCommentOwnerAccess],deleteComment);
module.exports = router;
