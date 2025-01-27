import Grid from '@mui/material/Grid2';
import {
    Button, Container, Divider, Typography, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip,
    Card
} from "@mui/material";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import './Home.css';

export default function Home() {
    let userName = localStorage.getItem('userName') ?? '';

    return (
        <Container maxWidth="xl">
            <Typography pt={2} variant="h4" align="center" gutterBottom>
                👋 Hello {userName ? userName.split(' ')[0] : "Guest"},
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
                            <Button variant="contained" color="success">
                                + Create New
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
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
                                                Group {index + 1}
                                            </TableCell>
                                            <TableCell>Owner {index + 1}</TableCell>
                                            <TableCell>{index == 1 ? 'Inactive' : 'Active'}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Delete Group">
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
