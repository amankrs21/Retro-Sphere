import http from 'http';
import app from './app';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3000;

// Create HTTP server from the Express app
const server = http.createServer(app);

// Attach WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`HTTP server running at http://localhost:${PORT}`);
    console.log(`WebSocket server running at ws://localhost:${PORT}`);
});
