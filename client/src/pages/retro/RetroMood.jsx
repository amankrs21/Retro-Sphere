import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import { Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { useAuth } from '../../hooks/useAuth';

// Custom styled component
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -21px;
    right: -44px;
  }
`;


// RetroMood component
export default function RetroMood({ moods, isCompleted, updateMood }) {

    const { userData } = useAuth();
    const [curEmoji, setCurEmoji] = useState(null);

    const onMoodUpdate = (emoji) => {
        if (isCompleted) return;
        setCurEmoji(emoji);
        updateMood(emoji);
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
        <Grid container spacing={1}>
            {moods.map((data) => (
                <Grid key={data?.emoji}>
                    <Tooltip arrow title={data?.users?.join(', ')}>
                        <Button
                            variant={data?.emoji === curEmoji ? 'contained' : 'outlined'}
                            onClick={() => { onMoodUpdate(data?.emoji) }}
                            style={{ fontSize: '2rem' }}
                            disabled={isCompleted}
                        >
                            <CartBadge
                                color="secondary"
                                overlap="circular"
                                badgeContent={`${data?.users?.length ?? 0}`}
                            />
                            {data?.emoji}
                        </Button>
                    </Tooltip>
                </Grid>
            ))}
        </Grid>
    );
};

RetroMood.propTypes = {
    moods: PropTypes.array.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    updateMood: PropTypes.func.isRequired,
};
