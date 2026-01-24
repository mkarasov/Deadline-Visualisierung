const ApiError = require('../classes/ApiError');

module.exports = function (error, req, res, next) {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({message: error.message});
    }

    return res.status(500).json({message: 'Unknown error occured'});
}