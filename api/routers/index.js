const express = require('express');
const auth = require('./auth');
const user = require('./user');
const admin = require('./admin');
const article = require('./article');
const router = express.Router();


router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);
router.use("/article",article);


module.exports = router;
