const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const blogSchema = new mongoose.Schema(
        {

                "title":
                {
                        type: String,
                        trim: true,
                        required: true
                },
                "body":
                {
                        type: String,
                        trim: true,
                        required: true
                },
                "authorId":
                {
                        type: ObjectId,
                        ref: 'Author Model',
                        required: true
                },

                "tags": [String],
                "category":
                {
                        type: String,
                        trim: true,
                        required: true
                },
                "subcategory": [String],
                "deletedAt": Date,
                "isDeleted":
                {
                        type: Boolean,
                        trim: true,
                        default: false

                },

                "publishedAt": Date,
                "isPublished":
                {
                        type: Boolean,
                        trim: true,
                        default: false

                }



        },

        { timestamps: true }


)

module.exports = mongoose.model('Blog Model', blogSchema)
