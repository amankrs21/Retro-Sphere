import express from "express";

import { googleLogin, userLogin, userRegister } from "../controller/auth.controller.mjs";


const authRoute = express.Router();


// normal login route
authRoute.post("/login", userLogin);

// register route
authRoute.post("/register", userRegister);

// google login route
authRoute.post("/google-login", googleLogin);


// exporting the authRoute
export default authRoute;
