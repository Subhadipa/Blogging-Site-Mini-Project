const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const validation = require("../middleware/validation")
let exportFuncs = {
    //------------------------1.Create Blog---------------------------------------------------------
    createBlog: async (req, res) => {
        try {
            const blogData = req.body, title = req.body.title, body = req.body.body, tags = req.body.tags,
                subcategory = req.body.subcategory, authorId = req.body.authorId

            if (!validation.isValidRequestBody(blogData)) {
                return res.status(400).send({ status: false, message: "Please provide blog details properly" });
            }
            if (!validation.isValid(title)) {
                return res.status(400).send({ status: false, message: "Please provide title or title field" });;
            }
            if (!validation.isValid(body)) {
                return res.status(400).send({ status: false, message: "Please provide body or body field" });;
            }
            if (!validation.isValid(tags)) {
                return res.status(400).send({ status: false, message: "Please provide tags or tags field" });;
            }
            if (!validation.isValid(subcategory)) {
                return res.status(400).send({ status: false, message: "Please provide subcategory or subcategory field" });;
            }
            if (!validation.isValid(authorId)) {
                return res.status(400).send({ status: false, message: "Please provide auhorId or auhorId field" });;
            }

            if (blogData) {

                if (blogData.isPublished == true) {
                    blogData["publishedAt"] = new Date()
                }


                const validId = await authorModel.findById(authorId)

                if (validId) {

                    const newBlog = await blogModel.create(blogData)
                    res.status(201).send({ status: true, message: 'New blog created successfully', BlogDetails: newBlog })


                }
                else {
                    res.status(400).send({ status: false, msg: "No blog with this author Id" })
                }


            }

        }
        catch (error) {
            res.status(500).send({ message: "Failed", error: error.message });
        }

    },
    //------------------------2.Filter Blog---------------------------------------------------------
    getFilterBlog: async (req, res) => {
        try {

            let authorId = req.query.authorId
            let tags = req.query.tags
            let category = req.query.category
            let subcategory = req.query.subcategory

            if (!validation.isValidString(authorId)) {
                return res.status(400).send({ status: false, message: "Author id is required" });
            }
            if (authorId) {
                if (!validation.isValidObjectId(authorId)) {
                    return res.status(400).send({ status: false, message: `authorId is not valid.` });
                }
            }

            if (!validation.isValidString(category)) {
                return res.status(400).send({ status: false, message: "Category cannot be empty while fetching.", });
            }

            if (!validation.isValidString(tags)) {
                return res.status(400).send({ status: false, message: "tags cannot be empty while fetching." });
            }

            if (!validation.isValidString(subcategory)) {
                return res.status(400).send({
                    status: false,
                    message: "subcategory cannot be empty while fetching.",
                });
            }

            if (category || authorId || tags || subcategory) {


                obj = {}
                if (authorId) {
                    obj.authorId = authorId
                }
                if (tags) {
                    obj.tags = tags
                }
                if (category) {
                    obj.category = category
                }
                if (subcategory) {
                    obj.subcategory = subcategory
                }

                obj.isDeleted = false
                obj.isPublished = true

                let data = await blogModel.find(obj)
                if (!data) {
                    return res.status(404).send({ status: false, msg: "The given data is invalid!" })
                }

                return res.status(201).send({ status: true, data: data })


            }
            else {
                return res.status(404).send({ status: false, msg: "Mandatory body not given" });
            }
        }
        catch (error) {
            return res.status(500).send({ message: "Failed", error: error.message });
        }

    },

    //------------------------3.Update Blog---------------------------------------------------------
    updateBlog: async (req, res) => {
        const blogid = req.params.blogId,

            updatedBlogdata = req.body,
            updatedTitle = req.body.title,
            updatedBody = req.body.body,
            addTags = req.body.tags,
            addSubcategory = req.body.subcategory,
            newispublished = req.body.isPublished

        try {

            const validBlog = await blogModel.findById(blogid)
            // console.log(validBlog)

            if (validBlog) {
                if (req.validToken1.authorId == validBlog.authorId) {
                    let publishedAt;
                    if (newispublished == true) {
                        updatedBlogdata.publishedAt = new Date()
                        publishedAt = updatedBlogdata.publishedAt//global scope 

                    }

                    let newBlog = await blogModel.findOneAndUpdate({ _id: blogid, isDeleted: false }, { title: updatedTitle, body: updatedBody, publishedAt: publishedAt, isPublished: newispublished, $push: { subcategory: addSubcategory, tags: addTags } },
                        { new: true })

                    return res.status(200).send({ status: true, message: 'Blog updated successfully', UpdatedBlogDetails: newBlog })
                }
                else {
                    return res.status(401).send({ status: false, msg: "Not Authorize" })
                }
            }
            else {
                return res.status(404).send({ status: false, msg: "Blog Id is wrong!" });
            }
        }
        catch (error) {
            return res.status(500).send({ message: "Failed", error: error.message });
        }
    },
    //------------------------4.Delete Blog By Id---------------------------------------------------------
    deleteBlogbyId: async function (req, res) {
        try {
            let blogId = req.params.blogId

            if (req.validToken1.authorId == req.query.authorId) {

                let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
                if (deletedBlog) {

                    return res.status(200).send({ status: true, msg: "Blog deleted successfully" })
                }
                else {
                    return res.status(200).send({ status: false, msg: "Blog not found!" })
                }

            }
            else {

                return res.status(401).send({ status: false, msg: "Not Authorize" })
            }
        }
        catch (error) {
            return res.status(500).send({ message: "Failed", error: error.message });
        }
    },
    //--------------------------5.Delete Blog---------------------------------------------------------
    deleteBlog: async function (req, res) {
        try {
            if (req.query.category || req.query.authorId || req.query.tags || req.query.subcategory) {
                if (req.validToken1.authorId == req.query.authorId) {
                    let obj = {};
                    if (req.query.category) {
                        obj.category = req.query.category
                    }
                    if (req.query.authorId) {
                        obj.authorId = req.query.authorId;
                    }
                    if (req.query.tags) {
                        obj.tags = req.query.tags
                    }
                    if (req.query.subcategory) {
                        obj.subcategory = req.query.subcategory
                    }
                    if (req.query.published) {
                        obj.isPublished = req.query.isPublished
                    }
                    let data = await blogModel.findOne(obj)
                    if (!data) {
                        return res.status(404).send({ status: false, msg: "Blog not found!" });
                    }
                    data.isDeleted = true;
                    data.deletedAt = new Date();
                    data.save();
                    return res.status(200).send({ status: true, msg: "Blog deleted successfully", data: data });
                }
                else {
                    return res.status(401).send({ status: false, msg: "Not Authorize" })
                }
            }
            else {
                return res.status(404).send({ status: false, msg: "Mandatory body missing!" });
            }
        }
        catch (error) {
            return res.status(500).send({ message: "Failed", error: error.message });
        }
    }

}
module.exports = exportFuncs


