const {Router} = require('express');
const groupController = require('./../controllers/StudyGroupController');

const router = Router();

router.get('/', groupController.getGroups);

module.exports = router;
