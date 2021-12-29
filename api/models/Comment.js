const mongoose = require('mongoose');
const Article = require('./Article');

const schema = mongoose.Schema;


const CommentSchema = new schema({
    content: {
        type : String,
        required :[true,"please provide a content"],
        minlength : [10,"please provide a content at least 10 characters"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    article : {
        type : mongoose.Schema.ObjectId,
        ref : "Article",
        required : true
    }


});

CommentSchema.pre("save", async function(next){
    try {
        if (!this.isModified("user")) {
            next();
        }
        next();
    } catch (err) {
        return next(err);
    }
    
});



module.exports = mongoose.model("Comment",CommentSchema);
