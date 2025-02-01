import Grid from '@mui/material/Grid2';
import { Typography, Container, Divider } from '@mui/material';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useWebSocket } from '../../hooks/useWebSocket';
import AuthProvider from '../../middleware/AuthProvider';


export default function Retro() {

    const { token } = AuthProvider();
    const { retroData, updateEmoji, addReview, updateReview } = useWebSocket();

    if (!token || !retroData) {
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
                    <RetroMood moods={retroData?.moods || null} updateEmoji={updateEmoji} />
                </div>
            </div>

            <Divider />

            <Grid container spacing={1} mt={1}>
                <RetroReview
                    title="Start Doing"
                    data={retroData?.reviews?.startDoing || []}
                    addReview={(text) => addReview('startDoing', text)}
                    updateReview={(text, index) => updateReview('startDoing', text, index)}
                />
                {/* <RetroReview
                    title="Stop Doing"
                    data={retroData?.reviews?.stopDoing || []}
                    addComment={(text) => addComment('stopDoing', text)}
                />
                <RetroReview
                    title="Continue Doing"
                    data={retroData?.reviews?.continueDoing || []}
                    addComment={(text) => addComment('continueDoing', text)}
                />
                <RetroReview
                    title="Appreciation"
                    data={retroData?.reviews?.appreciation || []}
                    addComment={(text) => addComment('appreciation', text)}
                /> */}
            </Grid>
        </Container>
    );
};
