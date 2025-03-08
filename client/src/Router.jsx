import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Retro from './pages/retro/Retro';
import Group from './pages/groups/Group';
import Account from './pages/account/Account';
import RetroBoard from './pages/retro/RetroBoard';
import ServerUnavl from './pages/503/ServerUnavl';
import PageNotFound from './pages/404/PageNotFound';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoutes from './middleware/PrivateRoutes';


// Router component to render the application routes
export default function Router() {

    // Login provider for Google OAuth
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
                        <Route path='/group' element={<Group />} />
                        <Route path="/retro" element={<Retro />} />
                        <Route path='/retro/:id' element={<RetroBoard />} />
                        <Route path='/account' element={<Account />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
