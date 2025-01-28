import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


import AuthUser from './AuthProvider';
import Header from '../layout/Header';
import { useLoading } from '../hooks/useLoading';
// import Footer from '../layout/Footer';
// import { FloatingEmojiProvider } from '../contexts/FloatingEmojiContext';

export default function PrivateRoutes() {

    const navigate = useNavigate();
    const { isValidToken } = AuthUser();
    const { setLoading } = useLoading();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token || !(await isValidToken(token))) {
                localStorage.clear();
                navigate('/login');
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();
    }, [navigate, setLoading]);

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
