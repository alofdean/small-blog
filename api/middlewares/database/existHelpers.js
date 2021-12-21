const User = require("../../models/User");
const Article = require("../../models/Article");
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");

const checkUserExist = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user) {
        return next(new CustomError("There is no such user with that id",400));
    }
    next();

});

const checkArticleExist = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if(!article) {
        return next(new CustomError("There is no such article with that id",400));
    }
    next();

});

module.exports = {
    checkUserExist,
    checkArticleExist
};