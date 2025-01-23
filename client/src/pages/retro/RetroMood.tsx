import React from 'react';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { useFloatingEmoji } from '../../contexts/FloatingEmojiContext';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -21px;
    right: -48px;
  }
`;

interface MoodSelectorProps {
    mood: string;
    updateMood: (mood: string) => void;
}

const RetroMood: React.FC<MoodSelectorProps> = ({ mood, updateMood }) => {
    const { triggerEmoji } = useFloatingEmoji();
    const moods = ['😀', '🙂', '😐', '😞', '😡'];

    return (
        <Grid container spacing={2}>
            {moods.map((emoji) => (
                <Grid key={emoji}>
                    <Button
                        variant={emoji === mood ? 'contained' : 'outlined'}
                        onClick={() => {
                            updateMood(emoji);
                            triggerEmoji(emoji); // Trigger floating emoji animation
                        }}
                        style={{ fontSize: '2rem', minWidth: '60px' }}
                    >
                        <CartBadge badgeContent={2} color="success" overlap="circular" />
                        {emoji}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
};

export default RetroMood;
