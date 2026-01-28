const ApiError = require('../classes/ApiError');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const JWT = require('../classes/JWT');

const jwt = new JWT();

class UserController {

    async registration(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest("Bitte geben Sie E‑Mail und Passwort ein."));
            }
            
            const existedUser = await User.findOne({where: {email}});
            if (existedUser) {
                return next(ApiError.badRequest("Ein Benutzer mit dieser E‑Mail existiert bereits."));
            }

            const passwordHash = await bcrypt.hash(password, 7);

            const createdUser = await User.create({email: email, password_hash: passwordHash});

            const token = jwt.generateJWT(createdUser.id, createdUser.email);

            return res.json({token});

        }  catch (e) {
            next(ApiError.internal(e.message));
        }

    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Bitte geben Sie E‑Mail und Passwort ein.'));
            }

            const user = await User.findOne({where: {email: email}});
            if (!user) {
                return next(ApiError.badRequest('Die eingegebene E‑Mail oder das Passwort ist falsch.'));
            }

            if (!bcrypt.compareSync(password, user.password_hash)) {
                return next(ApiError.badRequest('Die eingegebene E‑Mail oder das Passwort ist falsch.'));
            }

            const token = jwt.generateJWT(user.id, user.email);

            return res.json({token});

        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async check(req, res, next) {
        try {
            const token = jwt.generateJWT(req.user.id, req.user.email);

            return res.json({token});

        } catch (e) {
            next (ApiError.internal(e.message));
        }
    }
    

}

module.exports = new UserController();