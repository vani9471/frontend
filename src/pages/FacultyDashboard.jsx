import React, { useState } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, 
    Button, Tabs, Tab, List, ListItem, ListItemText, 
    ListItemIcon, IconButton, TextField, MenuItem,
    CircularProgress, Alert, Snackbar
} from '@mui/material';
import { 
    CloudUpload, PostAdd, HistoryEdu, AssignmentTurnedIn,
    Delete, Edit, CheckCircle 
} from '@mui/icons-material';
import fileService from '../services/fileService';

const FacultyDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'success' });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedFile(null);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ text: 'Please select a file first', type: 'error' });
            setOpenSnackbar(true);
            return;
        }

        setUploading(true);
        try {
            const result = await fileService.uploadFile(selectedFile);
            setMessage({ text: `File uploaded successfully: ${result.data.originalName}`, type: 'success' });
            setOpenSnackbar(true);
            setSelectedFile(null);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Upload failed', type: 'error' });
            setOpenSnackbar(true);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Faculty Dashboard</Typography>
                <Typography variant="h6" color="textSecondary">Manage your subjects, questions, and exams.</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ borderRadius: 3 }}>
                        <Tabs 
                            orientation="vertical" 
                            value={tabValue} 
                            onChange={handleTabChange}
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tab icon={<PostAdd />} iconPosition="start" label="Add Questions" />
                            <Tab icon={<CloudUpload />} iconPosition="start" label="Upload QB" />
                            <Tab icon={<AssignmentTurnedIn />} iconPosition="start" label="Mock Exams" />
                            <Tab icon={<HistoryEdu />} iconPosition="start" label="Previous Papers" />
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 4, borderRadius: 3, minHeight: 400 }}>
                        {tabValue === 0 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Add New Question</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField select fullWidth label="Select Subject">
                                            <MenuItem value="CS304">Database Management Systems</MenuItem>
                                            <MenuItem value="CS305">Python Programming</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField select fullWidth label="Unit">
                                            {[1,2,3,4,5].map(u => <MenuItem key={u} value={u}>Unit {u}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField select fullWidth label="Marks">
                                            {[2,5,10].map(m => <MenuItem key={m} value={m}>{m} Marks</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={4} label="Question Text" placeholder="Enter question here..." />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" size="large" startIcon={<CheckCircle />}>Save Question</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {tabValue === 1 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h5" gutterBottom>Upload Bulk Question Bank</Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                                    Upload an Excel or CSV file to import questions in bulk.
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Button variant="outlined" component="label">
                                        {selectedFile ? selectedFile.name : 'Select File'}
                                        <input type="file" hidden onChange={handleFileChange} accept=".xlsx,.xls,.csv" />
                                    </Button>
                                    {selectedFile && (
                                        <Button 
                                            variant="contained" 
                                            onClick={handleUpload} 
                                            disabled={uploading}
                                            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                                        >
                                            {uploading ? 'Uploading...' : 'Confirm Upload'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Create Mock Exam</Typography>
                                <Typography color="textSecondary">Create a new timer-based exam for your students.</Typography>
                                <Button variant="contained" sx={{ mt: 2 }}>Define New Exam</Button>
                            </Box>
                        )}

                        {tabValue === 3 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Upload Previous Paper</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField select fullWidth label="Select Subject">
                                            <MenuItem value="CS304">Database Management Systems</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Year" placeholder="2023" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField select fullWidth label="Type">
                                            <MenuItem value="Regular">Regular</MenuItem>
                                            <MenuItem value="Supplementary">Supplementary</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Button variant="outlined" component="label">
                                                {selectedFile ? selectedFile.name : 'Select PDF'}
                                                <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
                                            </Button>
                                            {selectedFile && (
                                                <Button 
                                                    variant="contained" 
                                                    onClick={handleUpload} 
                                                    disabled={uploading}
                                                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                                                >
                                                    {uploading ? 'Uploading...' : 'Upload Now'}
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={message.type} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FacultyDashboard;

