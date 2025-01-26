import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.WS_PORT || 3001 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        ws.send(`Echo: ${message}`);
    });

    ws.send('Welcome to Retro-Sphere Server!');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
