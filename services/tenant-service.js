//ALL THE FUNCTIONS THAT THE TENANT MODEL SHOULD HAVE WILL BE HERE

//load the tenant Class
var Tenant = require('../models/tenant').Tenant;


/*
var newTenant = new Tenant({
  name: 'Joint Tenant',
  domain: 'localjoint.dev.com'
});

newTenant.save(function(err){
  if(err) throw err;
  console.log('tenant created');
});*/


//function to check if a Tenant exists
exports.findTenant = function(domain,res, next){

	Tenant.findOne({domain:domain.hostname}, function(err, tenant){
		/*console.log(tenant.domain);	
		if(domain.hostname != tenant.domain){
			//return res.send('<p align="center">Unauthorized Domain Access</p>');
			//return next(null,tenant);		
		}*/
		next(err, tenant);
	});
		

	
	
};
