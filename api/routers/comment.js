const express = require('express');
const Comment = require('../models/Comment');
const { addNewCommentToArticle, getAllCommentsByArticle, getSingleComment,deleteComment } = require('../controllers/comment');
const {getAccessToRoute,getCommentOwnerAccess} = require('../middlewares/authorization/auth');
const { checkCommentExist } = require('../middlewares/database/existHelpers');
const commentQueryMiddleware = require('../middlewares/query/commentQueryMiddleware');
const router = express.Router(
    {mergeParams:true}
);

router.post("/", getAccessToRoute,addNewCommentToArticle);
router.get("/",commentQueryMiddleware(
    Comment,
    {
        population: {
            path : "user",
            select : "name profile_image"
        }
    }),getAllCommentsByArticle);
router.get("/:comment_id",checkCommentExist,getSingleComment);
router.delete("/:comment_id/delete",[checkCommentExist,getAccessToRoute,getCommentOwnerAccess],deleteComment);
module.exports = router;
