import express from "express";
import { createGroup, fetchGroups } from "../controller/group.controller.mjs";


const groupRoute = express.Router();


// add group route
groupRoute.post("/add", createGroup);

// fetch groups route
groupRoute.get("/fetch", fetchGroups);


// exporting the authRoute
export default groupRoute;
