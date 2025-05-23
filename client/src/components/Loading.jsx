import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useLoading } from '../hooks/useLoading';


// Loading spinner
export default function Loading() {
    const { loading } = useLoading();

    if (!loading) {
        return null;
    }

    return (
        <Box sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(1px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}>
            <CircularProgress color="primary" size="3rem" />
        </Box>
    );
}
