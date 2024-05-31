const mongoose = require('mongoose');
const { Schema } = mongoose;

const rawArticlesSchema = new Schema({
media:{
    type: String,
    required: false,

},
date:{
    type:Date,
    required:true
},
title:{
    type:String,
    required:true
},
link:{
    type:String,
    required:true
},
mainCategory:{
    type:String,
    required:true
},
entities:{
    type:Array,
    required:false
},
content:{
    type:String,
    required:false
},
deleted:{
    type:Boolean,
    required: true
}

},{timestamps:true});

module.exports = mongoose.model('RawArticle', rawArticlesSchema);



