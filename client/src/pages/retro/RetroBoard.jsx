import Grid from '@mui/material/Grid2';
import { Typography, Container, Divider, Card } from '@mui/material';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useAuth } from '../../hooks/useAuth';
import { useRetroSocket } from '../../hooks/useRetroSocket';


// RetroBoard page component
export default function RetroBoard() {

    const retroId = "0987654321";
    const { isAuthenticated } = useAuth();
    const { retroData, updateMood, addReview, updateReview } = useRetroSocket(retroId);

    if (!isAuthenticated) {
        return null;
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
                    <RetroMood moods={retroData?.moods ?? []} updateMood={updateMood} />
                </div>
            </div>

            <Divider />

            <Card raised elevation={1} sx={{ mt: 1, p: 1 }}>
                <Grid container spacing={1}>
                    <RetroReview
                        title="Start Doing"
                        data={retroData?.reviews?.startDoing || []}
                        addReview={(text) => addReview('startDoing', text)}
                        updateReview={(text, index) => updateReview('startDoing', text, index)}
                    />

                    <RetroReview
                        title="Stop Doing"
                        data={retroData?.reviews?.stopDoing || []}
                        addReview={(text) => addReview('stopDoing', text)}
                        updateReview={(text, index) => updateReview('stopDoing', text, index)}
                    />

                    <RetroReview
                        title="Continue Doing"
                        data={retroData?.reviews?.continueDoing || []}
                        addReview={(text) => addReview('continueDoing', text)}
                        updateReview={(text, index) => updateReview('continueDoing', text, index)}
                    />

                    <RetroReview
                        title="Appreciation"
                        data={retroData?.reviews?.appreciation || []}
                        addReview={(text) => addReview('appreciation', text)}
                        updateReview={(text, index) => updateReview('appreciation', text, index)}
                    />
                </Grid>
            </Card>
        </Container>
    );
};
