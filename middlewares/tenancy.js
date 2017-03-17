var express = require('express');
var mongoose = require('mongoose');
var tenantService = require('../services/tenant-service');
var fs = require('fs');

//get the tenant model and its methods

module.exports = function(){
	return function(req, res, next){
		tenantService.findTenant(req,res, function(err,tenant){
			if(err){
				console.log(err);
				return next(false);
			} 

			if(tenant ==null){
				return res.send('<p align="center" >Unauthorized or Unknown tenant access. Please contact admin!</p>');
			}

			//check if the upload dir is set
			
			req.tenant = tenant;
			return next();
		});
		
	};
};