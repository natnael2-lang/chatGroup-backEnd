const   User=require("../Model/user")

const getUserAll=async (req,res)=>{
    try{
        const data=await User.find();
        res.status(201).send(data);
        console.log(data);
    }
    catch{
        console.log("fail to get all tododata");
        res.status(500).send('Server error');
    }
}
const getUserSome=async (req,res)=>{
    try{
        const id =req.params.id;
        const data=await User.findById(id);
        res.status(201).send(data);
        console.log(data);
    }
    catch{
        console.log("fail to get some tododata");
        res.status(500).send('Server error');
    }
}

const postUser= async (req, res) => {
    try {
        const newData = await User.create(req.body);
        res.status(201).json(newData);
    } catch (error) {
        console.error("Failed to post todo data:", error);
        res.status(400).json({ error: error.message }); // Send the specific error message
    }
};
const postUserLogin= async (req, res) => {
    const { email, password } = req.body || xxxxxx;
    console.log(email,password);
    try {
        const newData = await User.find({email});
        console.log(newData);
        if(!newData){
            return res.status(401).send('Invalid email or password');
        }
        if (password != newData[0].password) {
            return res.status(401).send('Invalid email or password'); 
        }
        req.session.userId = newData._id;  
        res.cookie('username', email, {
            maxAge: 900000, 
            httpOnly: true, 
            secure: false,
            sameSite: 'Strict'
        });
        res.status(201).send("login successfully")





        
    } catch (error) {
        console.error("Failed to post todo data:", error);
        res.status(400).json({ error: error.message }); // Send the specific error message
    }
};
const deletUserSome=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await User.findByIdAndDelete(id);

    }
    catch{
        console.log("fail to delete specific todo data");
        res.status(500).send('Server error');
    }
}
const deletUserAll=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await User.deleteMany({});
        res.status(201).send(data);

    }
    catch{
        console.log("fail to delete all todo data");
        res.status(500).send('Server error');
    }
}
const putUser=async (req,res)=>{
    try{
        const id =req.params.id;
        const data= await User.replaceOne({id},req.body)
    }
    catch{
        console.log("fail to replace the todo data");
        res.status(500).send('Server error');
    }
}
const patchUser=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await User.updateOne({id},req.body)
    }
    catch{

        console.log("fail to update todo data");
        res.status(500).send('Server error');
    }
}



module.exports={getUserAll,getUserSome,postUser,postUserLogin,deletUserAll,deletUserSome,putUser,patchUser}