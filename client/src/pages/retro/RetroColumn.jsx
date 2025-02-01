// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import Grid from '@mui/material/Grid2';
// import {
//     TextField, Button, Card, CardContent, IconButton, Typography
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import CheckIcon from '@mui/icons-material/Check';


// export default function RetroColumn({ title, data, addComment }) {

//     const [isAddNew, setIsAddNew] = useState(false);
//     const [editedValue, setEditedValue] = useState('');
//     const [editingIndex, setEditingIndex] = useState(null);

//     const handleEdit = (index, currentValue) => {
//         setEditedValue(currentValue);
//         setEditingIndex(index);
//         setIsAddNew(false);
//     };

//     const handleCancel = () => {
//         setEditingIndex(null);
//         setEditedValue('');
//         setIsAddNew(false);
//     };

//     const handleSave = (index) => {
//         if (index === null) {
//             addComment(editedValue);
//         } else {
//             data[index] = editedValue;
//         }
//         setEditingIndex(null);
//         setEditedValue('');
//         setIsAddNew(false);
//     };

//     return (
//         <Grid size={{ xs: 12, md: 3 }}>
//             <Card className='retro-comment-card'>
//                 <div className='retro-comment-card-header'>
//                     <Typography variant='h6'>{title}</Typography>
//                 </div>

//                 {data.map((item, index) => (
//                     <CardContent className='retro-comment-cardcontent' key={index}>
//                         {editingIndex === index ? (
//                             <div style={{ position: 'relative' }}>
//                                 <TextField
//                                     rows={4}
//                                     autoFocus
//                                     fullWidth
//                                     multiline
//                                     value={editedValue}
//                                     onChange={(e) => setEditedValue(e.target.value)}
//                                     sx={{ backgroundColor: '#fff', position: 'relative' }}
//                                 />
//                                 <div className='retro-comment-card-actions'>
//                                     <IconButton aria-label="cancel" onClick={handleCancel}>
//                                         <CloseIcon fontSize='small' color='error' />
//                                     </IconButton>
//                                     <IconButton aria-label="save" onClick={() => handleSave(index)}>
//                                         <CheckIcon fontSize='small' color='success' />
//                                     </IconButton>
//                                 </div>
//                             </div>
//                         ) : (
//                             <Card className='retro-comment-card-item' onClick={() => handleEdit(index, item)}>
//                                 <Typography variant='body2'>
//                                     {item.comment}
//                                 </Typography>
//                                 <div className='author'>
//                                     <Typography variant='caption' color='secondary'>~{item.createdBy}</Typography>
//                                 </div>
//                             </Card>
//                         )}
//                     </CardContent>
//                 ))}

//                 <CardContent className='retro-comment-cardcontent'>
//                     {isAddNew ? (
//                         <div style={{ position: 'relative' }}>
//                             <TextField
//                                 rows={4}
//                                 autoFocus
//                                 fullWidth
//                                 multiline
//                                 value={editedValue}
//                                 onChange={(e) => setEditedValue(e.target.value)}
//                                 sx={{ backgroundColor: '#fff', position: 'relative' }}
//                             />
//                             <div className='retro-comment-card-actions'>
//                                 <IconButton aria-label="cancel" onClick={handleCancel}>
//                                     <CloseIcon fontSize='small' color='error' />
//                                 </IconButton>
//                                 <IconButton aria-label="save" onClick={() => handleSave(null)}>
//                                     <CheckIcon fontSize='small' color='success' />
//                                 </IconButton>
//                             </div>
//                         </div>
//                     ) : (
//                         <Button fullWidth variant="outlined"
//                             onClick={() => {
//                                 setIsAddNew(true);
//                                 setEditedValue('');
//                             }}
//                         >
//                             Add New Item
//                         </Button>
//                     )}
//                 </CardContent>
//             </Card>
//         </Grid>
//     );
// };

// RetroColumn.propTypes = {
//     title: PropTypes.string.isRequired,
//     data: PropTypes.array.isRequired,
//     addComment: PropTypes.func.isRequired,
// };







import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Stack,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';


export default function RetroColumn({ title, items, onAdd }) {
    const [isAdding, setIsAdding] = useState(false);
    const [draft, setDraft] = useState('');

    const handleSubmit = () => {
        if (draft.trim()) {
            onAdd(draft.trim());
            setDraft('');
            setIsAdding(false);
        }
    };

    return (
        <Card elevation={3}>
            <CardHeader
                title={title}
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ bgcolor: 'primary.main', color: 'white' }}
            />

            <CardContent>
                <Stack spacing={2}>
                    {items.map((item, index) => (
                        <Card key={index} variant="outlined">
                            <CardContent>
                                <Typography variant="body2">{item.comment}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    ~ {item.createdBy}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}

                    {isAdding ? (
                        <Stack spacing={1}>
                            <TextField
                                multiline
                                rows={3}
                                autoFocus
                                fullWidth
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Enter your comment..."
                            />
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSubmit}
                                >
                                    Add
                                </Button>
                                <Button
                                    color="error"
                                    size="small"
                                    onClick={() => setIsAdding(false)}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setIsAdding(true)}
                        >
                            Add Comment
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

RetroColumn.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired
};