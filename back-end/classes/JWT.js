const jwt = require('jsonwebtoken');

class JWT {
    
    generateJWT(id, email) {
        return jwt.sign(
            {id, email}, 
            process.env.JWT_SECRET_KEY, 
            {expiresIn: '24h'}
        );
    }

    verifyJWT(token) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
}

module.exports = JWT;