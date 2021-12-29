const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;
const CustomError = require("../helpers/error/CustomError");
const Article = require('./Article');
const Comment = require('./Comment');
const fs = require('fs');
const path = require('path');

const UserSchema =  new schema({
    name : {
        type : String,
        required : [true,"please provide a name"]
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required : [true, "please provide a email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","admin"]
    },
    password : {
        type : String,
        minlength : [6, " please provide a password with min length 6"],
        required : [true, "please provide a password"],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    profile_image : {
        type : String,
        default : "default.png"
    },
    reading_list : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Article"
        }
    ],
    blocked : {
        type : Boolean,
        default : false
    }

});



// UserSchemna Methods
UserSchema.methods.generateJwtFromUser = function () {  
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;
    const payload = {
        id : this._id,
        name : this.name
    };
    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        //options
        expiresIn : JWT_EXPIRE //10m
    });
    return token;
};


// middleware 
UserSchema.pre("save", function(next) {
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt)=> {
        if (err) next(err);
        bcrypt.hash(this.password, salt, (err, hash)=> {
            // Store hash in your password DB.
            if (err) next(err);
            this.password = hash;
            next();
        });
    });
});

UserSchema.pre("findOneAndUpdate", async function(next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const update =  this.getUpdate();
    
    const rootDir = path.dirname(require.main.filename);
    const imagesDirectory =path.join(rootDir, "/public/uploads/profile_images");

    if (update.profile_image!= null && docToUpdate.profile_image !== update.profile_image && docToUpdate.profile_image!== "default.png") {
        try {
            fs.unlinkSync( path.join(imagesDirectory,"/" + docToUpdate.profile_image));
        } catch (error) {
            console.log(error);
        }
    }
    

});

UserSchema.post("remove", async function() {
    const rootDir = path.dirname(require.main.filename);
    const imagesDirectory =path.join(rootDir, "/public/uploads/profile_images");
    try {
        await Article.deleteMany({
            user : this._id
        });
        await Comment.deleteMany({
            user : this._id
        });
    } catch (err) {
        console.log(err);
    }
    //delete profile image
    try {
        fs.unlinkSync( path.join(imagesDirectory,"/" + this.profile_image));
    
    } catch (error) {
        console.log(error);
    }
    
});


module.exports = mongoose.model("User", UserSchema);
