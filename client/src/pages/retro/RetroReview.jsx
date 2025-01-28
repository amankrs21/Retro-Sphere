import { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import {
    TextField, Button, Card, CardContent, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';


export default function RetroColumn({ title, data, addComment }) {

    const [isAddNew, setIsAddNew] = useState(false);
    const [editedValue, setEditedValue] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleEdit = (index, currentValue) => {
        setEditedValue(currentValue);
        setEditingIndex(index);
        setIsAddNew(false);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    };

    const handleSave = (index) => {
        if (index === null) {
            addComment(editedValue);
        } else {
            data[index] = editedValue;
        }
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    };

    return (
        <Grid size={{ xs: 12, md: 3 }}>
            <Card className='retro-comment-card'>
                <div className='retro-comment-card-header'>
                    <Typography variant='h6'>{title}</Typography>
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
                                    <IconButton aria-label="save" onClick={() => handleSave(index)}>
                                        <CheckIcon fontSize='small' color='success' />
                                    </IconButton>
                                </div>
                            </div>
                        ) : (
                            <Card className='retro-comment-card-item' onClick={() => handleEdit(index, item)}>
                                <Typography variant='body2'>
                                    {item.comment}
                                </Typography>
                                <div className='author'>
                                    <Typography variant='caption' color='secondary'>~{item.createdBy}</Typography>
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
                                <IconButton aria-label="save" onClick={() => handleSave(null)}>
                                    <CheckIcon fontSize='small' color='success' />
                                </IconButton>
                            </div>
                        </div>
                    ) : (
                        <Button fullWidth variant="outlined"
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
    addComment: PropTypes.func.isRequired,
};
