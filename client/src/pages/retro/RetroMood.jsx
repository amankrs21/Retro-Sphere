import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';

import AuthProvider from '../../middleware/AuthProvider';


const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -21px;
    right: -44px;
  }
`;

export default function RetroMood({ emojis, updateEmoji }) {

    const { userData } = AuthProvider();
    const [curEmoji, setCurEmoji] = useState(null);

    const onMoodUpdate = (emoji) => {
        setCurEmoji(emoji);
        updateEmoji(emoji);
    };

    useEffect(() => {
        if (emojis) {
            const userEmoji = Object.keys(emojis).find((emoji) => emojis[emoji].users.includes(userData.email));
            setCurEmoji(userEmoji);
        }
    }, [emojis]);

    if (!emojis || typeof emojis !== 'object') {
        return <div>No emojis available.</div>;
    }

    return (
        <Grid container spacing={2}>
            {Object.keys(emojis).map((emoji) => (
                <Grid key={emoji}>
                    <Button
                        variant={emoji === curEmoji ? 'contained' : 'outlined'}
                        onClick={() => { onMoodUpdate(emoji) }}
                        style={{ fontSize: '2rem' }}
                    >
                        <CartBadge
                            color="secondary"
                            overlap="circular"
                            badgeContent={`${emojis[emoji].users.length ?? 0}`}
                        />
                        {emoji}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
};

RetroMood.propTypes = {
    emojis: PropTypes.object,
    updateEmoji: PropTypes.func.isRequired,
};
