// import http from 'http';
// import app from './app';
// import { WebSocketServer } from 'ws';

// const PORT = process.env.PORT || 3000;

// // Create HTTP server from the Express app
// const server = http.createServer(app);

// // Attach WebSocket server
// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//     console.log('New client connected');

//     ws.on('message', (message) => {
//         console.log(`Received: ${message}`);
//         ws.send(`Echo: ${message}`);
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// // Start the server
// server.listen(PORT, () => {
//     console.log(`HTTP server running at http://localhost:${PORT}`);
//     console.log(`WebSocket server running at ws://localhost:${PORT}`);
// });

import http from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import { WebSocket } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Store the retro board data
let retroBoardData = {
    mood: '',
    startDoing: [],
    stopDoing: [],
    continueDoing: [],
    appreciation: []
};

// WebSocket connection
wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    // Send current retro board data to the new client
    ws.send(JSON.stringify(retroBoardData));

    // Handle incoming messages from clients
    ws.on('message', (message: string) => {
        const data: { type: string; mood?: string; column?: keyof typeof retroBoardData; text?: string } = JSON.parse(message);

        if (data.type === 'updateMood') {
            if (data.mood !== undefined) {
                retroBoardData.mood = data.mood;
            }
        } else if (data.type === 'updateColumn') {
            if (data.column && data.text) {
                if (Array.isArray(retroBoardData[data.column])) {
                    (retroBoardData[data.column] as string[]).push(data.text);
                }
            }
        }

        // Broadcast updated retro board data to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(retroBoardData));
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
