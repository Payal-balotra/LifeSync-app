const mongoose = require("mongoose");


const spaceSchema  = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    createdBy  : {
        type : mongoose.Schema.Types.ObjectId,
        ref  :"User"
    }
},{timeStamps:true});

module.exports = mongoose.model("Space",spaceSchema)