const express = require("express");
const router = express.Router();
const auth = require("./auth");
const profile = require("./profile");
const articles = require("./articles");
const { getLoggedInUser } = require("../middlewares/authorization/auth");
const { loadHomePage, search } = require("../controllers");

router.get("/",getLoggedInUser,loadHomePage)

router.post("/search",search)

router.use("/articles",getLoggedInUser,articles);

router.use("/auth",getLoggedInUser,auth);

router.use("/profile",getLoggedInUser,profile);

module.exports = router;