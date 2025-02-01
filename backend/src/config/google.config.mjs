import dotconfig from 'dotenv';
import { google } from 'googleapis';


dotconfig.config();


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


// OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage"
);


// Google User Info API Endpoint
const googleBaseUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";


// Export
export { oAuth2Client, googleBaseUrl };
