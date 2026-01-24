const ApiError = require("../classes/ApiError")
const JWT = require('../classes/JWT');

const jwt = new JWT();

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        if (!req.headers.authorization) {
            return next(ApiError.badRequest("Not authorized"));
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verifyJWT(token);

        req.user = decodedToken;

        next();

    } catch (e) {
        next(ApiError.unauthorized("Not authorized"));
    }
}