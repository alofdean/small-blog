const express = require('express');
const { getArticle, likeArticle, unlikeArticle, deleteArticle, addList, removeFromList, editArticle,showEditPage } = require('../controllers/articles');
const { getLoggedInUser, getAuth } = require('../middlewares/authorization/auth');
const upload = require('../helpers/multer')

const router = express.Router();

router.get("/:slug",getArticle)
router.get("/:id/like",likeArticle)
router.get("/:id/add",addList)
router.get("/:id/remove",removeFromList)
router.get("/:id/unlike",unlikeArticle)
router.get("/:id/delete",deleteArticle)

router.get("/:slug/edit",getAuth,showEditPage)

router.post("/:id/edit",upload.single('article-image'),editArticle)
module.exports = router;