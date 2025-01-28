const cors = require("cors");
const express = require("express");

const router = require("./routes/index.route");
const mongoConnect = require("./config/db.config");
const errorHandler = require("./middleware/error.handler");


const app = express();

// Disable x-powered-by header to prevent version disclosure
app.disable("x-powered-by");

// Parse incoming JSON requests
app.use(express.json());


// Connect to the database
mongoConnect();


// Middleware to log all requests
app.use((req, res, next) => {
    if (req.method !== "OPTIONS" || process.env.NODE_ENV === "development") {
        console.info(`${Date().slice(4, 24)} [${req.method}] http://${req.ip}${req.url}`);
    }
    next();
});


// Configure CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.1.39:5173"
];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    exposedHeaders: "Authorization",
    methods: "GET,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));


// Set up routes
app.use("/api", router);


// Error-handling middleware
app.use(errorHandler);


// Export the Express app
module.exports = app;
