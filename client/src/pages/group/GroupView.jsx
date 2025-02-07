import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, IconButton, InputAdornment,
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import "./Group.css";
import { useAuth } from '../../hooks/useAuth';


export default function GroupView({ openData, setOpenData, isOwner }) {

    const { http } = useAuth();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!http.defaults.headers.common.Authorization) return null;
        if (!openData?._id) return null;
        const fetchGroup = async () => {
            try {
                const response = await http.get('/group/fetch/' + openData?._id);
                setMembers(response?.data?.members);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroup();
    }, [http, openData]);

    return (
        <Dialog
            fullWidth
            maxWidth='md'
            open={openData !== null}
            onClose={() => setOpenData(null)}
        >
            <DialogTitle className='group-view-title'>
                <span>Group Details | {openData?.name}</span>
                <Button variant='contained' color='secondary' onClick={() => setOpenData(null)}>Close</Button>
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
                                <TableCell sx={{ width: '3%' }}>#</TableCell>
                                <TableCell sx={{ width: '30%' }}>Member Name</TableCell>
                                <TableCell sx={{ width: '40%' }}>Member Email</TableCell>
                                <TableCell sx={{ width: '20%' }}>Joined On</TableCell>
                                <TableCell sx={{ width: '20%' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members?.length > 0 && members.map((member, index) => (
                                <TableRow className="table-row" key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                        {member?.name}
                                    </TableCell>
                                    <TableCell>{member?.email}</TableCell>
                                    <TableCell>
                                        {new Date(member?.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton aria-label="delete" color='error' disabled={!isOwner}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {isOwner && (
                    <div className='group-view-items'>
                        <TextField
                            required
                            fullWidth
                            className='group-view-textfield'
                            name="members"
                            variant="outlined"
                            label="Enter Email Address of New Member"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button variant="contained" color="primary" loading
                                                loadingPosition="start">
                                                ADD
                                            </Button>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Button variant="contained" color="error">
                            DELETE GROUP
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

GroupView.propTypes = {
    openData: PropTypes.object.isRequired,
    setOpenData: PropTypes.func.isRequired,
    isOwner: PropTypes.bool.isRequired,
};
