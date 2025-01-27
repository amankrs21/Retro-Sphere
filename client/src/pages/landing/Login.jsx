import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { Button, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Typewriter from "typewriter-effect";
import LoginIcon from '@mui/icons-material/Login';

import './Login.css';


export default function Login() {

    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        try {
            console.log(authResult);
            if (authResult["code"]) {
                const response = await axios.post('http://localhost:3000/api/auth/google-login', {
                    token: authResult["code"]
                });
                localStorage.setItem('token', response?.data?.token);
                navigate('/home');
            } else {
                console.log(authResult);
                throw new Error(authResult);
            }
        } catch (e) {
            console.log('Error while Google Login...', e);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                size={{ xs: false, sm: false, md: 7 }}
                sx={{
                    backgroundImage: 'url(./login2.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid size={{ xs: 12, sm: 12, md: 5 }} elevation={6} className="login-container">
                <div className='landing'>
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
                </div>
            </Grid>
        </Grid>
    );
}
