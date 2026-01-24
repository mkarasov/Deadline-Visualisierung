const Router = require('express');
const router = Router();
const userRouter = require('./userRouter');
const deadlineRouter = require('./deadlineRouter');

router.use('/user', userRouter);
router.use('/deadline', deadlineRouter);

module.exports = router;