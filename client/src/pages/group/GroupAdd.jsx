import PropTypes from 'prop-types';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button
} from '@mui/material';

export default function GroupAdd({ openAdd, setOpenAdd, handleAdd }) {

    return (
        <Dialog
            fullWidth
            maxWidth='xs'
            open={openAdd}
            onClose={() => setOpenAdd(!openAdd)}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        handleAdd(formJson);
                    },
                }
            }}
        >
            <DialogTitle>
                Add a Group
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill the form to add a new group.
                </DialogContentText>
                <TextField
                    required
                    autoFocus
                    fullWidth
                    name="name"
                    variant="outlined"
                    label="Title (Group Name)"
                    sx={{ marginY: 3 }}
                />
                <TextField
                    rows={4}
                    required
                    multiline
                    fullWidth
                    name="members"
                    variant="outlined"
                    label="Members (Emails separated by commas)"
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpenAdd(!openAdd)}>Cancel</Button>
                <Button type="submit" variant='contained'>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

GroupAdd.propTypes = {
    openAdd: PropTypes.bool.isRequired,
    setOpenAdd: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired
};
