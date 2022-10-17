const checkIfAuthenticated = require('../../auth')
const { getTasks } = require('../../controllers/tasksController');

const router = require('express').Router();

router.get('', getTasks);

module.exports = router;