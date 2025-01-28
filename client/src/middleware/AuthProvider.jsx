import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


// Use environment variables for base URL
const baseURL = "http://192.168.1.39:3000/api";
const baseWSURL = "ws://192.168.1.39:3001"


// Axios instance with default configurations
const http = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
    withCredentials: true,
});

// Axios response interceptor to handle errors
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response && error.message === "Network Error") {
            localStorage.clear();
            setTimeout(() => { window.location.href = "/503"; }, 2000);
        }
        if (error.response.status === 401) {
            localStorage.clear();
            setTimeout(() => { window.location.href = "/"; }, 1500);
        }
        return Promise.reject(error);
    }
);

export default function AuthProvider() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            if (token && await isValidToken(token)) {
                setToken(token);
                http.defaults.headers.common.Authorization = `Bearer ${token}`;
            } else { localStorage.clear(); }
        })();
    }, []);

    // Save the token in localStorage and set headers
    const saveToken = async (token) => {
        if (await isValidToken(token)) {
            setToken(token);
            localStorage.setItem("token", token);
            http.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
    };

    // Validate if the token is not expired
    const isValidToken = async (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    alert("Session expired. Please log in again.");
                    localStorage.clear();
                    navigate("/");
                    return false;
                }
                if (decodedToken) { setUserData(decodedToken); }
                return true;
            } catch (error) {
                console.error("Error decoding token:", error);
                return false;
            }
        }
        return false;
    };

    return {
        setToken: saveToken,
        isValidToken,
        baseWSURL,
        userData,
        token,
        http,
    };
}
