const express = require("express");
const { googleLogin } = require("../controller/auth.controller");
const { retroDataModel } = require("../controller/retro.controller");

const router = express.Router();


// health check route
router.get("/health", (req, res) => {
    res.send("Health of Retro-Sphere Server is up and running!");
});


// auth google route
router.post("/auth/google-login", googleLogin);


// retro routes
router.get("/retro", retroDataModel);


module.exports = router;
