const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const validation=require("../middleware/validation")
//------------------------1.Create Blog---------------------------------------------------------
module.exports.createBlog = async  (req, res)=> {
    try {
        const blogData = req.body,title=req.body.title,body=req.body.body,tags=req.body.tags ,
        subcategory=req.body.subcategory ,auhorId=req.body.authorId

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
        if (!validation.isValid(auhorId)) {
            return res.status(400).send({ status: false, message: "Please provide auhorId or auhorId field" });;
        }

            if (blogData) {

                if (blogData.isPublished == true) {
                    blogData["publishedAt"] = new Date()
                }
               

                const validId = await authorModel.findById(auhorId)

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

}
//------------------------2.Filter Blog---------------------------------------------------------
module.exports.getFilterBlog = async  (req, res)=> {
    try {

        if (req.query.category || req.query.authorId || req.query.tags || req.query.subcategory) {
            let authorId = req.query.authorId,
            tags = req.query.tags,
            category = req.query.category,
             subcategory = req.query.subcategory

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
            else {
                res.status(201).send({ status: true, data: data })
            }

        }
        else {
            return res.status(404).send({ status: false, msg: "Mandatory body not given" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Failed", error: error.message });
    }

}

//------------------------3.Update Blog---------------------------------------------------------
module.exports.updateBlog = async  (req, res)=> {
    const blogid = req.params.blogId,
   
    updatedBlogdata = req.body,
    updatedTitle = req.body.title,
     updatedBody = req.body.body,
    addTags = req.body.tags,
     addSubcategory = req.body.subcategory,
     newispublished = req.body.isPublished
     console.log(blogid)
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

                res.status(200).send({ status: true, message: 'Blog updated successfully', UpdatedBlogDetails: newBlog })
            }
            else {
                res.status(401).send({ status: false, msg: "Not Authorize" })
            }
        }
        else {
            res.status(404).send({ status: false, msg: "Blog Id is wrong!" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Failed", error: error.message });
    }
}
//------------------------4.Delete Blog By Id---------------------------------------------------------
module.exports.deleteBlogbyId = async function (req, res) {
    try {
        let blogId = req.params.blogId
     
        if (req.validToken1.authorId == req.query.authorId) {
            
            let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
            if (deletedBlog) {

                res.status(200).send({ status: true, msg: "Blog deleted successfully" })
            }
            else {
                res.status(200).send({ status: false, msg: "Blog not found!" })
            }

        }
        else {

            res.status(401).send({ status: false, msg: "Not Authorize" })
        }
    }
    catch (error) {
        res.status(500).send({ message: "Failed", error: error.message });
    }
}
//--------------------------5.Delete Blog---------------------------------------------------------
module.exports.deleteBlog = async function (req, res) {
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
                let data = await blogModel.findOne(obj);
                if (!data) {
                    return res.status(404).send({ status: false, msg: "Blog not found!" });
                }
                data.isDeleted = true;
                data.deletedAt = new Date();
                data.save();
                res.status(200).send({ status: true,msg: "Blog deleted successfully", data: data });
            }
            else {
                res.status(401).send({ status: false, msg: "Not Authorize" })
            }
        }
        else {
            return res.status(404).send({ status: false, msg: "Mandatory body missing!" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Failed", error: error.message });
    }
}





