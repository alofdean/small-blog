const express = require('express');
const {register, login,getUser, logout, editDetails} = require('../controllers/auth');
const { getAccessToRoute} = require('../middlewares/authorization/auth');
const router = express.Router();
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');


router.post("/register",register);
router.post("/login",login);
router.get("/profile",getAccessToRoute,getUser);
router.get("/logout",getAccessToRoute,logout);
router.put("/edit",[getAccessToRoute,profileImageUpload.single("profile_image")],editDetails);


module.exports = router;