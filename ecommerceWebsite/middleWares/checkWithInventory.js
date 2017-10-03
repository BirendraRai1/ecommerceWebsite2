var mongoose=require('mongoose');
var inventoryModel=mongoose.model('inventory');
exports.checkWithInventory=function(req,res,next){
	req.err=false;
	console.log("printing req product_id")
	console.log(req.body.product_id);
	inventoryModel.findOne({'product_id':req.body.product_id},function(err,inventObj){
		if(err || null==inventObj){
			//res.send(err);
			req.err=true;
			req.errmsg="Mongodb error while querying";
		}
		else{
			var stock_level=inventObj.stock_level;
			//console.log(inventObj);
			stock_level -= parseInt(req.body.quantity);
			if(stock_level>=inventObj.stock_thresh){
				inventObj.stock_level=stock_level;
				inventObj.save(function(err){
					if(err){
						//res.send("error while updating inventory");
						req.err=true;
						req.errmsg="Error while updating inventory";
					}

				});
			}
			else{
				//res.send("We are not stocked up");
				req.err=true;
				req.errmsg="We are not stocked up";
			}
		}
		next();
	});
};