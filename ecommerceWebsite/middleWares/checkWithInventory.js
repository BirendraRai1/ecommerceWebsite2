var mongoose=require('mongoose');
var inventoryModel=mongoose.model('inventory');
var userModel=mongoose.model('User');
exports.checkWithInventory=function(req,res,next){
	req.err=false;
	inventoryModel.findOne({'product_id':req.body.product_id},function(err,inventObj){
		if(err || null==inventObj){
			req.err=true;
			req.errmsg="Mongodb error while querying";
		}
		else{
			userModel.findOne({'_id':req.user._id},function(err,userObj){
				if(err){
					req.err=true;
					req.errmsg="Mongodb error while querying"+err;
				}
				else if(null==userObj){
					res.send("user is not logged in");
				}
				else{
					var stock_level=inventObj.stock_level;
					stock_level -= parseInt(req.body.quantity);
					if(stock_level>=inventObj.stock_thresh){
						inventObj.stock_level=stock_level;
						inventObj.save(function(err){
							if(err){
								req.err=true;
								req.errmsg="Error while updating inventory";
							}
						});
					}
					else{
						req.err=true;
						req.errmsg="We are not stocked up";
					}
				}
			});
		}
		next();
	});
};