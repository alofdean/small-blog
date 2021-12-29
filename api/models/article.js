const mongoose = require('mongoose');
const slugify = require('slugify');
const schema = mongoose.Schema;
const path = require('path');
const Comment = require('./Comment');
const fs = require('fs');

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
    likeCount : {
        type : Number ,
        default : 0
    },
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
    
    const rootDir = path.dirname(require.main.filename);
    const imagesDirectory =path.join(rootDir, "/public/uploads/article_images");

    if (update.article_image!= null) {
        try {
            fs.unlinkSync( path.join(imagesDirectory,"/" + docToUpdate.article_image));
        } catch (error) {
            console.log(error);
        }
    }
    

    // if (update.title != null) {
    //     docToUpdate.slug = slugify(update.title,{
    //         replacement : '-',
    //         remove : /[*+~.()'"!?:@]/g,
    //         lower : true,
    //     })
    //     await docToUpdate.save();
    //     next();
    // }
    next();
    
});


ArticleSchema.post('findOneAndUpdate', async function(next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    docToUpdate.slug = slugify(docToUpdate.title,{
        replacement : '-',
        remove : /[*+~.()'"!?:@]/g,
        lower : true,
    })
    await docToUpdate.save();
    
});

ArticleSchema.post("remove", async function() {
    const rootDir = path.dirname(require.main.filename);
    const imagesDirectory =path.join(rootDir, "/public/uploads/article_images");
    try {
        await Comment.deleteMany({
            article : this._id
        });
    } catch (err) {
        console.log(err);
    }
    //delete article image
    try {
        fs.unlinkSync( path.join(imagesDirectory,"/" + this.article_image));
    } catch (error) {
        console.log(error);
    }
    
});




ArticleSchema.methods.makeSlug =  function () {
    return slugify(this.title,{
        replacement : '-',
        remove : /[*+~.()'"?!:@]/g,
        lower : true,
        
    });
};

module.exports = mongoose.model("Article",ArticleSchema);