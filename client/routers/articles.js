const express = require('express');
const { getArticle, likeArticle, unlikeArticle, deleteArticle, addList, removeFromList, editArticle,showEditPage } = require('../controllers/articles');
const {  getAuth } = require('../middlewares/authorization/auth');
const upload = require('../helpers/multer')

const router = express.Router();

router.get("/:slug",getArticle)
router.get("/:id/like",getAuth,likeArticle)
router.get("/:id/add",getAuth,addList)
router.get("/:id/remove",getAuth,removeFromList)
router.get("/:id/unlike",getAuth,unlikeArticle)
router.get("/:id/delete",getAuth,deleteArticle)
router.get("/:slug/edit",getAuth,showEditPage)
router.post("/:id/edit",[getAuth,upload.single('article-image')],editArticle)

module.exports = router;