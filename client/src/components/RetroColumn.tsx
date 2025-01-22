import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, TextField, Button, Paper } from '@mui/material';

interface RetroColumnProps {
    title: string;
    data: string[];
    updateColumn: (text: string) => void;
}

const RetroColumn: React.FC<RetroColumnProps> = ({ title, data, updateColumn }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        updateColumn(newItem);
        setNewItem('');
    };

    return (
        <Grid size={{ xs: 12, md: 3 }} >
            <Paper style={{ padding: '20px', minHeight: '200px' }}>
                <Typography variant="h6">{title}</Typography>
                <div>
                    {data.map((item, index) => (
                        <Typography key={index}>{item}</Typography>
                    ))}
                </div>
                <TextField
                    label={`Add to ${title}`}
                    fullWidth
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                    style={{ marginTop: '10px' }}
                >
                    Add
                </Button>
            </Paper>
        </Grid>
    );
};

export default RetroColumn;
