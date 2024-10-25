const Data=require("../Model/data")

const getDataAll=async (req,res)=>{
    try{
        const data=await Data.find();
        res.status(201).send(data);
        console.log(data);
    }
    catch{
        console.log("fail to get all tododata");
        res.status(500).send('Server error');
    }
}
const getDataSome=async (req,res)=>{
    try{
        const id =req.params.id;
        const data=await Data.findById(id);
        res.status(201).send(data);
        console.log(data);
    }
    catch{
        console.log("fail to get some tododata");
        res.status(500).send('Server error');
    }
}

const postData = async (req, res) => {
    try {
        const newData = await Data.create(req.body);
        const taskMessage = JSON.stringify({
            type: 'newTask',
            task: newData
        });

        // Broadcast the new task to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(taskMessage);
            }
        });

        res.status(201).json(newData);
    } catch (error) {
        console.error("Failed to post todo data:", error);
        res.status(400).json({ error: error.message });
    }
};
const deletDataSome=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await Data.findByIdAndDelete(id);

    }
    catch{
        console.log("fail to delete specific todo data");
        res.status(500).send('Server error');
    }
}
const deletDataAll=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await Data.deleteMany({});
        res.status(201).send(data);

    }
    catch{
        console.log("fail to delete all todo data");
        res.status(500).send('Server error');
    }
}
const putData=async (req,res)=>{
    try{
        const id =req.params.id;
        const data= await Data.replaceOne({id},req.body)
    }
    catch{
        console.log("fail to replace the todo data");
        res.status(500).send('Server error');
    }
}
const patchData=async (req,res)=>{
    try{
        const id=req.params.id;
        const data=await Data.updateOne({_id:id},req.body)
    }
    catch{

        console.log("fail to update todo data");
        res.status(500).send('Server error');
    }
}



module.exports={getDataAll,getDataSome,postData,deletDataAll,deletDataSome,putData,patchData}