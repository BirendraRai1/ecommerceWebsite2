var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//cart Schema
var cartSchema=new Schema({
	user_id              :{type:String},
	cartProductDetails   :[{
							product_id:{type:String,required:true},
							quantity  :{type:Number,required:true}
	                     }],
	created_date         :{type:Date,default:Date.now()},
	modified_date        :{type:Date,default:Date.now()}                     
});
mongoose.model('cart',cartSchema);