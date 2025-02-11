import Grid from '@mui/material/Grid2';
import {
    Typography, Container, Divider, Card, Accordion, AccordionSummary,
    AccordionDetails,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './Retro.css';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


// Retro page component
export default function Retro() {

    document.title = "Retro | Board";

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const locaData = JSON.parse(localStorage.getItem('retroData')) ?? null;

    if (!isAuthenticated || !locaData) {
        navigate('/');
    }

    return (
        <Container maxWidth="md">
            <Grid container >
                <Typography variant="h4" gutterBottom>
                    Active Retro-Boards | List
                </Typography>
            </Grid>


            <Divider />

            <Card raised elevation={1} sx={{ mt: 1, p: 1, backgroundColor: 'lightgray' }}>
                <Typography variant="h5" gutterBottom>
                    Current ongoing sprints are listed below
                </Typography>
                {locaData?.retros?.length > 0 && locaData?.retros?.map((retro, index) => (
                    <Accordion expanded key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='h6' color='secondary'>
                                    Retro Name: {retro.name}
                                </Typography>
                                <Typography variant='h6' color='success' fontWeight={600}>[{retro?.status}]</Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails sx={{ mt: -2 }}>
                            <Typography variant='substitle-1' color='text.secondary'>
                                <p>Belongs to Group - &nbsp;
                                    {locaData?.groups?.find(group => group._id === retro?.group)?.name}
                                </p>
                                <p style={{ fontSize: '16px', marginTop: '5px' }}>
                                    Created On - {new Date(retro?.createdAt).toLocaleString()}
                                </p>
                            </Typography>
                            <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1 }}
                                onClick={() => navigate(`/retro/${retro._id}`)}>
                                Open {retro.name}
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Card>
        </Container>
    );
};
