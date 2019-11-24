let mongoose = require ('mongoose');
let Schema=mongoose.Schema;
let mongooseAlgolia=require('mongoose-algolia');
let config = require('../config/config')

let ProductSchema=new Schema({
    category:{type:Schema.Types.ObjectId,ref:'Category',es_type: 'text'},
    name:{type:String,es_type: 'text'},
    price:{type:Number,es_type: 'long'},
    image:{type:String,es_type: 'text'}
});

ProductSchema.plugin(mongooseAlgolia,{
    appId: config.algoliaAppId,
    apiKey: config.algoliaAdminApiKey,
    indexName: 'ProductSchema', //The name of the index in Algolia, you can also pass in a function
    selector: 'category name price image', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    populate: {
      path: 'category',
      select: 'name',
      
    },
    defaults: {
      author: 'unknown'
    },
    mappings: {
      title: function(value) {
        return `Name: ${value}`
      }
    },
  
    
    debug: true // Default: false -> If true operations are logged out in your console
  });
  
  
  
  let Model = mongoose.model('Product', ProductSchema);
  
  Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
  Model.SetAlgoliaSettings({
    searchableAttributes: ['name','properties','shows'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
  });
  
  

module.exports=Model;