/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import {
    Button, Card, Container, Divider, Typography, Paper, Table, Tooltip, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import './Home.css';
import RetroAdd from './RetroAdd';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import { useGetRetroData } from '../../hooks/useGetRetroData';
import ConfirmPop from '../../components/ConfirmPop';


// Home page component
export default function Home() {

    document.title = "Retro | Home";
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { http, userData } = useAuth();
    const { getRetroData } = useGetRetroData();

    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedRetro, setSelectedRetro] = useState(null);

    const retroOptions = ["Open Retro", "Edit Retro", "Delete Retro"];


    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('retroData')) ?? null;
        if (localData) {
            setData(localData);
            return;
        }
        handleFetchData();
    }, [openAdd]);


    const handleFetchData = async () => {
        getRetroData().then((response) => {
            setData(response);
        });
    };

    const handleMenuOpen = (event, retro) => {
        setAnchorEl(event.currentTarget);
        setSelectedRetro(retro);
    };

    const handleMenuClose = (option) => {
        if (option === "Open Retro") {
            navigate(`/retro/${selectedRetro?._id}`);
        } else if (option === "Edit Retro") {
            toast.info("Feature coming soon!");
        } else if (option === "Delete Retro") {
            setOpen(true);
            setDeleteId(selectedRetro?._id);
        }
        setAnchorEl(null);
        setSelectedRetro(null);
    };

    const handleDeleteRetro = async () => {
        try {
            setLoading(true);
            await http.delete(`/retro/delete/${deleteId}`);
            handleFetchData();
            toast.success("Retro deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setOpen(false);
            setLoading(false);
        }
    }


    return (
        <Container maxWidth="xl">
            {openAdd !== null && <RetroAdd openAdd={openAdd} setOpenAdd={setOpenAdd} />}
            {open && <ConfirmPop open={open} setOpen={setOpen} confirmAction={handleDeleteRetro} />}
            <Typography variant="h4" align="center" gutterBottom>
                <span className="landing-wave" role="img" aria-labelledby="wave">👋</span>&nbsp;
                Hello {userData ? userData?.name.split(" ")[0] : "Guest"},&nbsp;
                Welcome to <b className='custom-home-text'>Retro-Sphere!</b> 🚀
            </Typography>

            <Divider sx={{ opacity: 0.5, maxWidth: '80%', margin: '0 auto' }} />

            <Grid container p={1} gap={4} justifyContent="center">
                <Grid size={{ xs: 12, md: 5 }} elevation={6}>
                    <div className='animation-wrapper'>
                        <DotLottieReact src="retro-home.json" loop autoplay />
                    </div>
                    <Typography variant="body1" align="justify" mt={2} p={2}>
                        <b className='custom-home-text'>Retro-Sphere</b>&nbsp;🎉 is your go-to platform for making sprint retrospectives
                        <b className='custom-home-text'> engaging, interactive, and insightful.</b>&nbsp;
                        Reflect, collaborate, and grow with your team in a vibrant environment tailored for creativity and success.
                        <br />
                        <b className='custom-home-text'>To get started, create a group or join an existing one.</b>&nbsp;
                        You can also create retrospectives within your groups to reflect on your past sprints and plan for the future.
                    </Typography>
                </Grid>


                <Grid size={{ xs: 12, md: 6 }} elevation={6}>
                    <Card variant="outlined" className='home-group'>
                        <div className='home-group-header'>
                            <Typography variant="h6" align="center">
                                Your Retros 📝
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={() => setOpenAdd(data?.groups)}>
                                + Create New
                            </Button>
                        </div>

                        <TableContainer component={Paper} className='home-table'>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#aa51b9', color: '#fff' }}>
                                        <TableCell sx={{ width: '5%' }}>#</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Retro Name</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Group</TableCell>
                                        <TableCell sx={{ width: '10%' }}>Status</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Created On</TableCell>
                                        <TableCell sx={{ width: '10%' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.retros?.slice()
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map((retro, index) => (
                                            <TableRow key={retro._id} className='table-row'>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell sx={{ color: '#1976d2', fontWeight: 'bold' }}
                                                    onClick={() => navigate(`/retro/${retro?._id}`)}>
                                                    {retro?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {data?.groups?.find(group => group._id === retro?.group)?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color={retro?.status === "active" ? "success" : "error"}>
                                                        {retro?.status}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{new Date(retro?.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Options">
                                                        <IconButton onClick={(e) => handleMenuOpen(e, retro)}>
                                                            <MoreVertIcon color="secondary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {retroOptions.map(option => (
                                <MenuItem key={option} onClick={() => handleMenuClose(option)}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
