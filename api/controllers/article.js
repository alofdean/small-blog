const Article = require("../models/article");
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

module.exports = {
    createNewArticle
};