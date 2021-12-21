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

    
    return res.status(200)
    .json({
        success: true,
        data: comment
    });
});

const getAllCommentsByArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;

    const comments = await Comment.find({
        article : articleId
    }).populate("user");
    
    
    return res.status(200)
    .json({
        success: true,
        count : comments.length,
        data: comments
    });
});
module.exports = {
    addNewCommentToArticle,
    getAllCommentsByArticle
}