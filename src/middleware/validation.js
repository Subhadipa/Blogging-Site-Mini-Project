const validator = require("email-validator");

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
