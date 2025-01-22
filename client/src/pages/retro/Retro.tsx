import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Button, TextField } from '@mui/material';
import { useWebSocket } from '../../hooks/useWebSocket';
import RetroColumn from '../../components/RetroColumn';
import MoodSelector from '../../components/MoodSelector';

const RetroPage: React.FC = () => {
    const { retroBoardData, updateMood, updateColumn } = useWebSocket('ws://localhost:3000');
    const [appreciationText, setAppreciationText] = useState('');

    const handleAppreciationSubmit = () => {
        updateColumn('appreciation', appreciationText);
        setAppreciationText('');
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Sprint Retrospective - Retro Sphere
            </Typography>

            <MoodSelector mood={retroBoardData.mood} updateMood={updateMood} />

            <Grid container spacing={3}>
                <RetroColumn
                    title="Start Doing"
                    data={retroBoardData.startDoing}
                    updateColumn={(text: string) => updateColumn('startDoing', text)}
                />
                <RetroColumn
                    title="Stop Doing"
                    data={retroBoardData.stopDoing}
                    updateColumn={(text: string) => updateColumn('stopDoing', text)}
                />
                <RetroColumn
                    title="Continue Doing"
                    data={retroBoardData.continueDoing}
                    updateColumn={(text: string) => updateColumn('continueDoing', text)}
                />
                <RetroColumn
                    title="Appreciation"
                    data={retroBoardData.appreciation}
                    updateColumn={(text: string) => updateColumn('appreciation', text)}
                />
            </Grid>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Appreciation"
                        fullWidth
                        value={appreciationText}
                        onChange={(e) => setAppreciationText(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAppreciationSubmit}
                        style={{ marginTop: '10px' }}
                    >
                        Add Appreciation
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default RetroPage;
