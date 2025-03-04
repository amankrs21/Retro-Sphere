import { useEffect } from 'react';
import {
    Typography, Container, Divider, Card, Accordion, AccordionSummary, AccordionDetails, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

import './Retro.css';

// Retro page component
export default function Retro() {
    document.title = "Retro | Boards";

    const navigate = useNavigate();
    const locaData = JSON.parse(localStorage.getItem('retroData') || '{}');

    useEffect(() => {
        if (!locaData?.retros?.length) return;
    }, [locaData]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>
                Looking for a retro board? 🤔
            </Typography>

            <Divider />

            <Card raised sx={{ mt: 2, px: 6, py: 4, backgroundColor: '#f5f5f5' }}>
                {locaData?.retros?.length > 0 ? (
                    locaData?.retros?.slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((retro) => (
                            retro.status !== 'completed' && (
                                <Accordion expanded key={retro._id} sx={{ mt: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '95%' }}>
                                            <Typography variant="h6" color="secondary">
                                                <b>Retro Name:</b> {retro.name}
                                            </Typography>
                                            <Typography variant="h6" color="success" fontWeight={600}>
                                                [{retro?.status}]
                                            </Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ mt: -2 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            <span>Belongs to Group - &nbsp;
                                                <b>{locaData?.groups?.find(group => group._id === retro?.group)?.name || 'Unknown'}</b>
                                            </span><br />
                                            <span style={{ fontSize: '16px', marginTop: '5px' }}>
                                                Created On - <b>{new Date(retro?.createdAt).toLocaleString()}</b>
                                            </span>
                                        </Typography>
                                        <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1 }}
                                            onClick={() => navigate(`/retro/${retro._id}`)}>
                                            Open {retro.name}
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        ))
                ) : (
                    <Typography variant="h5" align="center" color='warning' sx={{ mt: 1 }}>
                        No Retro-Board available, please create a new one.
                    </Typography>
                )}
            </Card>
        </Container>
    );
};
