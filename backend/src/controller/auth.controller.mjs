import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

import UserModel from "../models/user.model.mjs";
import { validateFields } from "../utils/validate.mjs";
import { oAuth2Client, googleBaseUrl } from "../config/google.config.mjs";


// Hash passwords
const hashPassword = async (password) => bcrypt.hash(password, 10);


// Find user by email
const findUserByEmail = async (email) => {
    const sanitizedEmail = validator.trim(validator.normalizeEmail(email));
    if (!validator.isEmail(sanitizedEmail)) {
        throw new Error("Invalid email format!");
    }
    return await UserModel.findOne({ email: sanitizedEmail });
};


// function to login user
const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const fieldValidation = validateFields({ email, password });
        if (!fieldValidation.isValid) {
            return res.status(400).json({ message: fieldValidation.message });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Bad Credentials!" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Bad Credentials!" });
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            image: user?.image
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, message: 'Login Successfull!' });

    } catch (error) {
        next(error);
    }
};


// function to register user
const userRegister = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const fieldValidation = validateFields({ name, email, password });
        if (!fieldValidation.isValid) {
            return res.status(400).json({ message: fieldValidation.message });
        }
        if (await findUserByEmail(email)) {
            return res.status(409).json({ message: "Email Already Exist!!" });
        }

        const user = new UserModel({
            name,
            email: email.toLowerCase(),
            password: await hashPassword(password),
            image: req.body?.image ?? null,
        });
        await user.save();
        return res.status(201).json({ message: "User Registered Successfully!!" });
    } catch (error) {
        next(error);
    }
};


// function to login user with google
const googleLogin = async (req, res, next) => {
    try {
        const { token: authCode } = req.body;

        // Exchange auth code for access token
        const { tokens } = await oAuth2Client.getToken(authCode);
        oAuth2Client.setCredentials(tokens);

        // Get user info
        const userRes = await axios.get(googleBaseUrl, {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        // Extract user info
        const { name, email, picture } = userRes.data;

        // Check if user exists
        let user = await findUserByEmail(email);
        if (!user) {
            user = await UserModel.create({ name, email, image: picture, password: null });
        }

        // Generate JWT token
        const authToken = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            image: user?.image
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token: authToken, message: 'Login Successfull!' });
    } catch (error) {
        next(error);
    }
};



// export all functions
export { userLogin, userRegister, googleLogin };
