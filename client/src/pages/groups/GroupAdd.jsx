import {
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button
} from '@mui/material';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';


export default function GroupAdd({ openAdd, setOpenAdd }) {

    const { http } = useAuth();
    const { setLoading } = useLoading();

    const handleGroupAdd = async (data) => {
        const rRegex = /^(?:["'])|(?:["'])$/g;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const members = data.members
            .split(',')
            .map(email => email.trim().replace(rRegex, '')) // Now correctly removes both leading & trailing quotes
            .filter(email => emailRegex.test(email));

        if (members.length === 0 || data.members.trim() === "" || members.some(email => email === "")) {
            toast.info("Invalid email(s) entered. Please check and try again.");
            return;
        }

        try {
            setLoading(true);
            const response = await http.post('/group/add', { name: data.name, members });
            localStorage.removeItem('retroData');
            toast.success("Group added successfully!");
            setOpenAdd(false);
            if (response.data?.memberNotFound?.length > 0)
                toast.info(`The following members were not found: ${response.data.memberNotFound.join(', ')}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                        handleGroupAdd(formJson);
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
    setOpenAdd: PropTypes.func.isRequired
};
