/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, IconButton, InputAdornment,
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import "./Group.css";
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import { toast } from 'react-toastify';
import ConfirmPop from '../ConfirmPop';


export default function GroupView({ openData, setOpenData, isOwner }) {

    const { http } = useAuth();
    const { setLoading } = useLoading();
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [tempLoad, setTempLoad] = useState(false);

    useEffect(() => {
        if (!http.defaults.headers.common.Authorization) return null;
        if (!openData?._id) return null;

        fetchMembers();
    }, [http, openData]);


    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await http.get('/group/fetch/' + openData?._id);
            setMembers(response?.data?.members);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const addMember = async (email) => {
        try {
            setTempLoad(true);
            const response = await http.post('/group/add-member', { email, groupId: openData?._id });
            toast.success(response?.data?.message ?? 'Member added successfully');
            setNewMember('');
            fetchMembers();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message ?? 'Failed to add member');
        } finally {
            setTempLoad(false);
        }
    };


    const deleteMember = async (email) => {
        try {
            setLoading(true);
            await http.delete('/group/delete-member', { data: { groupId: openData?._id, email } });
            toast.success('Member removed successfully');
            fetchMembers();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message ?? 'Failed to remove member');
        } finally {
            setLoading(false);
        }
    };


    const deleteGroup = async () => {
        try {
            setOpen(false);
            setLoading(true);
            await http.delete(`/group/delete/${openData?._id}`);
            toast.success('Group deleted successfully');
            localStorage.removeItem('group');
            setOpenData(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message ?? 'Failed to delete group');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog
            fullWidth
            maxWidth='md'
            open={openData !== null}
            onClose={() => setOpenData(null)}
        >
            {open && <ConfirmPop open={open} setOpen={setOpen} confirmAction={deleteGroup} />}
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
                                <TableRow className="table-row" key={crypto.randomUUID()}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                        {member?.name}
                                    </TableCell>
                                    <TableCell>{member?.email}</TableCell>
                                    <TableCell>
                                        {new Date(member?.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton aria-label="delete" color='error' disabled={!isOwner}
                                            onClick={() => deleteMember(member?.email)}>
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
                            type="email"
                            name="member"
                            variant="outlined"
                            className='group-view-textfield'
                            label="Enter Email Address of New Member"
                            value={newMember}
                            onChange={(e) => setNewMember(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button variant="contained" color="primary" loadingPosition="start"
                                                loading={tempLoad} onClick={() => addMember(newMember)}>
                                                ADD
                                            </Button>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Button variant="contained" color="error" onClick={() => setOpen(true)}>
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
