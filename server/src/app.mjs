import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import router from "./routes/index.route.mjs";
import errorHandler from "./middleware/error.handler.mjs";


dotenv.config();
const app = express();

// Disable x-powered-by header to prevent version disclosure
app.disable("x-powered-by");

// Parse incoming JSON requests
app.use(express.json());


// Middleware to log all requests
app.use((req, res, next) => {
    if (req.method !== "OPTIONS" || process.env.NODE_ENV === "development") {
        console.info(`${Date().slice(4, 24)} [${req.method}] http://${req.ip}${req.url}`);
    }
    next();
});


// Configure CORS
const allowedOrigins = process.env.CORS_ORIGIN.split(",");
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    exposedHeaders: "Authorization",
    methods: "GET,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));


// Set up routes
app.use("/", express.static("public"));
app.use("/api", router);


// Error-handling middleware
app.use(errorHandler);


// Export the Express app
export default app;
