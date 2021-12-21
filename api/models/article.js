const mongoose = require('mongoose');
const slugify = require('slugify');
const schema = mongoose.Schema;

const ArticleSchema = new schema({
    title : {
        type : String,
        required : [true, "please provide a title"],
        minlength : [10, "please provide a title at least 10 characters"],
        unique : true
    },
    description : {
        type : String,
        required : [true, "please provide a description "],
        minlength : [10, "please provide a description at least 10 characters"]
    },
    content : {
        type : String,
        required : [true, "please provide a content "],
        minlength : [20, "please provide a content at least 20 characters"]
    },
    article_image : {
        type : String,
        default : "default.png"
    },
    slug : String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    comments: [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Comment"
        }
    ]
});

ArticleSchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        next();
    }
    this.slug = this.makeSlug(this);
    next();
});

ArticleSchema.pre('findOneAndUpdate', async function(next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const update =  this.getUpdate();

    if (update.title != null) {
        docToUpdate.slug = slugify(update.title,{
            replacement : '-',
            remove : /[*+~.()'"!:@]/g,
            lower : true,
        })
        await docToUpdate.save();
        next();
    }
    next();

    
});



ArticleSchema.methods.makeSlug =  function () {
    return slugify(this.title,{
        replacement : '-',
        remove : /[*+~.()'"!:@]/g,
        lower : true,
        
    });
};

module.exports = mongoose.model("Article",ArticleSchema);