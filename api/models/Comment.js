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
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
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
        const article = await Article.findById(this.article);
        article.comments.push(this._id);
        await article.save();
        next();
    } catch (err) {
        return next(err);
    }
    
});



module.exports = mongoose.model("Comment",CommentSchema);
