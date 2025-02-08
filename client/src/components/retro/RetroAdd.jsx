import PropTypes from 'prop-types';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useState } from 'react';

export default function RetroAdd({ openAdd, setOpenAdd, handleAdd }) {

    const [group, setGroup] = useState('');

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
                        handleAdd(formJson);
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
                    autoFocus
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
    setOpenAdd: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired
};
