const express = require("express");
const router = express.Router();
const auth = require("./auth");

router.get("/",(req,res,next) => {
    res.render("home")
})
router.use("/auth", auth);

module.exports = router;