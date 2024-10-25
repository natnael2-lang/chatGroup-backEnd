const express = require("express");
const bodyParser = require('body-parser');
const db = require("./Connector/db");
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const Data = require("./Model/data");

const app = express();
const PORT = process.env.PORT || 3000;


db().then(() => {
    console.log('Database connected');
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


app.post("/data", async (req, res) => {
    try {
        const newData = await Data.create(req.body);
        const taskMessage = JSON.stringify({
            type: 'newTask',
            task: newData
        });

        
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(taskMessage);
            }
        });

        res.status(201).json(newData); 
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(400).json({ error: error.message }); 
    }
});


app.get("/data", async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).json(data); 
    } catch (error) {
        console.error("Failed to get all todo data:", error);
        res.status(500).send('Server error');
    }
});


app.patch("/data/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = await Data.updateOne({ _id: id }, req.body);

        if (updatedData.nModified > 0) {
            res.status(200).send('Task updated successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error("Failed to update todo data:", error);
        res.status(500).send('Server error');
    }
});