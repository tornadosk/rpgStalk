const router = require('express').Router();

router.use('/api', require('./api'));  // PDA things
router.use('/adm', require('./adm'));  // Amin things
router.use('/ano', require('./ano'));  // anomaly or artifact originating requests

module.exports = router;