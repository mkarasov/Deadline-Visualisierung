const Router = require('express');
const deadlineController = require('../controllers/DeadlineController');
const authorizationMiddleware = require('../middlewares/AuthorizationMiddleware');

const router = Router();

router.post('/upload', authorizationMiddleware, deadlineController.upload);
router.get('/', authorizationMiddleware, deadlineController.getByUserId);

module.exports = router;