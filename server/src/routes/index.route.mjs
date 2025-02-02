import express from "express";

import authRoute from "./auth.route.mjs";


const router = express.Router();


// health check route
router.get("/health", (req, res) => {
    res.send("Health of Retro-Sphere Server is up and running!");
});


// auth route
router.use("/auth", authRoute);


// exporting the router
export default router;
