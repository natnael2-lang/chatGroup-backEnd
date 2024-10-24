const express=require("express");
const router=express.Router();
const {getUserAll,getUserSome,postUser,postUserLogin,deletUserSome,deletUserAll,putUser,patchUser}=require("../Controler/user")


const checkAuth = (req, res, next) => {
    if (req.session.userId || req.cookies.username) {
        next(); 
    } else {
        res.status(401).send('Please log in'); 
    }
};



router.post("/login",postUserLogin);
router.get("/", checkAuth, getUserAll); 
router.get("/:id", checkAuth, getUserSome); 
router.delete("/:id", checkAuth, deletUserSome); 
router.delete("/", checkAuth, deletUserAll); 
router.post("/", checkAuth, postUser); 
router.patch("/:id", checkAuth, patchUser); 
router.put("/:id", checkAuth, putUser); 

module.exports=router;

