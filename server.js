const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory "database"
let tasks = [];

// WebSocket server setup
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// REST API for tasks
app.post('/data', (req, res) => {
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);

    // Notify all clients about the new task
    const message = JSON.stringify({ type: 'newTask', task: newTask });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    res.status(201).json(newTask);
});

app.patch('/data/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;

        // Notify all clients about the completed task
        const message = JSON.stringify({ type: 'completedTask', taskId: id });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        res.status(200).json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.get('/data', (req, res) => {
    res.json(tasks);
});