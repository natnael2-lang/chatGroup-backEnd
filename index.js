const express = require("express");
const session = require('express-session');
const routerTodoList = require("./Router/toDoData");
const routerUser = require("./Router/user");
const bodyParser = require('body-parser');
const db = require("./Connector/db");
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const Data = require("./Model/data");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
db().then(() => {
    console.log('Database connected');
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'nat-mes12',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 900000 // 15 minutes
    }
}));

const checkCookieAndRedirect = (req, res, next) => {
    if (req.session.userId || req.cookies.username) {
        return res.redirect('/home');
    } else {
        return res.redirect('/login');
    }
};

// Uncomment these routes if needed
/*
app.get('/', checkCookieAndRedirect);
app.get('/home', (req, res) => {
    res.send("Welcome to the Homepage!");
});
app.get('/login', (req, res) => {
    res.send("Please log in!");
});
*/

// Uncomment these if you are using these routers
// app.use("/data", routerTodoList);
// app.use("/user", routerUser);

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket server setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        // Broadcast incoming message to all connected clients
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

// Endpoint to create a new task
app.post("/data", async (req, res) => {
    try {
        const newData = await Data.create(req.body);
        const taskMessage = JSON.stringify({
            type: 'newTask',
            task: newData
        });

        // Broadcast new task to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(taskMessage);
            }
        });

        res.status(201).json(newData); // Respond with the created task
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(400).json({ error: error.message }); // Respond with an error message
    }
});

// Endpoint to get all tasks
app.get("/data", async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).json(data); // Use status 200 for successful GET requests
    } catch (error) {
        console.error("Failed to get all todo data:", error);
        res.status(500).send('Server error');
    }
});

// Endpoint to update a task
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