var express = require('express');
var router = express.Router();
var settings = require('../../config/settings');

var customerService = require('../../services/admin/admin-customers-service');

//list all customers
router.get('/', function(req, res, next){
	res.send('we send all the customers thru here');
});

//get the new customers page
router.get('/create', function(req, res, next){
	//list products
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		tenant_domain: req.tenant.domain,
		admin_first_name: req.user.profile.first_name,
		title: 'New customer\'s page',
		currently_on_customers_page: 'customers_page'
	};
	res.render('admin/customers/create', inputs_and_values);
});


//post new product
router.post('/create', function(req, res, next){
	
	customerService.addCustomer(req.body, req.tenant._id, function(err,id){
		var inputs_and_values = {
			admin_route: true,
			tenant_id: req.tenant_id,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.firstname,
			title: 'New customer\'s page',
			input: req.body,
			error: null
		};

		if(err){
			console.log(err);
			inputs_and_values.error = err.errors;
			//delete inputs_and_values.input.password;
			return res.render('admin/customers/create', inputs_and_values);
		}else{
			//product save successfully
			//inputs_and_values.success = {success: 'Product was saves successfully'};
			//return res.render('admin/products/list-products', inputs_and_values);
			//return res.redirect('/admin/products');
			return res.redirect('/admin/customers/edit/'+id);
		}

			
	});
});

//get customer by id form
router.get('/edit/:id', function(req,res,next){
	var id = req.params.id;
	var customer = [];

	customerService.findCustomer(id, req.tenant._id, function(err, result){
		if(err) console.log(err);

		customer = result;
		customer.first_name = result.profile.first_name;
		customer.last_name = result.profile.last_name;

		//list products
		var inputs_and_values = {
			admin_route: true,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Edit Customer page',
			input: customer,
			update: true,
			currently_on_customers_page: 'products_page'
		};
		res.render('admin/customers/create', inputs_and_values);
	});
});

//post updated data
router.post('/edit/:id', function(req,res,next){
	customerService.updateCustomer(req.body, req.tenant._id, function(err){
		var inputs_and_values = {
			admin_route: true,
			tenant_id: req.tenant._id,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Editing customer page',
			input: req.body,
			update: true,
			currently_on_products_page: 'customers_page',
			post_from_update_form: true
		};

		if(err){
			//error was encountered when tryin to update the product
			inputs_and_values.error = err.errors;
		}else{
			//error was encountered when tryin to update the product
			inputs_and_values.success = "Customer Updated successfully !";	
		}
		return res.render('admin/customers/create',inputs_and_values);
	});
});

//delete a customer by id
router.post('/delete/:id', function(req,res,next){
	var customer_id = req.params.id;

	customerService.deleteCustomer(customer_id, req.tenant._id, function(err){
		if(err){
			console.log(err);
			res.json({error: true, success: false, message: err});
		}else{
			res.json({error: false, success: true, message: "CUstomer deleted successfully"});
		}
	});
});

module.exports = router;