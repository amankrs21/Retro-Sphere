import React from 'react';
import { Button, Grid, Typography } from '@mui/material';

const MoodSelector: React.FC<{ setMood: React.Dispatch<React.SetStateAction<string>> }> = ({ setMood }) => {
    const moods = ['😀', '🙂', '😐', '😞', '😡'];

    return (
        <div>
            <Typography variant="h6">How do you feel about the sprint?</Typography>
            <Grid container spacing={2}>
                {moods.map((mood, index) => (
                    <Grid item key={index}>
                        <Button
                            variant="outlined"
                            onClick={() => setMood(mood)}
                            style={{ fontSize: '2rem', minWidth: '60px' }}
                        >
                            {mood}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default MoodSelector;
