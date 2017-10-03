var mongoose=require('mongoose');
var express=require('express');
var productRouter=express.Router();
var catalogModel=mongoose.model('catalog');
var categoryModel=mongoose.model('category');
var productModel=mongoose.model('product');
var inventoryModel=mongoose.model('inventory');
var reviewModel=mongoose.model('review');
var responseGenerator=require('./../../libs/responseGenerator');
var util=require('./../../middleWares/utils');
module.exports.controllerFunction=function(app){


	//API to list all products
	productRouter.get('/allProducts',function(req,res){
		productModel.find({},function(err,foundAllProduct){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
			}
			else{
				res.send(foundAllProduct);
			}
		});
	});


	//API to get all category
	productRouter.get('/allCategory',function(req,res){
		categoryModel.find({},function(err,foundAllCategory){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});

			}
			else{
				res.send(foundAllCategory);
			}
		});
	});


	//API to get all catalog
	productRouter.get('/allCatalog',function(req,res){
		catalogModel.find({},function(err,foundAllCatalog){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
			}
			else{
				res.send(foundAllCatalog);
			}
		});
	});


	//API to get all inventory
	productRouter.get('/allInventory',function(req,res){
		inventoryModel.find({},function(err,foundAllInventory){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
			}
			else{
				res.send(foundAllInventory);
			}
		});
	});


	//API to get a particular inventory
	productRouter.get('/:id/Inventoryinfo',function(req,res){
		inventoryModel.findOne({'id':req.params.id},function(err,foundparticularInventory){
			if(err){
				var myResponse=responseGenerator.generate(true,err,404,null);
				res.render('error',{
					message:myResponse.message,
					error:myResponse.data
				});
			}
			else{
				res.send(foundparticularInventory);
			}
		});
	});


	//API to view information of a particular product
	productRouter.get('/:id/Productinfo',function(req,res){
		productModel.findOne({'id':req.params.id},function(err,foundparticularProduct){
			if(err){
				var myResponse=responseGenerator.generate(true,err,404,null);
				res.render('error',{
					message:myResponse.message,
					error:myResponse.data
				});
			}
			else{
				res.send(foundparticularProduct);
			}
		});
	}); 


	//API to create a product
	productRouter.post('/createProducts',util.generateRandomNumber,function(req,res){
		//console.log("came here");
		var newProduct=new productModel({
			id    :"product_"+req.suffix_id,
			product_dispaly_name:req.body.product_dispaly_name,
				mpn     :req.body.mpn,
				product_short_description:req.body.product_short_description,
				landing_page_image :req.body.landing_page_image , 
				category_ids:req.body.category_ids.split(',')
		});
		productPricedetail = {
			 list_price  :req.body.list_price,
			 sale_price  :req.body.sale_price,
			  whole_sale_price: req.body.whole_sale_price
		};
		newProduct.price=productPricedetail;
		dimensionDetail={
			length:req.body.length,
			 breadth: req.body.breadth,
			  height: req.body.height
		}
		shipping_infoDetails={
			 weight: req.body.weight,
			 dimensions:dimensionDetail
		} 
		newProduct.shipping_info=shipping_infoDetails;

		newProduct.save(function(err){
			if(err){
					var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
			else{
				res.send(newProduct);
			}
		});
	});



	//API to create a catalog 
	productRouter.post('/createCatalog',util.generateRandomNumber,function(req,res){
		var newCatalog=new catalogModel({
			id    :"catalog_"+req.suffix_id,
			name  :req.body.name
		});
		newCatalog.save(function(err){
			if(err){
					var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
			else{
				res.send(newCatalog);
			}
		}); 
	});


	//API to create a category
	productRouter.post('/createCategory',util.generateRandomNumber,function(req,res){
		var newCategory=new categoryModel({
			id     :"category_"+req.suffix_id,
			name   :req.body.name,
			child_categories:req.body.child_categories.split(','),
			parent_categories:req.body.parent_categories.split(','),
			catalog_id:req.body.catalog_id.split(',') 
		});
		newCategory.save(function(err){
			if(err){
					var myResponse=responseGenerator.generate(true,err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
			else{
				res.send(newCategory);
			}
		});
	});


	//API to create a inventory
	productRouter.post('/createInventory',function(req,res){
		var newInventory=new inventoryModel({
			display_name:req.body.display_name,
			description :req.body.description,
			catalog_ref_id:req.body.catalog_ref_id,
			avail_status:req.body.avail_status,
			stock_level:req.body.stock_level,
			stock_thresh:req.body.stock_thresh,
			product_id:req.body.product_id
		});
		var stock_level = req.body.stock_level;
		inventoryModel.findOne({'product_id':req.body.product_id},function(err,inventObj){
			if(err){
				var myResponse=responseGenerator.generate(true,"error occurred while adding product to inventory"+err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});

			}
			else if(null==inventObj){
				productModel.findOne({'id':req.body.product_id},function(err,productObj){

					if(err){
						res.send(err);
					}
					else if(null==productObj){
						res.send("product not found");
					}
					else{
						newInventory.save(function(err){
							if(err){
								res.send(err);
							}
							res.send(newInventory);
						});
					}
				});
			}
			else{
				inventObj.stock_level +=parseInt(stock_level);
				inventObj.save(function(err){
					if(err){
					var myResponse=responseGenerator.generate(true,"error occurred while updating stock level"+err,500,null);
					res.render('error',{
							message:myResponse.message,
						error:myResponse.data
					});
				}
					res.send(inventObj);
				})
				//res.send(inventObj);
			}
		});
	});



	//API to create a review
	productRouter.post('/review',function(req,res){
		var newReview=new reviewModel({
			product_id:req.body.product_id,
			review_title:req.body.review_title,
			review_text:req.body.review_text,
			submitted_by:req.body.submitted_by,
			verified_customer:req.body.verified_customer,
			rating:req.body.rating
		});
	});


	//API to delete a particular product
	productRouter.post('/:id/deleteProduct',function(req,res){
		productModel.remove({'id':req.params.id},function(err,deletedProduct){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(deletedProduct);
			}
		});
	});



	productRouter.put('/:id/editCategory',function(req,res){
		var update=req.body;
		categoryModel.findOneAndUpdate({'id':req.params.id},update,{new:true},function(err,updatedCategory){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(updatedCategory);
			}
		});
	});	

	//API to edit a particular product
	/*productRouter.put('/:id/editProduct',function(req,res){
		var update=req.body;
		productModel.findOneAndUpdate({'id':req.params.id},update,{new:true},function(err,updatedProduct){
			if(err){
				res.send(err);
			}
			else{
				res.send(updatedProduct);
			}
		});
	});*/
	productRouter.put('/:id/editProduct',function(req,res){
		productModel.findOne({'id':req.params.id},function(err,updatedProduct){
			updatedProduct.product_dispaly_name=req.body.product_dispaly_name;
			updatedProduct.product_short_description=req.body.product_short_description;
			updatedProduct.landing_page_image=req.body.landing_page_image;
			updatedProduct.mpn=req.body.mpn;
			updatedProduct.category_ids=req.body.category_ids;
			priceDetails={
				list_price:req.body.list_price,
				sale_price:req.body.sale_price,
				whole_sale_price:req.body.whole_sale_price
			}
			updatedProduct.price=priceDetails;
			dimensionsDetail={
				length:req.body.length,
				breadth:req.body.breadth,
				height:req.body.height
			}
			shipping_info_details={
				weight:req.body.weight,
				dimensions:dimensionsDetail
			}
			updatedProduct.shipping_info=shipping_info_details;
			
			updatedProduct.save(function(err){
				if(err){
					var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
				else{
					res.send(updatedProduct);
				}
			});
		});
	});
	app.use('/products',productRouter);
};