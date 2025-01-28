import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';
// import Footer from '../layout/Footer';
// import { FloatingEmojiProvider } from '../contexts/FloatingEmojiContext';

export default function PrivateRoutes() {

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
            <div style={{ marginTop: '7vh', height: '93vh', overflowY: 'auto' }}>
                <Outlet />
            </div>
        </>
    );
};
