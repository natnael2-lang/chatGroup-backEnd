const express=require("express");
const router=express.Router();
const {getDataAll,getDataSome,postData,deletDataSome,deletDataAll,putData,patchData}=require("../Controler/toDoData")





router.get("/",getDataAll);
router.get("/:id",getDataSome);
router.delete("/:id",deletDataSome);
router.delete("/",deletDataAll);
router.post("/",postData);
router.patch("/:id",patchData);
router.put("/:id",putData);


module.exports=router;

