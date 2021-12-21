const User = require('../models/User');
const express = require('express');
const asyncErrorHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const blockUser = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();
    
    return res.status(200)
    .json({
        success: true,
        message: "block-unblock successfull"
    });
});

const deleteUser = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
 
    await user.remove();

    return res.status(200)
    .json({
        success: true,
        message: "user removed successfuly"
    });
});

module.exports = {
    blockUser,
    deleteUser
}
