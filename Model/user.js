const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({

   name:{
    type: String,
    required: true,
   },
     email:{
     type:String,
     required:true,
     unique:true



   },

   createdAt:{
    type:Date,
    default:Date.now
   },
   password:{
    type:Number,
    required:true
   }


})
const User=mongoose.model("User",userSchema);
module.exports=User;

