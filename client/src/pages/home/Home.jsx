/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2';
import {
    Button, Card, Container, Divider, Typography, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from "@mui/material";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';

import './Home.css';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import GroupAdd from '../group/GroupAdd';
import GroupView from '../group/GroupView';


// Home page component
export default function Home() {

    document.title = "Retro | Home";
    const [openGAdd, setOpenGAdd] = useState(false);
    const [openGView, setOpenGView] = useState(null);
    const [groupsData, setGroupsData] = useState([]);
    const { userData, isAuthenticated, http } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !userData || !http.defaults.headers.common.Authorization) {
            return;
        }

        const localGroups = JSON.parse(localStorage.getItem('group')) ?? [];
        if (localGroups.length > 0) {
            setGroupsData(localGroups);
            return;
        }

        handleFetchGroups();
    }, [isAuthenticated, userData, http]);


    const handleFetchGroups = async () => {
        try {
            const response = await http.get('/group/fetch');
            setGroupsData(response?.data?.groups);
            localStorage.setItem('group', JSON.stringify(response?.data?.groups));
        } catch (error) {
            console.error(error);
        }
    };

    const handleGroupAdd = async (data) => {
        // Remove unnecessary spaces, newlines, and split by comma
        const members = data.members
            .split(',')
            .map(email => email.trim().replace(/^"|"$/g, ''))
            .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

        if (members.length === 0 || data.members.trim() === "" || members.some(email => email === "")) {
            toast.info("Invalid email(s) entered. Please check and try again.");
            return;
        }

        try {
            const response = await http.post('/group/add', { name: data.name, members });
            setOpenGAdd(false);
            localStorage.removeItem('group');
            toast.success("Group added successfully!");
            if (response.data?.memberNotFound)
                toast.info(`The following members were not found: ${response.data.memberNotFound.join(', ')}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        }

    };


    return (
        <Container maxWidth="xl">
            {openGAdd && <GroupAdd openAdd={openGAdd} setOpenAdd={setOpenGAdd} handleAdd={handleGroupAdd} />}
            {openGView !== null && <GroupView openData={openGView} setOpenData={setOpenGView} isOwner={openGView?.createdBy === userData?.id} />}
            <Typography variant="h4" align="center" gutterBottom>
                <span className="landing-wave" role="img" aria-labelledby="wave">👋</span>&nbsp;
                Hello {userData ? userData?.name.split(" ")[1] : "Guest"},
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
                                    {groupsData.length > 0 && groupsData.map((group, index) => (
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
                            <Button variant="contained" color="primary">
                                + Create New
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
                                        <TableCell sx={{ width: '5%' }}>#</TableCell>
                                        <TableCell sx={{ width: '30%' }}>Group Name</TableCell>
                                        <TableCell sx={{ width: '30%' }}>Owner</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Status</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[...Array(3)].map((_, index) => (
                                        <TableRow className="table-row" key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="table-cell-group-name">
                                                Retro {index + 1}
                                            </TableCell>
                                            <TableCell>Owner {index + 1}</TableCell>
                                            <TableCell>{index == 1 ? 'Completed' : 'Initated'}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Delete Retro">
                                                    <Button variant="outlined" color="error" size="small">
                                                        DELETE
                                                    </Button>
                                                </Tooltip>
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
