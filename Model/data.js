const mongoose=require("mongoose");
const toDoListSchema=new mongoose.Schema({

   toDoList:{
    type: String,
    required: true,
   },
   dueDate:{
     type:Date,
     required:true,
    



   },

   createdAt:{
    type:Date,
    default:Date.now
   },
   completed:{
    type:Boolean,
    default:false
   }


})
const Data=mongoose.model("Data",toDoListSchema);
module.exports=Data;

