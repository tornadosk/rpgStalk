const router = require('express').Router();

router.use(function( req, res, next ) {
  // console.log("Router called" + req.params);
  next();
})

router.use('/list', require('./list'));
router.use('/heal', require('./heal'));
router.use('/create', require('./create'));
router.use('/become', require('./become'));

module.exports = router;