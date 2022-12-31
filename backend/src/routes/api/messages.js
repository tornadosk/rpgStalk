const checkIfAuthenticated = require('../../auth')
const { getMessages } = require('../../controllers/messagesController');

const router = require('express').Router();

router.get('', getMessages);

module.exports = router;