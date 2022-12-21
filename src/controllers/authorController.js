const authorModel = require("../models/authorModel")
const validation = require("../middleware/validation")
const jwt = require('jsonwebtoken')
//------------------------Create Author---------------------------------------------------------
let exportFuncs = {
    createAuthor: async (req, res) => {
        try {
            const authorData = req.body, fname = req.body.fname, lname = req.body.lname, title = req.body.title,
                Email = req.body.email, Password = req.body.password


            if (!validation.isValidRequestBody(authorData)) {
                return res.status(400).send({ status: false, message: "Please provide author details properly" });
            }
            if (!validation.isValid(fname)) {
                return res.status(400).send({ status: false, message: "Please provide first name or first name field" });;
            }
            if (!validation.isValid(lname)) {
                return res.status(400).send({ status: false, message: "Please provide last name or last name field" });;
            }
            if (!validation.isValid(title)) {
                return res.status(400).send({ status: false, message: "Please provide title or title field" });;
            }
            if (!validation.isValid(Email)) {
                return res.status(400).send({ status: false, message: "Please provide email or email field" });;
            }
            if (!validation.isValidSyntaxOfEmail(Email)) {
                return res.status(400).send({ status: false, message: "Please provide a valid Email Id" });
            }
            let isDBexists = await authorModel.find();
            let dbLen = isDBexists.length
            if (dbLen != 0) {
                const DuplicateEmail = await authorModel.find({ email: Email });
                const emailFound = DuplicateEmail.length;
                if (emailFound != 0) {
                    return res.status(400).send({ status: false, message: "This email Id already exists with another author" });
                }
            }
            if (!validation.isValid(Password)) {
                return res.status(400).send({ status: false, message: "Please provide password or password field" });
            }

            let authorsavedData = await authorModel.create(authorData)
            res.send({ status: true, message: 'New author registered successfully', AuthorDetails: authorsavedData })
        }
        catch (error) {
            res.status(500).send({ message: "Failed", error: error.message });
        }

    },

    //--------------------------Login check---------------------------------------------------------
    loginAuthor: async (req, res) => {

        try {
            const authorData = req.body, Email = req.body.email, Password = req.body.password


            if (!validation.isValidRequestBody(authorData)) {
                return res.status(400).send({ status: false, message: "Please provide author details properly" });
            }
            if (!validation.isValid(Email)) {
                return res.status(400).send({ status: false, message: "Please provide email or email field" });;
            }
            if (!validation.isValidSyntaxOfEmail(Email)) {
                return res.status(400).send({ status: false, message: "Please provide a valid Email Id" });
            }
            if (!validation.isValid(Password)) {
                return res.status(400).send({ status: false, message: "Please provide password or password field" });;
            }
            const authorDetails = await authorModel.findOne({ email: Email, password: Password });

            if (authorDetails) {
                const { _id, fname, lname } = authorDetails
                token = jwt.sign({ authorId: authorDetails._id }, "subha")//token generation
                res.header('x-api-key', token)//add new header to my response
                res.send({
                    Message: fname + " " + lname + " logged in Succesfully!",
                    authorId: authorDetails._id,
                    token: token,
                });
            }
            else {
                res.send({ status: false, msg: "Invalid credentials!" });
            }
        }
        catch (error) {
            res.status(500).send({ message: "Failed", error: error.message });
        }


    }
}
module.exports = exportFuncs
