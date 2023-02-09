const router = require('express').Router();

router.use(function( req, res, next ) {
  // console.log(req.body);
  next();
})

router.use('/tasks', require('./tasks'));
router.use('/messages', require('./messages'));
router.use('/send', require('./send'));
router.use('/coords', require('./coords'));
router.use('/health', require('./health'));
router.use('/hit', require('./hit'));

module.exports = router;