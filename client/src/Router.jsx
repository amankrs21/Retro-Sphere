import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Retro from './pages/retro/Retro';
import Login from './pages/landing/Login';
import PrivateRoutes from './middleware/PrivateRoutes';
import PageNotFound from './components/PageNotFound';


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/404" element={<PageNotFound />} />
                <Route path='*' element={<Navigate to='/404' />} />
                <Route path="/" element={<Navigate to="/retro" />} />
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path='/home' element={<Home />} />
                    <Route path="/retro" element={<Retro />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
