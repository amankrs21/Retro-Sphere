import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../layout/Header';
import { useAuth } from '../hooks/useAuth';
// import Footer from '../layout/Footer';
// import { FloatingEmojiProvider } from '../contexts/FloatingEmojiContext';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    const { isAuthLoading, isAuthenticated, http, logout } = useAuth();

    useEffect(() => {
        if (isAuthLoading || !http.defaults.headers.common.Authorization) return;
        if (!isAuthenticated) logout();
    }, [isAuthLoading, isAuthenticated, http, logout]);

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
            {!isAuthLoading && isAuthenticated && http.defaults.headers.common.Authorization ? (
                <>
                    <Header />
                    <div style={{ marginTop: '8vh', height: '92vh', overflowY: 'auto', paddingTop: '5px' }}>
                        <Outlet />
                    </div>
                </>
            ) :
                null
            }
        </>
    );
};
