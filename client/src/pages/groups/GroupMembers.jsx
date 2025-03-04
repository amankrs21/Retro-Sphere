import { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import {
    Button, IconButton, TableContainer, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, TextField, Container, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import ConfirmPop from '../../components/ConfirmPop';

export default function GroupMembers({ groupId, setGroupChanged, members, isOwner, refreshMembers }) {
    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [newMember, setNewMember] = useState('');
    const [tempLoad, setTempLoad] = useState(false);


    const addMember = async () => {
        if (!newMember.trim()) return toast.warn('Please enter an email');

        setTempLoad(true);
        try {
            const response = await http.post('/group/add-member', { email: newMember, groupId });
            toast.success(response?.data?.message ?? 'Member added successfully');
            setNewMember('');
            refreshMembers();
        } catch (error) {
            console.error("Error adding member:", error);
            toast.error(error?.response?.data?.message ?? 'Failed to add member');
        } finally {
            setTempLoad(false);
        }
    };

    const deleteMember = async (email) => {
        setLoading(true);
        try {
            await http.delete('/group/delete-member', { data: { groupId, email } });
            toast.success('Member removed successfully');
            refreshMembers();
        } catch (error) {
            console.error("Error removing member:", error);
            toast.error(error?.response?.data?.message ?? 'Failed to remove member');
        } finally {
            setLoading(false);
        }
    };

    const deleteGroup = async () => {
        setLoading(true);
        try {
            await http.delete(`/group/delete/${groupId}`);
            toast.success('Group deleted successfully');
            localStorage.removeItem('retroData');
            setGroupChanged(true);
        } catch (error) {
            console.error("Error deleting group:", error);
            toast.error(error?.response?.data?.message ?? 'Failed to delete group');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <Container>
            {open && <ConfirmPop open={open} setOpen={setOpen} confirmAction={deleteGroup} />}

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
                            <TableCell>#</TableCell>
                            <TableCell>Member Name</TableCell>
                            <TableCell>Member Email</TableCell>
                            <TableCell>Joined On</TableCell>
                            {isOwner && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member, index) => (
                            <TableRow key={member.email}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{new Date(member.createdAt).toLocaleString()}</TableCell>
                                {isOwner && (
                                    <TableCell>
                                        <IconButton color='error' onClick={() => deleteMember(member.email)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isOwner && (
                <Grid className='group-view-items'>
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
                                            loading={tempLoad} onClick={() => addMember()}>
                                            ADD
                                        </Button>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => setOpen(true)}>
                        <DeleteIcon /> &nbsp; DELETE GROUP
                    </Button>
                </Grid>
            )}
        </Container>
    );
}

GroupMembers.propTypes = {
    isOwner: PropTypes.bool.isRequired,
    members: PropTypes.array.isRequired,
    groupId: PropTypes.string.isRequired,
    refreshMembers: PropTypes.func.isRequired,
    setGroupChanged: PropTypes.func.isRequired
};
