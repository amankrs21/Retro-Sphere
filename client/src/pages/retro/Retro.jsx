import Grid from '@mui/material/Grid2';
import { Typography, Container, Divider } from '@mui/material';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useWebSocket } from '../../hooks/useWebSocket';
import AuthProvider from '../../middleware/AuthProvider';


export default function Retro() {

    const { token } = AuthProvider();
    const { retroData, updateEmoji, addComment } = useWebSocket();

    if (!token) {
        return <div>Please log in to access the retro board.</div>;
    }

    return (
        <Container maxWidth="xl">
            <div className="retro-header">
                <div className="retro-header-title">
                    <Typography variant="h4" gutterBottom>
                        Retro-Board
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        How do you feel about the sprint?
                    </Typography>
                </div>
                <div>
                    <RetroMood emojis={retroData?.emojis || null} updateEmoji={updateEmoji} />
                </div>
            </div>

            <Divider />

            <Grid container spacing={1} mt={1}>
                <RetroReview
                    title="Start Doing"
                    data={retroData?.comments?.startDoing || []}
                    addComment={(text) => addComment('startDoing', text)}
                />
                <RetroReview
                    title="Stop Doing"
                    data={retroData?.comments?.stopDoing || []}
                    addComment={(text) => addComment('stopDoing', text)}
                />
                <RetroReview
                    title="Continue Doing"
                    data={retroData?.comments?.continueDoing || []}
                    addComment={(text) => addComment('continueDoing', text)}
                />
                <RetroReview
                    title="Appreciation"
                    data={retroData?.comments?.appreciation || []}
                    addComment={(text) => addComment('appreciation', text)}
                />
            </Grid>
        </Container>
    );
};
