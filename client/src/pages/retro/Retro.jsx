import './Retro.css';
import Grid from '@mui/material/Grid2';
import { Typography, Container, Divider } from '@mui/material';
import { useWebSocket } from '../../hooks/useWebSocket';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';

export default function Retro() {
    const { retroBoardData, updateMood, updateColumn } = useWebSocket('ws://localhost:3000');

    if (!retroBoardData) {
        return <Typography>Loading Retro Board...</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <div className="retro-header">
                <div className="retro-header-title">
                    <Typography variant="h4" gutterBottom>
                        PIM Essentials Retro Board
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        How do you feel about the sprint?
                    </Typography>
                </div>
                <div>
                    <RetroMood mood={retroBoardData?.mood || null} updateMood={updateMood} />
                </div>
            </div>

            <Divider />

            {/* <Grid container spacing={3} mt={3}>
                <RetroReview
                    title="Start Doing"
                    data={retroBoardData?.startDoing || []}
                    updateColumn={(text) => updateColumn('startDoing', text)}
                />
                <RetroReview
                    title="Stop Doing"
                    data={retroBoardData?.stopDoing || []}
                    updateColumn={(text) => updateColumn('stopDoing', text)}
                />
                <RetroReview
                    title="Continue Doing"
                    data={retroBoardData?.continueDoing || []}
                    updateColumn={(text) => updateColumn('continueDoing', text)}
                />
                <RetroReview
                    title="Appreciation"
                    data={retroBoardData?.appreciation || []}
                    updateColumn={(text) => updateColumn('appreciation', text)}
                />
            </Grid> */}
        </Container>
    );
};
