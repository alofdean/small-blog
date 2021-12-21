const Article = require("../models/Article");
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const createNewArticle = asyncErrorHandler(async (req, res, next) => {
    const information = req.body;

    const article = await Article.create({
        ...information, // information.title, information.content
        user: req.user.id
    });
    res
    .status(200)
    .json({
        success: true,
        data: article
    });

});

const likeArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const article = await Article.findById(articleId);
    
    if (article.likes.includes(req.user.id)) {
        return next(new CustomError("You already like this article",400));
    }

    article.likes.push(req.user.id)
    await article.save();

    return res.status(200)
    .json({
        success: true,
        data: article
    });

});

module.exports = {
    createNewArticle,
    likeArticle
};