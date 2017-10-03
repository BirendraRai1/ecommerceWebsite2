var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//catalog schema
var catalogSchema=new Schema({
	id       :{type:String,required:true},
	name     :{type:String,required:true}
});

//category schema
var categorySchema=new Schema({
	id                    :{type:String,required:true},
	name                  :{type:String,default:''},
	child_categories      :[],
	parent_categories     :[],
	creation_date         :{type:Date,default:Date.now()},
	last_modified_date    :{type:Date,default:Date.now()},
	catalog_id            :{type:String},
});

//product schema
var productSchema=new Schema({
	id                     :{type:String,required:true},
	product_dispaly_name   :{type:String},
	category_ids           :[],
	price                  :{
		                     list_price:{type:Number,required:true},
		                     sale_price:{type:Number,required:true},
		                     whole_sale_price:{type:Number,required:true}
	                         },
	mpn                    :{type:String},
	product_short_description:{type:String},
	landing_page_image       :{type:String},
	shipping_info            :{
		                      weight:{type:Number},
	                          dimensions:{
		                      length:{type:Number},
		                      breadth:{type:Number},
		                      height :{type:Number}
		                      },
		                      },
	creation_date            :{type:Date,default:Date.now()},
	last_modified_date       :{type:Date,default:Date.now()}		                        
});

//inventory schema
var inventorySchema=new Schema({
	creation_date            :{type:Date,default:Date.now()},
	start_date               :{type:Date,default:Date.now()},
	end_date                 :{type:Date,default:Date.now()},
	display_name             :{type:String},
	description              :{type:String},
	catalog_ref_id           :{type:String},
	avail_status             :{type:String},
	availability_date        :{type:Date,default:Date.now()},
	stock_level              :{type:Number},
	stock_thresh             :{type:Number},
	product_id               :{type:String}
});

//review schema
var reviewSchema=new Schema({
	product_id               :{type:String},
	review_title             :{type:String},
	review_text              :{type:String},
	submitted_by             :{type:String},
	submitted_at             :{type:Date,default:Date.now()},
	verified_customer        :{type:Boolean,default:false},
	rating                   :{type:Number}
});


mongoose.model('catalog',catalogSchema);
mongoose.model('category',categorySchema);
mongoose.model('product',productSchema);
mongoose.model('inventory',inventorySchema);
mongoose.model('review',reviewSchema);