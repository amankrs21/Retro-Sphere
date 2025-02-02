import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from "./Router";
import Loading from './components/Loading';
import ErrorPage from './components/ErrorPage';
import ErrorBoundary from './middleware/ErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';


// App component to render the application
export default function App() {

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <LoadingProvider>
        <Loading />
        <Router />
      </LoadingProvider>
      <ToastContainer theme="colored" draggable={false} hideProgressBar={true} position="bottom-right" />
    </ErrorBoundary>
  )
}
