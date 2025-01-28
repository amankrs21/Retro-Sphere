// import React from 'react';
// import Grid from '@mui/material/Grid2';
// import { Button } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Badge, { badgeClasses } from '@mui/material/Badge';
// import { useFloatingEmoji } from '../../contexts/FloatingEmojiContext';

// const CartBadge = styled(Badge)`
//   & .${badgeClasses.badge} {
//     top: -21px;
//     right: -48px;
//   }
// `;

// interface MoodSelectorProps {
//     mood: string;
//     updateMood: (mood: string) => void;
//     emojiFeedback?: Record<string, number>; // Optional to handle undefined cases
//     currentSelection: string | null;
// }

// const RetroMood: React.FC<MoodSelectorProps> = ({ mood, updateMood, emojiFeedback = {}, currentSelection }) => {
//     const { triggerEmoji } = useFloatingEmoji();
//     const moods = ['😀', '🙂', '😐', '😞', '😡'];

//     return (
//         <Grid container spacing={2}>
//             {moods.map((emoji) => (
//                 <Grid key={emoji}>
//                     <Button
//                         variant={emoji === currentSelection ? 'contained' : 'outlined'}
//                         onClick={() => {
//                             updateMood(emoji);
//                             triggerEmoji(emoji); // Trigger floating emoji animation
//                         }}
//                         style={{ fontSize: '2rem', minWidth: '60px' }}
//                     >
//                         <CartBadge
//                             badgeContent={emojiFeedback[emoji] || 0} // Use default 0 if undefined
//                             color="success"
//                             overlap="circular"
//                         />
//                         {emoji}
//                     </Button>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default RetroMood;





import { useState } from 'react';
import PropTypes from 'prop-types';

const emojis = ['👍', '❤️', '🎉', '😂', '😢'];

export default function RetroMood({ emojiFeedback, team, userName }) {
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const handleEmojiClick = (emoji) => {
        const ws = new WebSocket('ws://localhost:3001');
        ws.onopen = () => {
            ws.send(
                JSON.stringify({ team, type: 'emojiReaction', emoji, user: userName })
            );
        };
        setSelectedEmoji(emoji);
    };

    return (
        <div>
            <h3>How do you feel?</h3>
            {emojis.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    style={{ fontWeight: selectedEmoji === emoji ? 'bold' : 'normal' }}
                >
                    {emoji} ({emojiFeedback[emoji] || 0})
                </button>
            ))}
        </div>
    );
};

RetroMood.propTypes = {
    emojiFeedback: PropTypes.object.isRequired,
    team: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired
};
