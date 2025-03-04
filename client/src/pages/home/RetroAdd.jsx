import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';


export default function RetroAdd({ openAdd, setOpenAdd }) {

    const { http } = useAuth();
    const { setLoading } = useLoading();
    const [group, setGroup] = useState('');

    const handleRetroAdd = async (data) => {
        try {
            setLoading(true);
            const response = await http.post('/retro/add', data);
            localStorage.removeItem('retroData');
            setOpenAdd(null);
            toast.success(response?.data?.message ?? "Retro created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            fullWidth
            maxWidth='xs'
            open={openAdd !== null}
            onClose={() => setOpenAdd(null)}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        formJson.groupId = group;
                        handleRetroAdd(formJson);
                    },
                }
            }}
        >
            <DialogTitle>
                Add a Retro
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill the form to add a new retro-board.
                </DialogContentText>
                <FormControl fullWidth sx={{ marginY: 3 }}>
                    <InputLabel>Select Group</InputLabel>
                    <Select
                        required
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    >
                        {openAdd?.map((group) => (
                            <MenuItem key={group._id} value={group._id}>{group.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    required
                    fullWidth
                    name="name"
                    variant="outlined"
                    label="Title (Unique Retro Name)"
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpenAdd(null)}>Cancel</Button>
                <Button type="submit" variant='contained'>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

RetroAdd.propTypes = {
    openAdd: PropTypes.array.isRequired,
    setOpenAdd: PropTypes.func.isRequired
};
