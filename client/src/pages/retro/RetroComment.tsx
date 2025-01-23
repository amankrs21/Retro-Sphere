import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
    TextField,
    Button,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface RetroColumnProps {
    title: string;
    data: string[];
    updateColumn: (text: string) => void;
}

const RetroColumn: React.FC<RetroColumnProps> = ({ title, data, updateColumn }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [isAddNew, setIsAddNew] = useState<boolean>(false);

    const handleEdit = (index: number, currentValue: string) => {
        setEditingIndex(index);
        setEditedValue(currentValue);
        setIsAddNew(false);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedValue('');
        setIsAddNew(false);
    };

    const handleSave = (index: number | null) => {
        if (index === null) {
            updateColumn(editedValue);
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
                <CardHeader className='retro-comment-card-header' title={title} />

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
                                <Typography variant='body1'>
                                    {item}
                                </Typography>
                                <div className='author'>
                                    <Typography variant='caption' color='secondary'>~ User Name</Typography>
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

export default RetroColumn;
