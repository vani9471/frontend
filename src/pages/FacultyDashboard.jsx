import React, { useState } from 'react';
import { 
    Container, Typography, Box, Grid, Paper, 
    Button, Tabs, Tab, List, ListItem, ListItemText, 
    ListItemIcon, IconButton, TextField, MenuItem 
} from '@mui/material';
import { 
    CloudUpload, PostAdd, HistoryEdu, AssignmentTurnedIn,
    Delete, Edit, CheckCircle 
} from '@mui/icons-material';

const FacultyDashboard = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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
                                <Button variant="outlined" component="label">
                                    Select File
                                    <input type="file" hidden />
                                </Button>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Create Mock Exam</Typography>
                                <Typography color="textSecondary">Create a new timer-based exam for your students.</Typography>
                                {/* Form for Mock Exam creation would go here */}
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
                                        <Button variant="contained" component="label">
                                            Upload PDF
                                            <input type="file" hidden accept=".pdf" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FacultyDashboard;
