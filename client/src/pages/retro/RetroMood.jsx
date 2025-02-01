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

export default function RetroMood({ moods, updateEmoji }) {

    const { userData } = AuthProvider();
    const [curEmoji, setCurEmoji] = useState(null);
    const emojis = ['😡', '😠', '😐', '🙂', '🤩'];

    const onMoodUpdate = (emoji) => {
        setCurEmoji(emoji);
        updateEmoji(emoji);
    };

    useEffect(() => {
        if (moods) {
            const userEmoji = moods.find((data) => data?.users?.includes(userData?.email))?.emoji;
            setCurEmoji(userEmoji);
        }
    }, [moods, userData?.email]);

    if (!moods) {
        return <div>No emojis available.</div>;
    }

    return (
        <Grid container spacing={2}>
            {moods.map((data, index) => (
                <Grid key={index}>
                    <Button
                        variant={data?.emoji === curEmoji ? 'contained' : 'outlined'}
                        onClick={() => { onMoodUpdate(data?.emoji) }}
                        style={{ fontSize: '2rem' }}
                    >
                        <CartBadge
                            color="secondary"
                            overlap="circular"
                            badgeContent={`${data?.users?.length ?? 0}`}
                        />
                        {data?.emoji}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
};

RetroMood.propTypes = {
    moods: PropTypes.array.isRequired,
    updateEmoji: PropTypes.func.isRequired,
};
