import express from "express";
import { addMember, createGroup, deleteGroup, deleteMember, fetchGroupMembers, fetchGroupRetros } from "../controller/group.controller.mjs";


const groupRoute = express.Router();


// add group route
groupRoute.post("/add", createGroup);

// fetch my groups route
groupRoute.get("/fetch", fetchGroupRetros);

// fetch group members route
groupRoute.get("/fetch/:groupId", fetchGroupMembers);

// add member to a group route
groupRoute.post("/add-member", addMember);

// delete member from a group route
groupRoute.delete("/delete-member", deleteMember);

// delete group route
groupRoute.delete("/delete/:groupId", deleteGroup);


// exporting the authRoute
export default groupRoute;
