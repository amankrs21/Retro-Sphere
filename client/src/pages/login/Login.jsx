import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import {
    IconButton, InputAdornment, Avatar, Typography, TextField, Button
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import Typewriter from "typewriter-effect";
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import './Login.css';
import { useLoading } from '../../hooks/useLoading';
import AuthProvider from '../../middleware/AuthProvider';


export default function Login() {

    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [show, setShow] = useState(false);
    // const [openFP, setOpenFP] = useState(false);
    const { http, setToken, isValidToken } = AuthProvider();
    const [formData, setFormData] = useState({ email: '', password: '' });


    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token') || null;
            if (token && await isValidToken(token)) { navigate('/home'); }
        })();
    }, []);


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
                setToken(response.data.token);
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
                localStorage.setItem('token', response.data.token);
                toast.success(response.data.message);
                navigate('/home');
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
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                size={{ xs: false, sm: false, md: 8 }}
                sx={{
                    backgroundImage: 'url(./login.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid size={{ xs: 12, sm: 12, md: 4 }} elevation={6} className="login-container">
                {/* <div className='landing'>
                    <Typography variant="h4" sx={{ pb: 1 }} className="heading">
                        Hey There!{' '}
                        <span className="landing-wave" role="img" aria-labelledby="wave">
                            👋🏻
                        </span>
                    </Typography>
                    <Typography variant="h5" gutterBottom color='primary' fontWeight={500} sx={{ mt: 6 }}>
                        <Typewriter
                            options={{
                                strings: [
                                    'Welcome to Retro-Sphere 🤖',
                                    'A place to share your thoughts',
                                    'A place to connect with others',
                                ],
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 50,
                            }}
                        />
                    </Typography>

                    <Button
                        sx={{ mt: 6 }}
                        color="primary"
                        variant="contained"
                        onClick={googleLogin}
                    >
                        <div className='google-btn'>
                            <LoginIcon sx={{ mr: 1 }} />
                            Login with Google
                        </div>
                    </Button>
                </div> */}
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
                            sx={{ mt: 3, mb: 6 }}
                        >
                            Sign In &nbsp; <LoginIcon />
                        </Button>

                        <Grid sx={{ textAlign: "center" }}>
                            {/* <Button variant="text" onClick={() => navigate("/register")}>
                                Don&apos;t have an account? Sign Up
                            </Button> */}

                            {/* <div className='google-btn'>
                                <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
                            </div> */}

                            <Typography variant="body2" color="textSecondary" sx={{ my: 1 }}>
                                Or continue with
                            </Typography>

                            <Button sx={{ mt: 2 }} variant="outlined" color="primary" onClick={googleLogin}>
                                <GoogleIcon sx={{ mr: 1 }} />
                                Login with Google
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
