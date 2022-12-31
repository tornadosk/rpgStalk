const checkIfAuthenticated = require('../../auth')
const { getSetHealth } = require('../../controllers/healthController');

const router = require('express').Router();

router.get('', getSetHealth);

module.exports = router;