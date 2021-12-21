const express = require('express');
const { getAllUsers, getSingleUser } = require('../controllers/user');
const { checkUserExist } = require('../middlewares/database/existHelpers');


const router = express.Router();

router.get("/:id",checkUserExist,getSingleUser);
router.get("/",getAllUsers);


module.exports = router;