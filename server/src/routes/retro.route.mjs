import express from "express";
import { completeRetro, createRetro, deleteRetro, getRetroData } from "../controller/retro.controller.mjs";


const retroRoute = express.Router();


// add retro route
retroRoute.post("/add", createRetro);

// retro data route
retroRoute.get("/:retroId", getRetroData);

// delete retro route
retroRoute.delete("/delete/:retroId", deleteRetro);

// mark as completed route
retroRoute.patch("/status/:retroId", completeRetro);

// exporting the retroRoute
export default retroRoute;
