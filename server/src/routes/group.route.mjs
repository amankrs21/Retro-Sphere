import express from "express";
import { createGroup, fetchGroupMembers, fetchMyGroups } from "../controller/group.controller.mjs";


const groupRoute = express.Router();


// add group route
groupRoute.post("/add", createGroup);

// fetch my groups route
groupRoute.get("/fetch", fetchMyGroups);


// fetch group members route
groupRoute.get("/fetch/:groupId", fetchGroupMembers);


// exporting the authRoute
export default groupRoute;
