const checkIfAuthenticated = require('../../auth')
const { sendMessage } = require('../../controllers/sendController');

const router = require('express').Router();

router.post('', sendMessage);

module.exports = router;