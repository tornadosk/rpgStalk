const checkIfAuthenticated = require('../../auth')
const { getHit } = require('../../controllers/hitController');

const router = require('express').Router();

router.get('', getHit);

module.exports = router;