const router = require('express').Router();

router.use(function( req, res, next ) {
  console.log("Router called" + req.params);
  next();
})

router.use('/tasks', require('./tasks'));
router.use('/messages', require('./messages'));
router.use('/coords', require('./coords'));
router.use('/health', require('./health'));

module.exports = router;