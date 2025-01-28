// import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from "./Router";
import { LoadingProvider } from './contexts/LoadingContext';
import Loading from './components/Loading';

export default function App() {

  return (
    <LoadingProvider>
      <Loading />
      <ToastContainer theme="colored" draggable={false} hideProgressBar={true} position="bottom-right" />
      <Router />
    </LoadingProvider>
  )
}


{/* <LoadingProvider>
      <Loading />
      <ToastContainer theme="colored" draggable={false} hideProgressBar={true} position="bottom-right" />
      <ErrorBoundary fallback={<ErrorPage />}>
        <App />
      </ErrorBoundary>
    </LoadingProvider> */}