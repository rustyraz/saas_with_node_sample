var express = require('express');
var router = express.Router();
var restrict = require('../middlewares/auth/restrict');

router.get('/', restrict, function(req, res, next){
	var inputs_and_values = {
		title: 'Orders page',
		currently_on_orders_page: 'orders_page',
		first_name: req.user? req.user.profile.first_name : null
	};
	res.render('orders/index', inputs_and_values);
});

module.exports = router;