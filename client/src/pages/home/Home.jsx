/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import {
    Button, Card, Container, Divider, Typography, Paper, Table, Tooltip,
    TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import './Home.css';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import GroupAdd from '../../components/group/GroupAdd';
import GroupView from '../../components/group/GroupView';
import RetroAdd from '../../components/retro/RetroAdd';


// Home page component
export default function Home() {

    document.title = "Retro | Home";
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { http, userData } = useAuth();
    const [grData, setGRData] = useState(null);
    const [openRAdd, setOpenRAdd] = useState(null);
    const [openGAdd, setOpenGAdd] = useState(false);
    const [openGView, setOpenGView] = useState(null);


    useEffect(() => {
        if (!http.defaults.headers.common.Authorization) {
            return;
        }

        const localData = JSON.parse(localStorage.getItem('retroData')) ?? null;
        if (localData) {
            setGRData(localData);
            return;
        }

        handleFetchData();
    }, [http.defaults.headers.common.Authorization]);


    const handleFetchData = async () => {
        try {
            setLoading(true);
            const response = await http.get('/group/fetch');
            setGRData(response?.data);
            localStorage.setItem('retroData', JSON.stringify(response?.data));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleGroupAdd = async (data) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const members = data.members
            .split(',')
            .map(email => email.trim().replace(/^"|"$/g, ''))
            .filter(email => emailRegex.test(email));

        if (members.length === 0 || data.members.trim() === "" || members.some(email => email === "")) {
            toast.info("Invalid email(s) entered. Please check and try again.");
            return;
        }

        try {
            setLoading(true);
            const response = await http.post('/group/add', { name: data.name, members });
            setOpenGAdd(false);
            handleFetchData();
            toast.success("Group added successfully!");
            if (response.data?.memberNotFound?.length > 0)
                toast.info(`The following members were not found: ${response.data.memberNotFound.join(', ')}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleRetroAdd = async (data) => {
        try {
            setLoading(true);
            const response = await http.post('/retro/add', data);
            setOpenRAdd(null);
            handleFetchData();
            toast.success(response?.data?.message ?? "Retro created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Container maxWidth="xl">
            {openGAdd && <GroupAdd openAdd={openGAdd} setOpenAdd={setOpenGAdd} handleAdd={handleGroupAdd} />}
            {openRAdd !== null && <RetroAdd openAdd={openRAdd} setOpenAdd={setOpenRAdd} handleAdd={handleRetroAdd} />}
            {openGView !== null && <GroupView openData={openGView} setOpenData={setOpenGView} isOwner={openGView?.createdBy === userData?.id} />}
            <Typography variant="h4" align="center" gutterBottom>
                <span className="landing-wave" role="img" aria-labelledby="wave">👋</span>&nbsp;
                Hello {userData ? userData?.name.split(" ")[0] : "Guest"},
                Welcome to <b className='custom-home-text'>Retro-Sphere!</b> 🚀
            </Typography>

            <Divider sx={{ opacity: 0.5, maxWidth: '80%', margin: '0 auto' }} />

            <Grid container p={1} gap={4} justifyContent="center">
                <Grid size={{ xs: 12, md: 5 }} elevation={6}>
                    <div className='animation-wrapper'>
                        <DotLottieReact src="retro-home.json" loop autoplay />
                    </div>
                    <Typography variant="body1" align="justify" mt={2} p={2}>
                        <b className='custom-home-text'>Retro-Sphere</b> 🎉 is your go-to platform for making sprint retrospectives
                        <b className='custom-home-text'> engaging, interactive, and insightful. </b>
                        Reflect, collaborate, and grow with your team in a vibrant environment tailored for creativity and success.
                        <br />
                        <b className='custom-home-text'>To get started, create a group or join an existing one. </b>
                        You can also create retrospectives within your groups to reflect on your past sprints and plan for the future.
                    </Typography>
                </Grid>


                <Grid size={{ xs: 12, md: 6 }} elevation={6}>
                    <Card variant="outlined" className='home-group'>
                        <div className='home-group-header'>
                            <Typography variant="h6" align="center" gutterBottom>
                                Your Groups 🌟
                            </Typography>
                            <Button variant="contained" color="success" onClick={() => setOpenGAdd(!openGAdd)}>
                                + Create New
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
                                        <TableCell sx={{ width: '5%' }}>#</TableCell>
                                        <TableCell sx={{ width: '33%' }}>Group Name</TableCell>
                                        <TableCell sx={{ width: '40%' }}>Owner</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Created On</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grData?.groups?.length > 0 && grData?.groups?.map((group, index) => (
                                        <TableRow className="table-row" key={index} onClick={() => setOpenGView(group)}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                                {group?.name}
                                            </TableCell>
                                            <TableCell>{group?.ownerEmail}</TableCell>
                                            <TableCell>
                                                {new Date(group?.createdAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>


                    <Card variant="outlined" className='home-group'>
                        <div className='home-group-header'>
                            <Typography variant="h6" align="center" gutterBottom>
                                Your Retros 📝
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={() => setOpenRAdd(grData?.groups)}>
                                + Create New
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#aa51b9', color: '#fff' }}>
                                        <TableCell sx={{ width: '3%' }}>#</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Retro Name</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Group</TableCell>
                                        <TableCell sx={{ width: '15%' }}>Status</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Created On</TableCell>
                                        <TableCell sx={{ width: '10%' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grData?.retros?.length > 0 && grData?.retros?.map((retro, index) => (
                                        <TableRow className="table-row" key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell sx={{ color: '#1976d2', fontWeight: 'bold' }}
                                                onClick={() => navigate(`/retro/${retro?._id}`)}>
                                                {retro?.name}
                                            </TableCell>
                                            <TableCell>
                                                {grData?.groups?.find(group => group._id === retro?.group)?.name}
                                            </TableCell>
                                            <TableCell>{retro?.status}</TableCell>
                                            <TableCell>
                                                {new Date(retro?.createdAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="delete" color='error' disabled={true}>
                                                    <Tooltip arrow title="Delete this retro">
                                                        <DeleteIcon />
                                                    </Tooltip>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
