import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from "./Router";

export default function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ToastContainer theme="colored" draggable={false} hideProgressBar={true} position="bottom-right" />
      <Router />
    </GoogleOAuthProvider>
  )
}


{/* <LoadingProvider>
      <Loading />
      <ToastContainer theme="colored" draggable={false} hideProgressBar={true} position="bottom-right" />
      <ErrorBoundary fallback={<ErrorPage />}>
        <App />
      </ErrorBoundary>
    </LoadingProvider> */}