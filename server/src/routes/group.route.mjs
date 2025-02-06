import express from "express";
import { createGroup, fetchMyGroups } from "../controller/group.controller.mjs";


const groupRoute = express.Router();


// add group route
groupRoute.post("/add", createGroup);

// fetch my groups route
groupRoute.get("/fetch", fetchMyGroups);


// exporting the authRoute
export default groupRoute;
