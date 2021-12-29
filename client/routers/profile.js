const express = require("express");
const upload = require('../helpers/multer')
const { userEdit, getUserArticles, getReadingList, postNewArticle, newComment } = require("../controllers/profile");

const router = express.Router();

router.get("/settings",async(req,res,next) => {
    res.render("settings",{
        req:req,
        err : null
    })
})

router.post("/edit",upload.single('profile-image'),userEdit)

router.get("/",getUserArticles)


router.get("/reading-list",getReadingList)

router.get("/new-article",async(req,res,next) => {
    res.render("new-article",{
        req:req,
        err:null
    })
})

router.post("/new-article",upload.single('article-image'),postNewArticle)


router.post("/new-comment/:id",newComment)

module.exports = router;