import dotenv from "dotenv";

import { Server } from "socket.io";
import { createServer } from "http";

import app from "./app.mjs";
import mongoConnect from "./config/mongo.config.mjs";
import { setupSocket } from "./websocket/index.ws.mjs";


// Load environment variables from .env file
dotenv.config();

// Set the port to the environment variable or 3001
const port = process.env.PORT ?? 3001;

// Check if all the necessary environment keys are provided
const requiredEnvVars = ["MONGO_URL", "GOOGLE_CLIENT_ID", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }
});


// Connect to the database
mongoConnect();


// Create server with Express app and HTTP
const httpServer = createServer(app);


// Start WebSocket server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN.split(","),
        methods: ["GET", "POST"]
    },
});

// Set up WebSocket
setupSocket(io);

// Start the server
httpServer.listen(port, "0.0.0.0", () => {
    console.info(`\x1b[36m☠️  SERVER STARTED AT PORT: ${port}\x1b[0m`); // Cyan text
    // console.warn("\x1b[33m⚠️ SERVER STARTED AT PORT: `8080`\x1b[0m"); // Yellow text
});
