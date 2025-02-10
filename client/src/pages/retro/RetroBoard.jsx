/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import Typewriter from "typewriter-effect";
import { Typography, Container, Divider, Card, Button } from '@mui/material';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useAuth } from '../../hooks/useAuth';
import { useRetroSocket } from '../../hooks/useRetroSocket';
import { useEffect, useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


// RetroBoard page component
export default function RetroBoard() {

    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [rData, setRData] = useState(null);
    const { isAuthenticated, userData, http } = useAuth();

    document.title = `Retro | ${rData?.retro?.name}`;
    const retroId = window.location.pathname.split('/').pop() ?? null;

    useEffect(() => {
        if (!isAuthenticated || !retroId || !http.defaults.headers.common.Authorization) {
            return;
        }

        const fetchIntialData = async () => {
            try {
                setLoading(true);
                const response = await http.get(`/retro/${retroId}`);
                setRData(response?.data);
            } catch (error) {
                console.error(error);
                if (error?.response?.data?.message === 'Invalid Path') {
                    toast.error('Please select a valid retro board');
                    navigate('/retro', { replace: true });
                    return;
                }
                toast.error(error?.response?.data?.message ?? 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchIntialData();
    }, [http, retroId]);


    const { retroData, updateMood, addReview, updateReview } = useRetroSocket(retroId);


    const completeRetro = async () => {
        try {
            setLoading(true);
            await http.patch(`/retro/status/${retroId}`);
            toast.success('Retro completed successfully');
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 100);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="xl">
            <Grid container className="retro-header" spacing={0}>
                <Grid
                    size={{ xs: 12, md: 5 }}
                    className="retro-header-title"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "center", md: "flex-start" },
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {rData?.group?.name} | {rData?.retro?.name}
                    </Typography>
                    <Typography variant="subtitle1" color='warning' gutterBottom>
                        <Typewriter
                            options={{
                                strings: [
                                    `Welcome ${userData?.name}, to Retro-Board 🤖`,
                                    'How do you feel about the sprint?',
                                    'Share your valuable thoughts, ideas, and feedback',
                                ],
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 50,
                            }}
                        />

                    </Typography>
                </Grid>

                <Grid
                    size={{ xs: 12, md: 7 }}
                    sx={{
                        display: "flex",
                        alignItems: { xs: "center", md: "flex-end" },
                        justifyContent: { xs: "center", md: "flex-end" },
                    }}
                >
                    <RetroMood moods={retroData?.moods ?? []} updateMood={updateMood} />
                </Grid>
            </Grid>


            <Divider />

            <Card raised elevation={1} sx={{ mt: 1, p: 1 }}>
                <Grid container spacing={1}>
                    <RetroReview
                        title="Start Doing"
                        data={retroData?.reviews?.startDoing || []}
                        addReview={(text) => addReview('startDoing', text)}
                        updateReview={(text, index) => updateReview('startDoing', text, index)}
                    />

                    <RetroReview
                        title="Stop Doing"
                        data={retroData?.reviews?.stopDoing || []}
                        addReview={(text) => addReview('stopDoing', text)}
                        updateReview={(text, index) => updateReview('stopDoing', text, index)}
                    />

                    <RetroReview
                        title="Continue Doing"
                        data={retroData?.reviews?.continueDoing || []}
                        addReview={(text) => addReview('continueDoing', text)}
                        updateReview={(text, index) => updateReview('continueDoing', text, index)}
                    />

                    <RetroReview
                        title="Appreciation"
                        data={retroData?.reviews?.appreciation || []}
                        addReview={(text) => addReview('appreciation', text)}
                        updateReview={(text, index) => updateReview('appreciation', text, index)}
                    />
                </Grid>
                <Button fullWidth variant='contained' color='secondary' sx={{ mt: 2 }}
                    onClick={() => completeRetro()}>
                    Complete Retro {rData?.retro?.name}
                </Button>
            </Card>
        </Container>
    );
};
