const validator = require("email-validator");
const mongoose = require('mongoose')

module.exports.isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false//it cheks is there value is null or undefined
  if (typeof value === 'string' && value.trim().length === 0) return false//it checks the value conAtain only space or not 
  return true;
}

module.exports.isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;// it checks, is there any key is available or not in provided body
}


module.exports.isValidSyntaxOfEmail = function (value) {
  if (!(validator.validate(value.trim()))) {
    return false
  }
  return true
}


module.exports.isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};
// So, for example: 'undefined'.indexOf() will return 0, as undefined is found at position 0 in the
//  string undefined. 'undefine'.indexOf() however will return -1, as undefined is not found in the string undefine.


module.exports.isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports.isValidString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
