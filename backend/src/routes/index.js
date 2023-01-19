const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/adm', require('./adm'));

module.exports = router;