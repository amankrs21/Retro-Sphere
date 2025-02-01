import { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import {
    TextField, Button, Card, CardContent, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';


export default function RetroColumn({ title, data, addReview, updateReview }) {

    const [isAddNew, setIsAddNew] = useState(false);
    const [editedValue, setEditedValue] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEdit = (index, item) => {
        setEditedValue(item.comment);
        setEditingIndex(index);
        setIsAddNew(false);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    };

    const handleSave = () => {
        addReview(editedValue);
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    };

    const handleUpdate = (item, index) => {
        updateReview(editedValue, index);
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    }

    return (
        <Grid size={{ xs: 12, md: 3 }}>
            <Card className='retro-comment-card'>
                <div className='retro-comment-card-header'>
                    <Typography variant='subtitle1'>{title}</Typography>
                </div>

                {data.map((item, index) => (
                    <CardContent className='retro-comment-cardcontent' key={index}>
                        {editingIndex === index ? (
                            <div style={{ position: 'relative' }}>
                                <TextField
                                    rows={4}
                                    autoFocus
                                    fullWidth
                                    multiline
                                    value={editedValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                    sx={{ backgroundColor: '#fff', position: 'relative' }}
                                />
                                <div className='retro-comment-card-actions'>
                                    <IconButton aria-label="cancel" onClick={handleCancel}>
                                        <CloseIcon fontSize='small' color='error' />
                                    </IconButton>
                                    <IconButton aria-label="save" onClick={() => handleUpdate(item, index)}>
                                        <CheckIcon fontSize='small' color='success' />
                                    </IconButton>
                                </div>
                            </div>
                        ) : (
                            <Card className='retro-comment-card-item' onClick={() => handleEdit(index, item)}>
                                <Typography variant='body2'>
                                    {item?.comment}
                                </Typography>
                                <div className='author'>
                                    <Typography variant='caption' color='secondary'>~{item?.email}</Typography>
                                </div>
                            </Card>
                        )}
                    </CardContent>
                ))}

                <CardContent className='retro-comment-cardcontent'>
                    {isAddNew ? (
                        <div style={{ position: 'relative' }}>
                            <TextField
                                rows={4}
                                autoFocus
                                fullWidth
                                multiline
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                sx={{ backgroundColor: '#fff', position: 'relative' }}
                            />
                            <div className='retro-comment-card-actions'>
                                <IconButton aria-label="cancel" onClick={handleCancel}>
                                    <CloseIcon fontSize='small' color='error' />
                                </IconButton>
                                <IconButton aria-label="save" onClick={() => handleSave()}>
                                    <CheckIcon fontSize='small' color='success' />
                                </IconButton>
                            </div>
                        </div>
                    ) : (
                        <Button fullWidth variant="outlined" size='small'
                            onClick={() => {
                                setIsAddNew(true);
                                setEditedValue('');
                            }}
                        >
                            Add New Item
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};

RetroColumn.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    addReview: PropTypes.func.isRequired,
    updateReview: PropTypes.func.isRequired
};
