const Article = require('../models/Article');
const Comment = require('../models/Comment');
const User = require('../models/User');
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const addNewCommentToArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    const user_id = req.user.id;
    const information = req.body;

    const comment = await Comment.create({
        ...information,
        article : articleId,
        user : user_id
    });
    
    const article = await Article.findById(articleId);
    article.comments.push(comment._id);
    await article.save();

    
    return res.status(200)
    .json({
        success: true,
        data: comment
    });
});

const getAllCommentsByArticle = asyncErrorHandler(async (req, res, next) => {
    return res.status(200)
    .json(res.queryResults);
});

const getSingleComment = asyncErrorHandler(async (req, res, next) => {
    const commentId = req.params.comment_id;

    const comment = await Comment.findById(commentId).populate("user");
    
    
    return res.status(200)
    .json({
        success: true,
        data: comment
    });
});


const deleteComment = asyncErrorHandler(async (req, res, next) => {
    const commentId= req.params.comment_id;
    const articleId= req.params.id;
    
    
    await Comment.findByIdAndRemove(commentId);
    const article = await Article.findById(articleId);

    article.comments.splice(article.comments.indexOf(commentId),1);
    
    await article.save();
    

    return res.status(200)
    .json({
        success: true,
        message : "comment deleted"
    });
});


module.exports = {
    addNewCommentToArticle,
    getAllCommentsByArticle,
    getSingleComment,
    deleteComment
}