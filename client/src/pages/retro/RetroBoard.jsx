import Grid from '@mui/material/Grid2';
import Typewriter from "typewriter-effect";
import { Typography, Container, Divider, Card } from '@mui/material';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useAuth } from '../../hooks/useAuth';
import { useRetroSocket } from '../../hooks/useRetroSocket';


// RetroBoard page component
export default function RetroBoard() {

    document.title = "Retro-Board | PIM Essentials";

    const retroId = "0987654321";
    const { isAuthenticated } = useAuth();
    const { retroData, updateMood, addReview, updateReview } = useRetroSocket(retroId);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container maxWidth="xl">
            <Grid container className="retro-header" spacing={0}>
                <Grid
                    size={{ xs: 12, md: 5 }}
                    className="retro-header-title"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "center", md: "flex-start" },
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Retro-Board | PIM Essentials
                    </Typography>
                    <Typography variant="subtitle1" color='warning' gutterBottom>
                        <Typewriter
                            options={{
                                strings: [
                                    'Welcome to Retro-Board 🤖',
                                    'How do you feel about the sprint?',
                                    'Share your thoughts, ideas, and feedback',
                                ],
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 50,
                            }}
                        />

                    </Typography>
                </Grid>

                <Grid
                    size={{ xs: 12, md: 7 }}
                    sx={{
                        display: "flex",
                        alignItems: { xs: "center", md: "flex-end" },
                        justifyContent: { xs: "center", md: "flex-end" },
                    }}
                >
                    <RetroMood moods={retroData?.moods ?? []} updateMood={updateMood} />
                </Grid>
            </Grid>


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
