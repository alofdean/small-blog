const Article = require("../models/Article");
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");

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
const imageUpload =  asyncErrorHandler(async (req, res, next) => {
  
    const articlex = await Article.findByIdAndUpdate(req.articleId, {
      "article_image" : req.savedArticleImage
    },{
      new:true,
      runValidators : true
    });
  
    res.status(200)
    .json({
      success: true,
      message: 'image upload successfull',
      data : articlex
    });
  });

const likeArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const article = await Article.findById(articleId);
    
    if (article.likes.includes(req.user.id)) {
        return next(new CustomError("You already like this article",400));
    }

    article.likes.push(req.user.id)
    article.likeCount = article.likes.length;
    await article.save();

    return res.status(200)
    .json({
        success: true,
        data: article
    });

});

const undoLikeArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const article = await Article.findById(articleId);
    
    if (!article.likes.includes(req.user.id)) {
        return next(new CustomError("You can't undo like operation for this question",400));
    }
    const index = article.likes.indexOf(req.user.id);
    article.likes.splice(index,1);
    article.likeCount = article.likes.length;
    await article.save();

    return res.status(200)
    .json({
        success: true,
        data: article
    });
});

const addList = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    if (user.reading_list.includes(articleId)) {
        return next(new CustomError("You already add this article",400));
    }

    user.reading_list.push(articleId)
    await user.save();

    return res.status(200)
    .json({
        success: true,
        data: user
    });

});

const removeFromList = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    if (!user.reading_list.includes(articleId)) {
        return next(new CustomError("You can't remove",400));
    }
    const index = user.reading_list.indexOf(articleId);
    user.reading_list.splice(index,1);
    await user.save();

    return res.status(200)
    .json({
        success: true,
        data: user
    });
});

const getAllArticle = asyncErrorHandler(async (req, res, next) => {
    return res.status(200)
    .json(res.queryResults);
});

const getSingleArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    
    return res.status(200)
    .json({
        success: true,
        data: article
    });
});

const editArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const information = req.body;

    
    const article = await Article.findByIdAndUpdate(articleId,information,{
        new:true,
        runValidators: true
      });


    return res.status(200)
    .json({
        success: true,
        data: article
    });
});

const deleteArticle = asyncErrorHandler(async (req, res, next) => {
    const articleId = req.params.id;
    
    const article = await Article.findById(articleId);
    
    await article.remove();
    return res.status(200)
    .json({
        success: true,
        message : "delete successful"
    });
});


module.exports = {
    createNewArticle,
    likeArticle,
    undoLikeArticle,
    getAllArticle,
    getSingleArticle,
    editArticle,
    deleteArticle,
    imageUpload,
    addList,
    removeFromList
};