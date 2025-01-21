import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RetroPage from './pages/retro/Retro';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RetroPage />} />
                {/* You can add more routes here in the future */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
