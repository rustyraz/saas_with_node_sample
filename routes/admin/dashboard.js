var express = require('express');
var passport = require('passport');
var settings = require('../../config/settings');
var restrict = require('../../middlewares/auth/restrict');
var router = express.Router();


router.get('/',restrict,function(req,res,next){

	res.send('you are in the dashboard page');
});

module.exports = router;