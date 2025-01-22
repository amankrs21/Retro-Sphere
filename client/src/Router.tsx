import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RetroPage from './pages/retro/Retro';
import PrivateRoutes from './middleware/PrivateRoutes';
import PageNotFound from './components/PageNotFound';


const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to='/retro' />} />
                <Route path='*' element={<Navigate to='/404' />} />
                <Route path="/404" element={<PageNotFound />} />
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path="/retro" element={<RetroPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
