import { Outlet } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { FloatingEmojiProvider } from '../contexts/FloatingEmojiContext';

export default function PrivateRoutes() {

    return (
        <FloatingEmojiProvider>
            <Header />
            <div style={{ marginTop: '13vh', height: '76vh', overflowY: 'auto' }}>
                <Outlet />
            </div>
            <Footer />
        </FloatingEmojiProvider>
    );
};
