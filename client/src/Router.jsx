import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Retro from './pages/retro/Retro';
import Login from './pages/login/Login';
import ServerUnavl from './components/ServerUnavl';
import PageNotFound from './components/PageNotFound';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoutes from './middleware/PrivateRoutes';


export default function Router() {

    const loginProvider = () => {
        return (
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <Login />
            </GoogleOAuthProvider>
        )
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/404" element={<PageNotFound />} />
                    <Route path="/503" element={<ServerUnavl />} />
                    <Route path="/login" element={loginProvider()} />
                    <Route path='*' element={<Navigate to='/404' />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/" element={<PrivateRoutes />}>
                        <Route path='/home' element={<Home />} />
                        <Route path="/retro" element={<Retro />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
