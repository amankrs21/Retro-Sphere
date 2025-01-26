const axios = require('axios');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const { oAuth2Client, googleBaseUrl } = require('../config/google.config');


const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const googleRes = await oAuth2Client.getToken(token);
        oAuth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`${googleBaseUrl}${googleRes.tokens.access_token}`);
        const { name, email, picture } = userRes.data;

        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({ name, email, image: picture });
        }

        const authToken = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            image: user?.image
        }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.status(200).json({ token: authToken, message: 'Login Successfull!' });
    } catch (error) {
        console.error('Google authentication failed:', error);
        res.status(400).json({ error: 'Google authentication failed' });
    }
};

module.exports = { googleLogin };
