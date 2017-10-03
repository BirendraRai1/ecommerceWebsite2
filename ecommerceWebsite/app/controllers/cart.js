var mongoose=require('mongoose');
var express=require('express');
var cartModel=mongoose.model('cart');
var inventoryModel=mongoose.model('inventory');
var cartRouter=express.Router();
var checkCondition=require('./../../middleWares/checkWithInventory');
module.exports.controllerFunction=function(app){


	//API to add product to cart
	cartRouter.post('/addProductToCart',checkCondition.checkWithInventory,function(req,res){
		if(req.err==true){
			res.send("error while adding product to cart "+req.errmsg);
		}
		var newCart=new cartModel({
			user_id:req.session.user._id
		});
		productDetails={
			product_id:req.body.product_id,
			quantity  :req.body.quantity
		}
		cartModel.findOne({'user_id':req.session.user._id},function(err,cartObj){
			if(err || null==cartObj){
					newCart.cartProductDetails.push(productDetails);
					newCart.save(function(err){
						if(err){
					var myResponse=responseGenerator.generate(true,"error occurred while adding product to cart"+err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
						res.send(newCart);
					});
			}
			else{
				var product_exists_in_cart=false;
				for(var i=0;i<cartObj.cartProductDetails.length;i++){
					if(cartObj.cartProductDetails[i].product_id==req.body.product_id){
						cartObj.cartProductDetails[i].quantity += parseInt(req.body.quantity);
						product_exists_in_cart=true;
						break;
					}
				}
				if(!product_exists_in_cart){
					cartObj.cartProductDetails.push(productDetails);
				}
				
				cartObj.save(function(err){
					if(err){
					var myResponse=responseGenerator.generate(true,"error occurred while adding product to cart"+err,500,null);
					res.render('error',{
						message:myResponse.message,
						error:myResponse.data
					});
				}
					res.send(cartObj);
				});
			}
		});
	});


	//API to remove product from cart
	cartRouter.post('/removeProductFromCart',function(req,res){
		cartModel.findOne({'user_id':req.session.user._id},function(err,removedProduct){
			if(err){
				res.send(err);
			}
			else{
				var productFound=false;
				for(var i=0;i<removedProduct.cartProductDetails.length;i++){
					if(removedProduct.cartProductDetails[i].product_id==req.body.product_id){
						productFound=true;
						removedProduct.cartProductDetails[i].quantity -=parseInt(req.body.quantity);
						if(removedProduct.cartProductDetails[i].quantity>=0)
						{
							inventoryModel.findOne({'product_id':req.body.product_id},function(err,updatedInventory){
								if(err){
									res.send(err);
								}
								else{
									var stock_level=updatedInventory.stock_level;
									stock_level +=parseInt(req.body.quantity);
									updatedInventory.stock_level=stock_level;
									updatedInventory.save(function(err){
										if(err){
											var myResponse=responseGenerator.generate(true,err,500,null);
											res.render('error',{
												message:myResponse.message,
												error:myResponse.data
											});
										}
										else{
											removedProduct.save(function(err){
												if(err){
													var myResponse=responseGenerator.generate(true,err,500,null);
													res.render('error',{
														message:myResponse.message,
														error:myResponse.data
													});
												}
												else{
													res.send(removedProduct);
												}
											});
										}
									});
								}
							});

						}
						else{
							res.send("cannot remove this quantity from cart");
						}
						break;
					}
				}
				if(!productFound){
					res.send("incorrect product id");
				}
				
			}
		});
	});


	app.use('/carts',cartRouter);
};