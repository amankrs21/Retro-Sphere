import React from 'react';
import { Button, Grid, Typography } from '@mui/material';

interface MoodSelectorProps {
    mood: string;
    updateMood: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ mood, updateMood }) => {
    const moods = ['😀', '🙂', '😐', '😞', '😡'];

    return (
        <div>
            <Typography variant="h6">How do you feel about the sprint?</Typography>
            <Grid container spacing={2}>
                {moods.map((emoji) => (
                    <Grid item key={emoji}>
                        <Button
                            variant={emoji === mood ? 'contained' : 'outlined'}
                            onClick={() => updateMood(emoji)}
                            style={{ fontSize: '2rem', minWidth: '60px' }}
                        >
                            {emoji}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default MoodSelector;
