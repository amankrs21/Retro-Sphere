import express from "express";

import authRoute from "./auth.route.mjs";
import groupRoute from "./group.route.mjs";
import validSession from "../middleware/session.middleware.mjs";


const router = express.Router();


// health check route
router.get("/health", (req, res) => {
    res.send("Health of Retro-Sphere Server is up and running!");
});


// auth route
router.use("/auth", authRoute);


// group route
router.use("/group", validSession, groupRoute);


// exporting the router
export default router;
