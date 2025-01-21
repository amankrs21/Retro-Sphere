import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import MoodSelector from '../../components/MoodSelector';

const RetroPage: React.FC = () => {
    const [mood, setMood] = useState<string>('');
    const [thoughts, setThoughts] = useState<string>('');
    const [start, setStart] = useState<string>('');
    const [stop, setStop] = useState<string>('');
    const [appreciation, setAppreciation] = useState<string>('');

    const handleSubmit = () => {
        // Handle submission logic (e.g., WebSocket, API call)
        console.log({ mood, thoughts, start, stop, appreciation });
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Sprint Retrospective
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MoodSelector setMood={setMood} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Thoughts on Sprint"
                        multiline
                        fullWidth
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="What should we start?"
                        fullWidth
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="What should we stop?"
                        fullWidth
                        value={stop}
                        onChange={(e) => setStop(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Appreciation"
                        fullWidth
                        value={appreciation}
                        onChange={(e) => setAppreciation(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit Feedback
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default RetroPage;
