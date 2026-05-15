import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, CardActions, 
    Button, IconButton, TextField, InputAdornment, Dialog, 
    DialogTitle, DialogContent, DialogActions, Fab,
    Avatar, Chip, Stack, MenuItem, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { 
    Add as AddIcon, 
    Search as SearchIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Book as SubjectIcon,
    AccessTime as TimeIcon,
    Star as CreditIcon,
    Science as LabIcon,
    CloudUpload as UploadIcon,
    Description as FileIcon
} from '@mui/icons-material';
import axios from 'axios';
import fileService from '../services/fileService';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'success' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentSubject, setCurrentSubject] = useState({
        name: '', code: '', questionBankUrl: '', credits: 3, hoursPerWeek: 3, semester: 1, isLab: false
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setSubjects(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await fileService.uploadFile(file);
            setCurrentSubject({ ...currentSubject, questionBankUrl: result.data.filePath });
            setMessage({ text: 'Question bank uploaded successfully!', type: 'success' });
            setOpenSnackbar(true);
        } catch (err) {
            setMessage({ text: 'Failed to upload file', type: 'error' });
            setOpenSnackbar(true);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            
            if (editMode) {
                await axios.put(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects/${currentSubject._id}`, currentSubject, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects`, currentSubject, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setOpen(false);
            fetchSubjects();
            resetForm();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to save subject';
            alert(`Error: ${errorMsg}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this subject?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://backend-1-x7ra.onrender.com')}/api/subjects/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                fetchSubjects();
            } catch (err) {
                alert('Failed to delete subject');
            }
        }
    };

    const resetForm = () => {
        setCurrentSubject({
            name: '', code: '', questionBankUrl: '', credits: 3, hoursPerWeek: 3, semester: 1, isLab: false
        });
        setEditMode(false);
    };

    const filteredSubjects = subjects.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Subject Management</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => { resetForm(); setOpen(true); }}
                >
                    Add Subject
                </Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Search subjects by name or code..."
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 4, bgcolor: 'white' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={3}>
                {filteredSubjects.map((subject) => (
                    <Grid item xs={12} sm={6} md={4} key={subject._id}>
                        <Card sx={{ borderRadius: 3, position: 'relative' }}>
                            {subject.isLab && (
                                <Chip 
                                    label="LAB" 
                                    size="small" 
                                    color="secondary" 
                                    icon={<LabIcon />}
                                    sx={{ position: 'absolute', top: 12, right: 12 }}
                                />
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                                        <SubjectIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{subject.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">Code: {subject.code}</Typography>
                                    </Box>
                                </Box>
                                
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <Chip label={`${subject.credits} Credits`} size="small" icon={<CreditIcon fontSize="small" />} />
                                    <Chip label={`${subject.hoursPerWeek} hrs/wk`} size="small" icon={<TimeIcon fontSize="small" />} />
                                    <Chip label={`Sem ${subject.semester}`} size="small" color="primary" variant="outlined" />
                                </Stack>

                                {subject.questionBankUrl && (
                                    <Button 
                                        size="small" 
                                        startIcon={<FileIcon />} 
                                        sx={{ mt: 2 }}
                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${subject.questionBankUrl}`}
                                        target="_blank"
                                    >
                                        View Question Bank
                                    </Button>
                                )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', bgcolor: '#fcfcfc' }}>
                                <IconButton size="small" onClick={() => { setCurrentSubject(subject); setEditMode(true); setOpen(true); }}><EditIcon fontSize="small" color="primary" /></IconButton>
                                <IconButton size="small" onClick={() => handleDelete(subject._id)}><DeleteIcon fontSize="small" color="error" /></IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Subject Name"
                            value={currentSubject.name}
                            onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Subject Code"
                            value={currentSubject.code}
                            onChange={(e) => setCurrentSubject({ ...currentSubject, code: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Question Bank File</Typography>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button variant="outlined" component="label" startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}>
                                {uploading ? 'Uploading...' : (currentSubject.questionBankUrl ? 'Change File' : 'Upload QB')}
                                <input type="file" hidden onChange={handleFileChange} accept=".pdf,.xlsx,.xls,.csv" />
                            </Button>
                            {currentSubject.questionBankUrl && (
                                <Typography variant="caption" color="success.main">File Attached ✓</Typography>
                            )}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Credits"
                                    value={currentSubject.credits}
                                    onChange={(e) => setCurrentSubject({ ...currentSubject, credits: e.target.value })}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Hrs/Week"
                                    value={currentSubject.hoursPerWeek}
                                    onChange={(e) => setCurrentSubject({ ...currentSubject, hoursPerWeek: e.target.value })}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Semester"
                                    value={currentSubject.semester}
                                    onChange={(e) => setCurrentSubject({ ...currentSubject, semester: e.target.value })}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input 
                                type="checkbox" 
                                id="isLab" 
                                checked={currentSubject.isLab} 
                                onChange={(e) => setCurrentSubject({ ...currentSubject, isLab: e.target.checked })} 
                            />
                            <label htmlFor="isLab">This is a Lab subject</label>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={uploading}>{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>

            <Fab 
                color="secondary" 
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => { resetForm(); setOpen(true); }}
            >
                <AddIcon />
            </Fab>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default Subjects;
