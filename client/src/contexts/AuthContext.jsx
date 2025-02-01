/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import axios from 'axios';


// Create context with proper typing
const AuthContext = createContext({
    token: null,
    userData: null,
    http: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    baseURL: '',
    baseWSURL: ''
});
export { AuthContext };

// Export the context
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [userData, setUserData] = useState(null);

    const http = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
            withCredentials: true,
        });

        instance.interceptors.response.use(
            response => response,
            error => {
                if (!error.response && error.message === "Network Error") {
                    // Network error
                    localStorage.clear();
                    navigate("/503");
                } else if (error.response.status === 401) {
                    // Unauthorized
                    localStorage.clear();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );
        return instance;
    }, [navigate]);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) return;

            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    http.defaults.headers.common.Authorization = `Bearer ${token}`;
                    setUserData(decoded);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        };

        validateToken();
    }, [token, http]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserData(null);
        delete http.defaults.headers.common.Authorization;
        navigate('/login');
    };

    const value = useMemo(() => ({
        token,
        userData,
        http,
        isAuthenticated: !!token,
        login,
        logout,
        baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
        baseWSURL: import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001'
    }), [token, userData, http]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
