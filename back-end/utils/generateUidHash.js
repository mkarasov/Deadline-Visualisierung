const crypto = require('crypto');

module.exports = (originalUid, userId) => {
    return crypto.createHash('md5').update(originalUid + userId).digest('hex');
}