const checkIfAuthenticated = require('../../auth')
const { getSetCoords } = require('../../controllers/coordsController');

const router = require('express').Router();

router.get('', getSetCoords);

module.exports = router;