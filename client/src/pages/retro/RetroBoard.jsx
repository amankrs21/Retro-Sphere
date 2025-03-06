/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import { toast } from 'react-toastify';
import Typewriter from "typewriter-effect";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Container, Divider, Card, Button
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import './Retro.css';
import RetroMood from './RetroMood';
import RetroReview from './RetroReview';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import { useRetroSocket } from '../../hooks/useRetroSocket';
import EmojiPopOut from '../../components/EmojiPopOut';
import Celebration from '../../components/Celebration';


// RetroBoard page component
export default function RetroBoard() {

    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { userData, http } = useAuth();
    const [rData, setRData] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    document.title = `Retro | ${rData?.retro?.name}`;
    const retroId = window.location.pathname.split('/').pop() ?? null;

    useEffect(() => {
        if (!retroId || !http.defaults.headers.common.Authorization) {
            return;
        }

        const fetchIntialData = async () => {
            if (retroId.length < 20) return navigate('/retro', { replace: true });
            try {
                setLoading(true);
                const response = await http.get(`/retro/${retroId}`);
                setRData(response?.data);
                if (response?.data?.retro?.status === 'completed') {
                    setIsCompleted(true);
                    // localStorage.removeItem('retroData');
                    toast.info('Retro has been completed, you can view the data but cannot edit.');
                }
            } catch (error) {
                console.error(error);
                navigate('/retro', { replace: true });
                toast.error(error?.response?.data?.message ?? 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchIntialData();

    }, [http.defaults.headers.common.Authorization, retroId]);


    const { retroData, celebrate, popoutEmoji, updateMood, addReview, updateReview, completeRetro } = useRetroSocket(retroId);


    const markCompleteRetro = async () => {
        try {
            setLoading(true);
            await http.patch(`/retro/status/${retroId}`);
            toast.success('Retro completed successfully');
            completeRetro();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    const exportRetroData = () => {
        toast.info("Feature coming soon!");
    }

    useEffect(() => {
        if (celebrate) {
            localStorage.removeItem('retroData');
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 9000);
        }
    }, [celebrate, navigate]);

    return (
        <Container maxWidth="xl">
            {celebrate && <Celebration />}
            {popoutEmoji && <EmojiPopOut emoji={popoutEmoji} />}
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
                                deleteSpeed: 30,
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
                    <RetroMood
                        moods={retroData?.moods ?? []}
                        isCompleted={isCompleted}
                        updateMood={updateMood}
                    />
                </Grid>
            </Grid>

            <Divider />

            <Card raised elevation={3} sx={{ mt: 1, p: 1 }}>
                {(isCompleted || celebrate) && <Typography align='center' variant='h6' color='success' sx={{ mb: 1 }}>
                    {rData?.retro?.name} Retrospective has been completed.
                </Typography>}
                <Grid container spacing={1}>
                    <RetroReview
                        title="Start Doing"
                        isCompleted={isCompleted}
                        data={retroData?.reviews?.startDoing || []}
                        addReview={(text) => addReview('startDoing', text)}
                        updateReview={(text, index) => updateReview('startDoing', text, index)}
                    />

                    <RetroReview
                        title="Stop Doing"
                        isCompleted={isCompleted}
                        data={retroData?.reviews?.stopDoing || []}
                        addReview={(text) => addReview('stopDoing', text)}
                        updateReview={(text, index) => updateReview('stopDoing', text, index)}
                    />

                    <RetroReview
                        title="Continue Doing"
                        isCompleted={isCompleted}
                        data={retroData?.reviews?.continueDoing || []}
                        addReview={(text) => addReview('continueDoing', text)}
                        updateReview={(text, index) => updateReview('continueDoing', text, index)}
                    />

                    <RetroReview
                        title="Appreciation"
                        isCompleted={isCompleted}
                        data={retroData?.reviews?.appreciation || []}
                        addReview={(text) => addReview('appreciation', text)}
                        updateReview={(text, index) => updateReview('appreciation', text, index)}
                    />
                </Grid>

                {(!isCompleted && !celebrate) &&
                    <Button fullWidth variant='contained' color='success' sx={{ mt: 2, mb: 1 }}
                        onClick={() => markCompleteRetro()}>
                        Complete Retro {rData?.retro?.name}
                    </Button>
                }
                {isCompleted &&
                    <Button fullWidth variant='contained' color='warning' sx={{ mt: 2, mb: 1 }}
                        onClick={exportRetroData}>
                        Download Retro Report <CloudDownloadIcon sx={{ ml: 2 }} />
                    </Button>
                }
            </Card>
        </Container>
    );
};
