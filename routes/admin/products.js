var express = require('express');
var router = express.Router();
var settings = require('../../config/settings');


//var restrict = require('../../middlewares/auth/restrict');
var productService = require('../../services/admin/admin-products-service');

//main products routes
router.get('/', function(req, res, next){
	var page = 1, size= 2 , skip = 0;
	
	if(req.query.page){
		console.log(req.query.page);
		page = parseInt(req.query.page);
	}
	if(req.query.size){
		size = parseInt(req.query.size);
	}
	var skip = page > 0 ? ((page - 1) * size) : 0;

	var products = [];
	productService.getProducts(page,size,req.tenant._id, function(err,products,pagination){
		if(err) {
			console.log(err)
		};
		//list products

		var inputs_and_values = {
			admin_route: true,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Products page',
			products: products,
			pagination: pagination,
			currently_on_products_page: 'products_page'
		};
		res.render('admin/products/list-products', inputs_and_values);
	});

	
		
});

//page to create a product
router.get('/create', function(req, res, next){
	//list products
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		tenant_domain: req.tenant.domain,
		admin_first_name: req.user.profile.first_name,
		title: 'Products page',
		currently_on_products_page: 'products_page'
	};
	res.render('admin/products/create', inputs_and_values);
});


//post new product
router.post('/create', function(req, res, next){
	
	productService.addProduct(req.body, req.tenant._id, function(err,id){
		var inputs_and_values = {
			admin_route: true,
			tenant_id: req.tenant_id,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.firstname,
			title: 'New Product\'s page',
			input: req.body,
			error: null
		};

		if(err){
			//an error was encountered when trying to save the product
			console.log(err);
			inputs_and_values.error = err.errors;
			//delete inputs_and_values.input.password;
			return res.render('admin/products/create', inputs_and_values);
		}else{
			//product save successfully
			//inputs_and_values.success = {success: 'Product was saves successfully'};
			//return res.render('admin/products/list-products', inputs_and_values);
			//return res.redirect('/admin/products');
			return res.redirect('/admin/products/edit/'+id);
		}

			
	});
});


//get the update page
router.get('/edit/:id', function(req, res, next){
	var id = req.params.id;
	var item = [];
	productService.findSingleProductDetails(id, req.tenant._id, function(err,product){
		if(err) console.log(err);
		item = product;

		//re-convert the prices to a string
		var price = "";
		for (var i = 0; i < product.price.length; i++) {
			var comma = ',';
			if(i==0){ comma = ''; }
			price += comma + product.price[i].group +':'+product.price[i].value ;
		};

		item.prices = price; //the property that will be accessed for the prices
		//reassing the shipping attributes
		item.prod_weight = product.shipping.prod_weight;
		item.prod_height = product.shipping.prod_height;
		item.prod_width = product.shipping.prod_width;
		item.prod_length = product.shipping.prod_length;

		//metadata reassign values
		item.title = product.metadata.title;
		item.keyword = product.metadata.keyword;
		item.description = product.metadata.description;

		console.log(item.image.thumbnail);

		//list products
		var inputs_and_values = {
			admin_route: true,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Edit Product page',
			input: item,
			update: true,
			currently_on_products_page: 'products_page'
		};
		res.render('admin/products/create', inputs_and_values);
	});
});

//post an update for a product
router.post('/edit/:id', function(req, res, next){
	productService.updateProduct(req.body, req.tenant._id, function(err){
		var inputs_and_values = {
			admin_route: true,
			tenant_id: req.tenant._id,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Editing product page',
			input: req.body,
			update: true,
			currently_on_products_page: 'products_page',
			post_from_update_form: true
		};

		inputs_and_values.input.prices = req.body.price;

		if(err){
			//error was encountered when tryin to update the product
			inputs_and_values.error = err.errors;
		}else{
			//error was encountered when tryin to update the product
			inputs_and_values.success = "Product Updated successfully !";	
		}
		return res.render('admin/products/create',inputs_and_values);
	});
	
});

//upload the images
router.post('/images/:id', function(req, res, next){
	var product_id = req.params.id;
	var images = req.files.files;

	productService.updateProductImages(product_id, req.tenant._id, images, function(err){
		if(err) console.log(err);
		res.redirect('/admin/products/edit/'+product_id);
	});
});

router.get('/ajax/edit/:id', function(req, res, next){
	var id = req.params.id;
	var item = [];
	productService.findSingleProductDetails(id, req.tenant._id, function(err,product){
		if(err) console.log(err);
		item = product;

		//re-convert the prices to a string
		var price = "";
		for (var i = 0; i < product.price.length; i++) {
			var comma = ',';
			if(i==0){ comma = ''; }
			price += comma + product.price[i].group +':'+product.price[i].value ;
		};

		item.prices = price; //the property that will be accessed for the prices
		//reassing the shipping attributes
		item.prod_weight = product.shipping.prod_weight;
		item.prod_height = product.shipping.prod_height;
		item.prod_width = product.shipping.prod_width;
		item.prod_length = product.shipping.prod_length;

		//metadata reassign values
		item.title = product.metadata.title;
		item.keyword = product.metadata.keyword;
		item.description = product.metadata.description;

		console.log(item.image.thumbnail);

		//list products
		var inputs_and_values = {
			admin_route: true,
			tenant_name: req.tenant.name,
			tenant_domain: req.tenant.domain,
			admin_first_name: req.user.profile.first_name,
			title: 'Edit Product page',
			input: item,
			update: true,
			currently_on_products_page: 'products_page'
		};
		res.render('admin/products/ajax_edit', inputs_and_values);
	});
});

router.post('/ajax/images/:id', function(req, res, next){

	if(req.files.files){
		var prod_id = req.params.id;
		var images = req.files.files;
		productService.updateProductImages(prod_id, req.tenant._id, images, function(err){
			if(err){
				console.log(err);
				res.send({error: true, success: false, message: err});
			}else{
				res.send({error: false, success: true, message: "Image uploaded successfully", images: images});
			}
		});
	}else{
		res.send({error: true, success: false, message: 'file error'});
	}
		
});

//upload the thumbnail
router.post('/thumbnail/:id', function(req, res, next){
	var product_id = req.params.id;
	var images = req.files.files;

	productService.updateProductThumbnail(product_id, req.tenant._id, images, function(err){
		if(err) console.log(err);
		res.redirect('/admin/products/edit/'+product_id);
	});
});


//get the upload page for the products
router.get('/upload', function(req, res, next){

	//upload products
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		tenant_domain: req.tenant.domain,
		admin_first_name: req.user.profile.first_name,
		title: 'Upload Products page',
		currently_on_products_page: 'products_page'
	};
	res.render('admin/products/upload', inputs_and_values);
});


//posting data
router.post('/upload', function(req, res, next){
	/*for (var i = 0; i < req.files.files.length; i++) {
		console.log(req.files.files[i].name);
	};*/


	//upload products
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		tenant_domain: req.tenant.domain,
		admin_first_name: req.user.profile.first_name,
		title: 'Upload Products page',
		file_uploaded: req.files,
		currently_on_products_page: 'products_page'
	};
	res.render('admin/products/upload', inputs_and_values);
});

//deleting a product
router.post('/delete/:id', function(req, res, next){
	var prod_id = req.params.id;
	//next(null);
	productService.deleteProduct(prod_id, req.tenant._id, function(err){
		if(err) {
			console.log(err);
			res.json({error: true, success: false, message: err});
		}else{
			res.json({error: false, success: true, message: "Product deleted successfully"});
		}

		
	});
});

//landing page
router.get('/landing-page',function(req, res, next){
	//upload products
	var inputs_and_values = {
		admin_route: true,
		tenant_name: req.tenant.name,
		tenant_domain: req.tenant.domain,
		admin_first_name: req.user.profile.first_name,
		title: 'Upload Products page',
		currently_on_products_page: 'products_page'
	};
	res.render('admin/products/landing-page', inputs_and_values);
});

module.exports = router;
