const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleWare = require("../middleware/authentication")
const Token = middleWare.tokenCheck

router.post('/createAuthors', authorController.createAuthor);

router.post('/login', authorController.loginAuthor)

router.post('/createBlogs', Token, blogController.createBlog);

router.get('/filterBlogs', Token, blogController.getFilterBlog);

router.put('/updateBlogs/:blogId', Token, blogController.updateBlog);

router.delete('/deleteBlogbyId/:blogId', Token, blogController.deleteBlogbyId);

router.delete('/deleteBlog', Token, blogController.deleteBlog)



module.exports = router;