require("dotenv").config();
const http = require("http");

const app = require("./app");


// Check if all the necessary environment keys are provided
const requiredEnvVars = ["MONGO_URL", "GOOGLE_CLIENT_ID", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }
});


// Start WebSocket server
require("./websocket/index.ws");


// Get PORT from environment or use default
const port = process.env.PORT ?? 3000;


// Create server with Express app and HTTP
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
    console.info(`Express Server started on PORT: ${port}`);
});
