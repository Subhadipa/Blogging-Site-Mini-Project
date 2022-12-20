const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleWare = require("../middleware/authentication")
const Token = middleWare.tokenCheck

router.post('/authors',  authorController.createAuthor);

router.post('/login', authorController.loginAuthor)

router.post('/blogs', Token, blogController.createBlog);

router.get('/blogs', Token, blogController.getFilterBlog);

router.put('/blogs/:blogId', Token, blogController.updateBlog);

router.delete('/blogs/:blogId', Token, blogController.deleteBlogbyId);

router.delete('/blogs', Token, blogController.deleteBlog)



module.exports = router;