import './Retro.css';
// import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Container, Divider } from '@mui/material';
import { useWebSocket } from '../../hooks/useWebSocket';
import RetroColumn from './RetroComment';
import RetroMood from './RetroMood';

const RetroPage: React.FC = () => {
    const { retroBoardData, updateMood, updateColumn } = useWebSocket('ws://localhost:3000');
    // const [appreciationText, setAppreciationText] = useState('');

    // const handleAppreciationSubmit = () => {
    //     updateColumn('appreciation', appreciationText);
    //     setAppreciationText('');
    // };

    const tempData = {
        startDoing: ['Add more tests', 'Improve documentation'],
        stopDoing: ['Stop doing things that are not needed'],
        continueDoing: ['Keep up the good work'],
        appreciation: ['Thanks for helping me out']
    };

    return (
        <Container maxWidth="lg">
            <div className='retro-header'>
                <div className='retro-header-title'>
                    <Typography variant="h4" gutterBottom>
                        PIM Essentials Retro Board
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        How do you feel about the sprint?
                    </Typography>
                </div>
                <div>
                    <RetroMood mood={retroBoardData.mood} updateMood={updateMood} />
                </div>
            </div>


            <Divider />

            <Grid container spacing={3} mt={3}>
                <RetroColumn
                    title="Start Doing"
                    data={tempData.startDoing}
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

        </Container>
    );
};

export default RetroPage;
