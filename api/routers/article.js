
const express = require('express');
const { createNewArticle } = require('../controllers/article');
const { getAccessToRoute} = require('../middlewares/authorization/auth');
const router = express.Router();

router.post("/create",getAccessToRoute,createNewArticle);


module.exports = router;