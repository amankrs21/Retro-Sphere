import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../layout/Header';
import { useAuth } from '../hooks/useAuth';
// import Footer from '../layout/Footer';
// import { FloatingEmojiProvider } from '../contexts/FloatingEmojiContext';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            logout();
        }
    }, [isAuthenticated, logout]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        // <FloatingEmojiProvider>
        //     <Header />
        //     <div style={{ marginTop: '13vh', height: '76vh', overflowY: 'auto' }}>
        //         <Outlet />
        //     </div>
        //     <Footer />
        // </FloatingEmojiProvider>
        <>
            <Header />
            <div style={{ marginTop: '9vh', height: '91vh', overflowY: 'auto' }}>
                <Outlet />
            </div>
        </>
    );
};
