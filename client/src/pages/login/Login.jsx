import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import {
    Card,
    IconButton, InputAdornment, Avatar, Typography, TextField, Button
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import './Login.css';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import ParticleBackground from '../../components/ParticleBackground';


// Login page component
export default function Login() {

    document.title = "Retro | Login";

    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [show, setShow] = useState(false);
    const { http, login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await http.post('/auth/login', formData);
            if (response.data.token) {
                login(response.data.token);
                toast.success(response.data.message);
                navigate('/home');
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message ?? 'An error occurred');
        } finally { setLoading(false); }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (authResult) => {
            try {
                setLoading(true);
                const response = await http.post('/auth/google-login', { token: authResult.code });
                if (response.data.token) {
                    login(response.data.token);
                    toast.success(response.data.message);
                    navigate('/home');
                }
            } catch (error) {
                console.error("Google login failed:", error);
                toast.error('Error during Google login');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            toast.error('Google login failed');
        },
        flow: "auth-code",
    });


    return (
        <div className="login-container">
            <ParticleBackground />
            <Card className="login-card" elevation={10}>
                <Box className="login-box">
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleLogin}>
                        <TextField
                            autoFocus
                            fullWidth
                            required
                            type='email'
                            name="email"
                            label="Email Address"
                            sx={{ my: 3 }}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            onChange={handleChange}
                            value={formData.password}
                            type={show ? 'text' : 'password'}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShow(!show)} edge="end">
                                                {show ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            type='submit'
                            variant="contained"
                            sx={{ mt: 3, mb: 4 }}
                        >
                            Sign In &nbsp; <LoginIcon />
                        </Button>

                        <Grid sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="textSecondary" sx={{ my: 1 }}>
                                Or continue with
                            </Typography>

                            <Button sx={{ my: 1 }} variant="outlined" color="primary" onClick={googleLogin}>
                                <GoogleIcon sx={{ mr: 1 }} />
                                Login with Google
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        </div>
    );
}
