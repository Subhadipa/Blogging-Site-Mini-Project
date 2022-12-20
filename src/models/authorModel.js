const mongoose = require('mongoose')
const authorSchema = new mongoose.Schema(
      {

            fname:
            {
                  type: String,
                  trim:true,
                  required: true
            },
            lname:
            {
                  type: String,
                  trim:true,
                  required: true
            },
            title:
            {
                  type: String,
                  enum: ["Mr", "Mrs", "Miss"],
                  trim:true,
                   required: true
            },

            email:
            {
                  type: String,
                  trim:true,
                  required: true,
                  unique: true
            },
            password:
            {
                  type: String,
                  trim:true,
                  required: true

            }

      },

      { timestamps: true }

)

module.exports = mongoose.model('authorModel_Final', authorSchema)
