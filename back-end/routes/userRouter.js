const Router = require('express');
const authorizationMiddleware = require('../middlewares/AuthorizationMiddleware');
const userRouter = Router();
const userController = require('../controllers/UserContoller');

userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/check', authorizationMiddleware, userController.check);
userRouter.get('', authorizationMiddleware, userController.getUserInfo);


module.exports = userRouter;