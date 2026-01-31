const Router = require('express');
const deadlineController = require('../controllers/DeadlineController');
const authorizationMiddleware = require('../middlewares/AuthorizationMiddleware');

const router = Router();

router.post('/upload', authorizationMiddleware, deadlineController.upload);
router.get('/', authorizationMiddleware, deadlineController.getByUserId);
router.delete('/', authorizationMiddleware, deadlineController.deleteByUserId);
router.get('/statistic', authorizationMiddleware, deadlineController.getStatisticByUserId);

module.exports = router;