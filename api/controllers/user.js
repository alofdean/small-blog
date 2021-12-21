const User = require("../models/User");
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");


const getSingleUser = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    return res.status(200)
    .json({
        success: true,
        data: user
    });
});

const getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();
    return res.status(200)
    .json({
        success: true,
        data: users
    });
});

module.exports = {
    getSingleUser,
    getAllUsers
};