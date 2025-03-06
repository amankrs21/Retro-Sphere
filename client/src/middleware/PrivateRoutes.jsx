import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../layout/Header';
import { useAuth } from '../hooks/useAuth';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    const { isAuthLoading, isAuthenticated, http, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) logout();
        if (isAuthLoading || !http.defaults.headers.common.Authorization) return;
    }, [isAuthLoading, isAuthenticated, http, logout]);

    if (!isAuthenticated) {
        return null;
    }

    return (
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
