import jwt from "jsonwebtoken";

// function to validate user
export async function validateUser(token) {

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}
